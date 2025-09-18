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

const Perfil = () => {
    let perfilVazio: Projeto.Perfil = {
        id: undefined,
        descricao: ''
    };

    const [perfis, setPerfils] = useState<Projeto.Perfil[] | null>(null);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfilsDialog, setDeletePerfilsDialog] = useState(false);
    const [perfil, setPerfil] = useState<Projeto.Perfil>(perfilVazio);
    const [selectedPerfils, setSelectedPerfils] = useState<Projeto.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilService = useMemo(() => new PerfilService(), []);

    useEffect(() => {
        if (!perfis) {
            perfilService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPerfils(response.data)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }, [perfilService, perfis]);

    const openNew = () => {
        setPerfil(perfilVazio);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    };

    const hideDeletePerfilsDialog = () => {
        setDeletePerfilsDialog(false);
    };

    const savePerfil = () => {
        setSubmitted(true);

        if (!perfil.id) {
            perfilService.inserir(perfil)
                .then((Response) => {
                    setPerfilDialog(false);
                    setPerfil(perfilVazio);
                    setPerfils(null);
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
            perfilService.alterar(perfil).then((response) => {
                setPerfilDialog(false);
                setPerfil(perfilVazio);
                setPerfils(null);
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

    const editPerfil = (perfil: Projeto.Perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const confirmDeletePerfil = (perfil: Projeto.Perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);
    };

    const deletePerfil = () => {
        if (perfil.id) {
            perfilService.excluir(perfil.id)
                .then((response) => {
                    setPerfil(perfilVazio);
                    setDeletePerfilDialog(false);
                    setPerfils(null);
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
        setDeletePerfilsDialog(true);
    };

    const deleteSelectedPerfils = () => {
        Promise.all(selectedPerfils.map(async (_perfil) => {
            if (_perfil.id) {
                await perfilService.excluir(_perfil.id)

            }
        })).then((response) => {
            setPerfils(null);
            setSelectedPerfils([]);
            setDeletePerfilsDialog(false);
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
        let _perfil = { ...perfil };
        _perfil[`${name}`] = val;

        setPerfil(_perfil);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfils || !(selectedPerfils as any).length} />
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

    const idBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const descricaoBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
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
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );
    const deletePerfilsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilsDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfils} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfis}
                        selection={selectedPerfils}
                        onSelectionChange={(e) => setSelectedPerfils(e.value as any)}
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
                        <Column field="descricao" header="Descrição" sortable body={descricaoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Perfils" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                        <form onSubmit={(e) => { e.preventDefault(); savePerfil(); }}>
                            
                            <div className="field">
                                <label htmlFor="descricao">Descrição</label>
                                <InputText
                                    id="descricao"
                                    value={perfil.descricao}
                                    onChange={(e) => onInputChange(e, 'descricao')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !perfil.descricao
                                    })}
                                />
                                {submitted && !perfil.descricao && <small className="p-invalid">Descrição Obrigatorio.</small>}
                            </div>
                            {}
                            <Button type='submit' style={{ display: 'none' }} />
                        </form>
                    </Dialog>


                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && (
                                <span>
                                    Você realmente deseja deletar o Perfil <b>{perfil.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilsDialogFooter} onHide={hideDeletePerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfis && <span>Você realmente deseja deletar os Perfils selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
