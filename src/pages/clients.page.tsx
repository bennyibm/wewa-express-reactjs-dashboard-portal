import { useEffect, useMemo, useState } from 'react';
import { useApiCrud } from '../hooks';
import { Client, ResponseModel } from '../models';
import DataTable from '../components/data-table.component';
import { FiUserPlus } from 'react-icons/fi';
import EditClient from '../components/edit.driver';
import DUMMY_DRIVERS from '../utils/dummy/drivers';
import { GetAllParams } from '../hooks/api/use-api-crud';

type props={
    setHeading: (title: string, description: string) => void
}
export default function ClientsPage({setHeading}: props){
    const [showEditClient, setShowEditClient] = useState(false)
    // const {findAll} = useApiCrud<Client>("drivers")
    const findAll = (props: GetAllParams) => Promise.resolve({
        totalElements: DUMMY_DRIVERS.length,
        totalPages: 1,
        currentPage: 1,
        contents: DUMMY_DRIVERS.slice(0, 10)
    })

    const headers= useMemo( () => ([
        {label: "Prénom", key: "first" as keyof Client},
        {label: "Nom", key: "last" as keyof Client},
        {label: "Genre", key: "gender" as keyof Client},
        {label: "Téléphone", key: "phone" as keyof Client},
        {label: "Status", key: "status" as keyof Client},
    ]), [])

    const RenderList = useMemo( () => () => (
        <div className="flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
            <DataTable<Partial<Client>> title="" fetchData={findAll} actionButton={{ label:"détails", link:"" }} headers={headers} headbutton={{ label: "Ajouter", onClick: () => setShowEditClient(true), icon: <FiUserPlus /> }} />
        </div>
    ), [headers])
    
    useEffect( () => {
        setHeading("Utilisateurs Mobile","")
    }, [setHeading])

    return(
        <>
            {showEditClient && <EditClient onClose={() => setShowEditClient(false) } />}
            <RenderList />
        </>
    )
}