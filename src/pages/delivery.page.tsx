import { useEffect, useMemo } from 'react';
import { BiUserPlus } from "react-icons/bi"
import { useApiCrud } from '../hooks';
import { Client, Delivery, Driver } from '../models';
import DataTable from '../components/data-table.component';
import { GetAllParams } from '../hooks/api/use-api-crud';
import DUMMY_DELIVERIES from '../utils/dummy/delivery';
import { Button } from '../components';
type props={
    setHeading: (title: string, description: string) => void
}
export default function DeliveryPage({setHeading}: props){
    // const {findAll} = useApiCrud<Delivery>("delievries")
    const findAll = (props: GetAllParams) => Promise.resolve({
        totalElements: DUMMY_DELIVERIES.length,
        totalPages: 1,
        currentPage: 1,
        contents: DUMMY_DELIVERIES.slice(0, 10)
    })

    const headers= useMemo( () => {
        const renderDriver = (delivery?: Delivery) => {
            if(delivery?.driver){
                return `${delivery.driver.user.first} ${delivery.driver.user.last}`
            }else{
                return (
                    <Button onClick={() => {} } className='bg-slate-100 hover:bg-slate-300 text-slate-700 text-lg p-1 flex flex-col items-center gap-y-0'>
                        <BiUserPlus/>
                        <span className='text-[.6rem]'>Affecter un chauffeur</span>
                    </Button>
                )
            }
        }

        return ([
            {label: "Code", key: "code" as keyof Delivery},
            {label: "Client", key: "client" as keyof Delivery, render: (delivery: Delivery) => `${delivery?.client?.first} ${delivery?.client?.last}`},
            {label: "Chauffeur", key: "driver" as keyof Delivery, render:renderDriver},
            {label: "Status", key: "status" as keyof Delivery},
        ])
    }, [])
    
    useEffect( () => {
        setHeading("Historique des livraison","")
    }, [setHeading])

    return(
        <div className="flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
            <DataTable<Delivery>  actionButton={{ label:"détails", link:"" }} fetchData={findAll} headers={headers} />
        </div>
    )
}