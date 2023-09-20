import { useCallback, useEffect, useMemo, useState } from "react"
import DataTable from "../components/data-table.component"
import useApiCrud from '../hooks/api/use-api-crud';
import Delivery from '../models/delivery';
import { useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { BiLoaderAlt } from "react-icons/bi";

type props={
    setHeading: (title: string, description?: string) => void
}

function CardStat({title, path} : {title: string, path: string}){
    const { count } = useApiCrud(path)
    const [value, setValue] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect( () => {
        setTimeout( () => {
            count()
            .then( res => setValue(res))
            .catch( () => {})
            .finally( () => setIsLoading(false))
        }, 5000)
    }, [count])

    return (
        <div className="text-slate-600 lg:w-64 xl:w-72 h-fit md:h-40 p-5 bg-white flex flex-col gap-y-4 rounded-lg shadow">
            <h3 className="text-300 text-sm md:text-xl">{title}</h3>
            <span className="text-4xl md:text-7xl font-semibold">                
                { !isLoading ? value : (
                    <span className="text-4xl text-gray-300 inline-block fa-solid fa-circle-notch animate-spin">
                        <BiLoaderAlt/>
                    </span>
                ) }
            </span>
        </div>
    )
}

export default function Dashboard({setHeading}: props) {
    const navigate = useNavigate()
    const {findAll} = useApiCrud<Delivery>("deliveries")
    const headers= useMemo( () => ([
        // {label: "Title", key: "title" as keyof Delivery},
    ]), [])
    
    useEffect( () => {
        setHeading("Dashboard", "")
    }, [setHeading])

    return(
        <main className="flex-1 flex flex-col gap-y-10">
            <div className="py-4 grid grid-cols-2 md:grid-cols-3 lg:flex xl:justify-between gap-4 sm:gap-8 xl:gap-10">
                <CardStat path="deliveries" title="Courses encourt" />
                <CardStat path="drivers" title="Coursiers" />
                <CardStat path="clients" title="Clients (Mobile)" />                
            </div>
            <div className="flex-1 flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
                <DataTable<Delivery> title="Dernieres livraisons" fetchData={findAll} headers={headers}  headbutton={{ label: "voir plus", link: "deliveries" }} />
            </div>
        </main>
    )
};
