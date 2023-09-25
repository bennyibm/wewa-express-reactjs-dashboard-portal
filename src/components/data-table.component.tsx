import { useCallback, useEffect, useMemo, useState } from "react"
import { CgDetailsMore } from "react-icons/cg"
import { PiList } from "react-icons/pi"
import SearchBox from "./search-box"
import ErrorComponent from "./error-component"
import { GetAllParams } from "../hooks/api/use-api-crud"
import { executeAfter } from "../utils/helpers/timeout-interval"
import { AbstractEntity, ResponseModel } from "../models"
import Button from "./button"
import Loader from "./loader"
import { Link } from "react-router-dom"

type props<T>={
    fetchData: (props: GetAllParams) => Promise<ResponseModel<T>>
    renderItem?: (lineItem: T, index: number) => Element    
    renderEmptyList?: Element
    renderError?: Element
    title?: string
    headers: {label: string, key: keyof T, render?: (el: any) => any }[]
    noSearchBox?: boolean
    headbutton?: {label: string, link?: string, onClick?: () => void, icon?: any}
    actionButton?: { label: string, onClick?: () => void, link?: string }
}

type States<T>={
    data?: ResponseModel<T>
    page: number
    search?: string
    isError?: boolean
    isLoading?: boolean
    isEmpty?: boolean
    hasMoreItems?: boolean
}

export default function DataTable<T extends AbstractEntity>({title, headers, renderItem, renderEmptyList, renderError, fetchData, noSearchBox, headbutton, actionButton}: props<T>){
    const [states, setStates] = useState<States<T>>({page: 1, isLoading: false,})

    const loadData = useMemo( () => () => {
        setStates(prev => ({...prev, isLoading : true, isError : false}))
        executeAfter({
            callback : () => {
                fetchData({ page : states.page, size : 5, search : states.search })
                .then( response => {
                    setStates( prev => ({
                        ...prev, 
                        isEmpty : response.contents.length === 0,
                        hasMoreItems : response.totalPages > states.page,
                        data : {...response, contents : [ ...(prev.page === 1 ? [] : prev.data?.contents!), ...response.contents ] }
                    }))
                })
                .catch( err => setStates(prev =>({...prev, isError : true})) )
                .finally( () => setStates(prev => ({...prev, isLoading : false})))
            },
            delay : 2000,
        })
    }, [fetchData, states.page, states.search])

    useEffect( () => {
        loadData()
    }, [loadData])

    return(
        <div className="">
            <div className="bg-white flex max-xl:flex-col xl:items-center xl:justify-between gap-y-4 p-3 xl:p-6 border-b-2 border-primary/10">
                { title && <h3 className="text-slate-700 text-2xl">{title}</h3>}
                <div className=" max-xl:w-full max-xl:flex-1 flex xl:gap-x-10 items-center justify-between">
                    {!noSearchBox &&  <SearchBox placeholder="Saisissez votre recherche ici" callback={ search => setStates( prev => ({...prev, page : 1, search})) } debounceDuration={1000} />}
                    { headbutton && <Button className="h-fit flex items-center gap-x-2" link={headbutton.link} onClick={headbutton.onClick}>{headbutton.label} {headbutton.icon}</Button> }
                </div>
            </div>
            <div className="w-full overflow-auto">
                <table className="px-6 w-full">
                    { !states.isLoading && ((states.data?.contents?.length || 0) > 0) && (                    
                        <thead>
                            <tr className="border-b bg-primary/10">
                                { headers.map( ({label, key}, index) => (
                                    <th key={index} className="font-semibold text-xs sm:text-base text-left p-4">{label}</th>
                                ))}
                                {/* { actionButton && ( <th className="bg-primary/40 w-fit text-left p-4"> Action </th> ) } */}
                            </tr>
                        </thead>
                    ) }
                    <tbody className="w-full">
                        { !states.isLoading && states.data?.contents?.map( item => (
                            <tr key={item._id} className="text-xs sm:text-sm w-full border-b odd:bg-primary/[.03]">
                                { headers.map( ({key, render}, headerIndex) => (
                                    <td className="p-4" key={headerIndex}>{ (render ? render(item) : item[key] as any).toString().replaceAll("-", "")}</td>
                                )) }

                                { actionButton && (
                                    <td className="py-2 px-4 bg-primary/5 whitespace-nowrap">
                                        <Link className="flex items-center gap-x-2 text- underline" to={actionButton.link || ""} onClick={actionButton.onClick}>
                                            {actionButton.label} 
                                            {/* <CgDetailsMore/> */}
                                        </Link>
                                    </td>
                                ) }
                            </tr>
                        ))}

                        { states.isLoading && (
                            <tr className="w-full">
                                <td colSpan={headers.length} className="py-16 flex justify-center items-center">
                                    <Loader/>
                                </td>
                            </tr>
                        )}

                        { states.isError && <ErrorComponent errorText="Désolé! impossible de satisfaire à votre demande" reloadText="" callback={loadData} />}
                    </tbody>
                    <tfoot className="">
                        <tr></tr>
                    </tfoot>
                </table>
            </div>

            { !states.isLoading && (states.data?.totalElements === 0) && (
                <div className="text-slate-400 text-sm font-light flex flex-col gap-y-2 justify-center items-center py-4 h-40">
                    <span className="text-5xl ">
                        <PiList />
                    </span>
                    la liste est présentement vide!
                </div>
            ) }
        </div>
    )
}