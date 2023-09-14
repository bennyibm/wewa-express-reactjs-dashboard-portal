import { useEffect, useMemo } from "react"
import DataTable from "../components/data-table.component"
import useApiCrud from '../hooks/api/use-api-crud';
import Delivery from '../models/delivery';
import { useNavigate } from "react-router-dom";

type props={
    setHeading: (title: string, description?: string) => void
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
            <div className="flex xl:justify-between gap-y-10 gap-x-4 lg:gap-x-6 xl:gap-x-10">
                <div className="text-slate-700 w-40 lg:w-52 xl:w-72 h-40 p-5 bg-white flex justify-center items-center flex-col gap-y-4 rounded-lg shadow">
                    <h3 className="text-primary text-center text-lg">Courses encourt</h3>
                    <span className="text-center text-4xl font-semibold">300</span>
                </div>
                <div className="text-slate-700 w-40 lg:w-52 xl:w-72 h-40 p-5 bg-white flex justify-center items-center flex-col gap-y-4 rounded-lg shadow">
                    <h3 className="text-primary text-center text-lg">Coursiers</h3>
                    <span className="text-center text-4xl font-semibold">300</span>
                </div>
                <div className="text-slate-700 w-40 lg:w-52 xl:w-72 h-40 p-5 bg-white flex justify-center items-center flex-col gap-y-4 rounded-lg shadow">
                    <h3 className="text-primary text-center text-lg">Clients (Mobile)</h3>
                    <span className="text-center text-4xl font-semibold">300</span>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
                <DataTable<Delivery> title="Dernieres livraisons" fetchData={findAll} headers={headers}  headbutton={{ label: "voir plus", link: "deliveries" }} />
            </div>
        </main>
    )
};
