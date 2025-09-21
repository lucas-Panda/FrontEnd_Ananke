/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { PerfilService } from '@/service/PerfilService';
import { error } from 'console';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import Recurso from '../recurso/page';
import { RecursoService } from '@/service/RecursoService';
import { PermissaoPerfilRecursoService } from '@/service/PermissaoPerfilRecursoService';

const PermissaoPerfilRecurso = () => {
    let permissaoPerfilRecursoVazio: Projeto.PermissaoPerfilRecurso = {
        id: undefined,
        perfil: { descricao: '' },
        Recurso: { nome: '', chave: ''}
    };

    const [permissaoPerfisRecurso, setPermissaoPerfilsRecurso] = useState<Projeto.PermissaoPerfilRecurso[] | null>(null);
    const [permissaoPerfilRecursoDialog, setPermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursoDialog, setDeletePermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilsRecursoDialog, setDeletePermissaoPerfilsRecursoDialog] = useState(false);
    const [permissaoPerfilRecurso, setPermissaoPerfilRecurso] = useState<Projeto.PermissaoPerfilRecurso>(permissaoPerfilRecursoVazio);
    const [selectedPermissaoPerfilsRecurso, setSelectedPermissaoPerfilsRecurso] = useState<Projeto.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const permissaoPerfilRecursoService = useMemo(() => new PermissaoPerfilRecursoService(), []);
    const recursoService = useMemo(() => new RecursoService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [recursos, setRecursos] = useState<Projeto.Recurso[]>([]);
    const [perfis, setPrefis] = useState<Projeto.Perfil[]>([]);

    useEffect(() => {
        if (!permissaoPerfisRecurso) {
            permissaoPerfilRecursoService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPermissaoPerfilsRecurso(response.data)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }, [permissaoPerfilRecursoService, permissaoPerfisRecurso]);

    useEffect(() => {
        if (permissaoPerfilRecursoDialog) {
            recursoService.listarTodos()
                .then((response) => setRecursos(response.data))
                .catch(error => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de usuários!'
                    });
                });
            perfilService.listarTodos()
                .then((response) => setPrefis(response.data))
                .catch(error => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de usuários!'
                    });
                });
        }
    }, [permissaoPerfilRecursoDialog, perfilService, recursoService]);

    const openNew = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursoDialog = () => {
        setDeletePermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilsRecursoDialog = () => {
        setDeletePermissaoPerfilsRecursoDialog(false);
    };

    const savePermissaoPerfilRecurso = () => {
        setSubmitted(true);

        if (!permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService.inserir(permissaoPerfilRecurso)
                .then((Response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilsRecurso(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil cadastrado com sucesso'
                    });
                }).catch((error) => {
                    const msg = error.response?.data?.message || error.message || "erro desconhecido";
                    console.log(msg);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar!' + msg
                    })
                });
        } else {
            permissaoPerfilRecursoService.alterar(permissaoPerfilRecurso).then((response) => {
                setPermissaoPerfilRecursoDialog(false);
                setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                setPermissaoPerfilsRecurso(null);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Perfil Alterado com sucesso'
                });
            }).catch((error) => {
                const msg = error.response?.data?.message || error.message || "erro desconhecido";
                console.log(msg);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao alterar!' + msg
                })
            })
        }
    };

    const editPermissaoPerfilRecurso = (permissaoPerfilRecurso: Projeto.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso({ ...permissaoPerfilRecurso });
        setPermissaoPerfilRecursoDialog(true);
    };

    const confirmDeletePermissaoPerfilRecurso = (permissaoPerfilRecurso: Projeto.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso(permissaoPerfilRecurso);
        setDeletePermissaoPerfilRecursoDialog(true);
    };

    const deletePermissaoPerfilRecurso = () => {
        if (permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService.excluir(permissaoPerfilRecurso.id)
                .then((response) => {
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setDeletePermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilsRecurso(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil Deletado com sucesso',
                        life: 3000
                    });
                }).catch((error) => {
                    const msg = error.response?.data?.message || error.message || "erro desconhecido";
                    console.log(msg);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao Deletar!' + msg,
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePermissaoPerfilsRecursoDialog(true);
    };

    const deleteSelectedPermissaoPerfilsRecurso = () => {
        Promise.all(selectedPermissaoPerfilsRecurso.map(async (_permissaoPerfilRecurso) => {
            if (_permissaoPerfilRecurso.id) {
                await permissaoPerfilRecursoService.excluir(_permissaoPerfilRecurso.id)

            }
        })).then((response) => {
            setPermissaoPerfilsRecurso(null);
            setSelectedPermissaoPerfilsRecurso([]);
            setDeletePermissaoPerfilsRecursoDialog(false);
            toast.current?.show({
                severity: 'info',
                summary: 'Sucesso!',
                detail: 'Perfils Deletados com sucesso',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao Deletar Perfils!',
                life: 3000
            });
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso };
        _permissaoPerfilRecurso[`${name}`] = val;

        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPermissaoPerfilsRecurso || !(selectedPermissaoPerfilsRecurso as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recurso.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPermissaoPerfilRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePermissaoPerfilRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Permissão de Perfil</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePermissaoPerfilRecurso} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePermissaoPerfilRecurso} />
        </>
    );
    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilsRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPermissaoPerfilsRecurso} />
        </>
    );

    const onSelectionPerfilchange = (perfil: Projeto.Perfil) => {
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso};
        _permissaoPerfilRecurso.perfil = perfil;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    }

    const onSelectionRecursochange = (recurso: Projeto.Recurso) => {
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso};
        _permissaoPerfilRecurso.recurso = recurso;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissaoPerfisRecurso}
                        selection={selectedPermissaoPerfilsRecurso}
                        onSelectionChange={(e) => setSelectedPermissaoPerfilsRecurso(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Permissões"
                        globalFilter={globalFilter}
                        emptyMessage="nenhum perfil encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={permissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Permissões de Perfis" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        <form onSubmit={(e) => { e.preventDefault(); savePermissaoPerfilRecurso(); }}>

                            <div className="field">
                                <label htmlFor="perfil">Perfil</label>
                                <Dropdown optionLabel='descricao' value={permissaoPerfilRecurso.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectionPerfilchange(e.value)} placeholder='Selecione um perfil...'/>
                                {submitted && !permissaoPerfilRecurso.perfil && <small className="p-invalid">Perfil é Obrigatorio.</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="recurso">Recurso</label>
                                <Dropdown optionLabel='nome' value={permissaoPerfilRecurso.recurso} options={recursos} filter onChange={(e: DropdownChangeEvent) => onSelectionRecursochange(e.value)} placeholder='Selecione um recurso...'/>
                                {submitted && !permissaoPerfilRecurso.recurso && <small className="p-invalid">Recurso é Obrigatorio.</small>}
                            </div>
                            <Button type='submit' style={{ display: 'none' }} />
                        </form>
                    </Dialog>


                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilDialogFooter} onHide={hideDeletePermissaoPerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && (
                                <span>
                                    Você realmente deseja deletar o Perfil <b>{permissaoPerfilRecurso.perfil.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilsRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePermissaoPerfilsRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfisRecurso && <span>Você realmente deseja deletar as Permissões selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PermissaoPerfilRecurso;
