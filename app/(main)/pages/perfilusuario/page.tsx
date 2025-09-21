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
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService';
import Usuario from '../usuario/page';
import { UsuarioService } from '@/service/UsuarioService';
import { error } from 'console';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

const PerfilUsuario = () => {
    let perfilUsuarioVazio: Projeto.PerfilUsuario = {
        id: undefined,
        perfil: { descricao: '' },
        usuario: { nome: '', login: '', senha: '', email: '' }
    };

    const [perfisUsuario, setPerfilsUsuario] = useState<Projeto.PerfilUsuario[] | null>(null);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfilsUsuarioDialog, setDeletePerfilsUsuarioDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Projeto.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfilsUsuario, setSelectedPerfilsUsuario] = useState<Projeto.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = useMemo(() => new PerfilUsuarioService(), []);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [usuarios, setUsuarios] = useState<Projeto.Usuario[]>([]);
    const [perfis, setPrefis] = useState<Projeto.Perfil[]>([]);

    useEffect(() => {
        if (!perfisUsuario) {
            perfilUsuarioService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPerfilsUsuario(response.data)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }, [perfilUsuarioService, perfisUsuario]);

    useEffect(() => {
        if (perfilUsuarioDialog) {
            usuarioService.listarTodos()
                .then((response) => setUsuarios(response.data))
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
    }, [perfilUsuarioDialog, perfilService, usuarioService]);

    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilUsuarioDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfilsUsuarioDialog = () => {
        setDeletePerfilsUsuarioDialog(false);
    };

    const savePerfilUsuario = () => {
        setSubmitted(true);

        if (!perfilUsuario.id) {
            perfilUsuarioService.inserir(perfilUsuario)
                .then((Response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfilsUsuario(null);
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
            perfilUsuarioService.alterar(perfilUsuario).then((response) => {
                setPerfilUsuarioDialog(false);
                setPerfilUsuario(perfilUsuarioVazio);
                setPerfilsUsuario(null);
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

    const editPerfilUsuario = (perfilUsuario: Projeto.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfilUsuario: Projeto.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
        if (perfilUsuario.id) {
            perfilUsuarioService.excluir(perfilUsuario.id)
                .then((response) => {
                    setPerfilUsuario(perfilUsuarioVazio);
                    setDeletePerfilUsuarioDialog(false);
                    setPerfilsUsuario(null);
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
        setDeletePerfilsUsuarioDialog(true);
    };

    const deleteSelectedPerfilsUsuario = () => {
        Promise.all(selectedPerfilsUsuario.map(async (_perfilUsuario) => {
            if (_perfilUsuario.id) {
                await perfilUsuarioService.excluir(_perfilUsuario.id)

            }
        })).then((response) => {
            setPerfilsUsuario(null);
            setSelectedPerfilsUsuario([]);
            setDeletePerfilsUsuarioDialog(false);
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
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario[`${name}`] = val;

        setPerfilUsuario(_perfilUsuario);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfilsUsuario || !(selectedPerfilsUsuario as any).length} />
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

    const idBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const usuarioBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Usuário</span>
                {rowData.usuario.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfilUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Perfils</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfilUsuario} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilsUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfilsUsuario} />
        </>
    );

    const onSelectionPerfilchange = (perfil: Projeto.Perfil) => {
        let _perfilUsuario = { ...perfilUsuario};
        _perfilUsuario.perfil = perfil;
        setPerfilUsuario(_perfilUsuario);
    }

    const onSelectionUsuariochange = (usuario: Projeto.Usuario) => {
        let _perfilUsuario = { ...perfilUsuario};
        _perfilUsuario.usuario = usuario;
        setPerfilUsuario(_perfilUsuario);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuario}
                        selection={selectedPerfilsUsuario}
                        onSelectionChange={(e) => setSelectedPerfilsUsuario(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Perfils"
                        globalFilter={globalFilter}
                        emptyMessage="nenhum perfil encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="usuario" header="Usuário" sortable body={usuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }} header="Perfils" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        <form onSubmit={(e) => { e.preventDefault(); savePerfilUsuario(); }}>

                            <div className="field">
                                <label htmlFor="perfil">Perfil</label>
                                <Dropdown optionLabel='descricao' value={perfilUsuario.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectionPerfilchange(e.value)} placeholder='Selecione um perfil...'/>
                                {submitted && !perfilUsuario.perfil && <small className="p-invalid">Perfil é Obrigatorio.</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="usuario">Usuário</label>
                                <Dropdown optionLabel='nome' value={perfilUsuario.usuario} options={usuarios} filter onChange={(e: DropdownChangeEvent) => onSelectionUsuariochange(e.value)} placeholder='Selecione um usuário...'/>
                                {submitted && !perfilUsuario.usuario && <small className="p-invalid">Usuário é Obrigatorio.</small>}
                            </div>
                            <Button type='submit' style={{ display: 'none' }} />
                        </form>
                    </Dialog>


                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Você realmente deseja deletar o Perfil <b>{perfilUsuario.usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePerfilsUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfisUsuario && <span>Você realmente deseja deletar os Perfils selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
