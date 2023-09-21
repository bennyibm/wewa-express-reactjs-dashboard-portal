import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiCrud } from '../hooks';
import { Driver, ResponseModel } from '../models';
import DataTable from '../components/data-table.component';
import { FiUserPlus } from 'react-icons/fi';
import EditDriver from '../components/edit.driver';
import DUMMY_DRIVERS from '../utils/dummy/drivers';
import { GetAllParams } from '../hooks/api/use-api-crud';
type props={
    setHeading: (title: string, description: string) => void
}
export default function DriversPage({setHeading}: props){
    const [showEditDriver, setShowEditDriver] = useState(false)
    const {findAll} = useApiCrud<Driver>("drivers")
    // const findAll = (props: GetAllParams) => Promise.resolve({
    //     totalElements: DUMMY_DRIVERS.length,
    //     totalPages: 1,
    //     currentPage: 1,
    //     contents: DUMMY_DRIVERS.slice(0, 10)
    // })

    const headers= useMemo( () => {
        const renderField = (driver: any, field: string) => {
            return driver.user[field]
        }
        return ([
            {render: (driver: Driver) => renderField(driver, "first"), label: "Prénom", key: "first" as keyof Driver},
            {render: (driver: Driver) => renderField(driver, "last"), label: "Nom", key: "last" as keyof Driver},
            { label: "Genre", key: "gender" as keyof Driver},
            {render: (driver: Driver) => renderField(driver, "phone"), label: "Téléphone", key: "phone" as keyof Driver},
            { label: "Status", key: "status" as keyof Driver},
        ])
    }, [])

    const RenderList = useMemo( () => () => (
        <div className="flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
            <DataTable<Partial<Driver>> title="" fetchData={findAll} actionButton={{ label:"détails", link:"" }} headers={headers} headbutton={{ label: "Ajouter", onClick: () => setShowEditDriver(true), icon: <FiUserPlus /> }} />
        </div>
    ), [findAll, headers])

    const onEditClosed = useCallback( (succeded?: boolean) => {
        setShowEditDriver(false)
        if(succeded){
            document.location.reload()
        }
    }, [])
    
    useEffect( () => {
        setHeading("Chauffeurs enregistrés","")
    }, [setHeading])

    return(
        <>
            {showEditDriver && <EditDriver onClose={onEditClosed} />}
            <RenderList />
        </>
    )
}