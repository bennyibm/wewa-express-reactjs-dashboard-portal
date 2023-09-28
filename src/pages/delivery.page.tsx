import { useCallback, useEffect, useMemo, useState } from 'react';
import { BiUserPlus } from "react-icons/bi"
import { useApiCrud, useApiSecured } from '../hooks';
import { Client, Delivery, Driver } from '../models';
import DataTable from '../components/data-table.component';
import { Button } from '../components';
import { MdOutlineDeliveryDining } from "react-icons/md"
import AddDelivery from '../components/add.delivery';
type props={
    setHeading: (title: string, description: string) => void
}

type States = {
    drivers?: Driver[]
    clients?: Client[]
}

export default function DeliveryPage({setHeading}: props){
    const {findAll} = useApiCrud<Delivery>("deliveries")
    const {api} = useApiSecured("")
    const [showAddDelivery, setShowAddDelivery] = useState(false)

    const [states, setStates] = useState<States>()

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
            {label: "Client", key: "client" as keyof Delivery, render: (delivery: Delivery) => `${delivery?.client?.user?.first} ${delivery?.client?.user?.last}`},
            {label: "Chauffeur", key: "driver" as keyof Delivery, render:renderDriver},
            {label: "Status", key: "status" as keyof Delivery},
        ])
    }, [])

    const RenderList = useMemo( () => () => (
        <div className="flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
            <DataTable<Delivery>  actionButton={{ label:"détails", link:"" }} fetchData={findAll} headers={headers} headbutton={{ label: "créer", onClick: () => setShowAddDelivery(true), icon: <MdOutlineDeliveryDining className='text-2xl' /> }} />
        </div>
    ), [findAll, headers])

    const onEditClosed = useCallback( (succeded?: boolean) => {
        setShowAddDelivery(false)
        if(succeded){
            document.location.reload()
        }
    }, [])

    const fetchTiers = useCallback( () => {
        api.get("drivers").then( ({data}) => setStates(prev => ({...prev, drivers: data.contents })) )
        api.get("clients").then( ({data}) => setStates(prev => ({...prev, clients: data.contents })) )
    }, [])
    
    useEffect( () => {
        setHeading("Historique des livraison","")
    }, [setHeading])

    useEffect( () => {
        fetchTiers()
    }, [])

    return(
        <>
            {showAddDelivery && <AddDelivery data={states} onClose={onEditClosed} />}
            <RenderList />
        </>        
    )
}