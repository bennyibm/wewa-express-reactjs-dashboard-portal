import { useCallback, useEffect, useMemo, useRef } from "react";
import { Logo } from "../components";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import DeliveryPage from "./delivery.page";
import DriversPage from "./drivers.page";
import ClientsPage from './clients.page';
import { useAuth } from "../hooks";
import { AiOutlinePoweroff } from "react-icons/ai";

export default function PrivatePagesLayout(){
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const pageTitleRef = useRef<HTMLDivElement | null>(null)
    const setHeading = useCallback( (title: string, description?: string) => {
        document.title= title
        pageTitleRef.current!.querySelector("h2")!.innerText= title
        // pageTitleRef.current!.querySelector("p")!.innerText= description
    }, [])

    const menu = useMemo( () => ([
        { icon: <img src="/images/icons/dashboard.svg" alt="" />, page: <Dashboard setHeading={setHeading} />, label :"Tableau de bord", link: ""},
        { icon: <img src="/images/icons/dashboard.svg" alt="" />, page: <DeliveryPage setHeading={setHeading} />, label :"Livraisons", link: "deliveries"},
        { icon: <img src="/images/icons/dashboard.svg" alt="" />, page: <DriversPage setHeading={setHeading} />, label :"Chauffeurs/Coursiers", link: "drivers"},
        { icon: <img src="/images/icons/dashboard.svg" alt="" />, page: <ClientsPage setHeading={setHeading} />, label :"Clients - App mobile", link: "mobile-users"},
        { icon: <img src="/images/icons/dashboard.svg" alt="" />, page: <Dashboard setHeading={setHeading} />, label :"Administrateurs", link: "administators"},
    ]), [setHeading])

    useEffect( () => {
        !user && navigate("/auth")
    }, [user, navigate])

    // return (
    return !user ? <></> :(
        <div className="flex-1 flex xl:gap-x-6 xl:p-6 min-h-screen">
            <div className="sticky xl:top-10 rounded-lg max-w-xs flex-1 bg-white shadow flex flex-col gap-y-14 px-2.5 xl:px-5 py-8 ">
                <div className="flex items-center justify-between">
                    <Logo />
                    <div className="group w-7 h-5 relative cursor-pointer">
                        <div className="w-8 h-0.5 bg-slate-400 group-hover:bg-primary group-hover:w-full group-hover:translate-y-2 group-hover:rotate-45 rounded-full absolute left-0 top-0" />
                        <div className="w-6 h-0.5 bg-slate-400 group-hover:bg-primary group-hover:w-0 rounded-full absolute left-0 top-[8px]" />
                        <div className="w-4 h-0.5 bg-slate-400 group-hover:bg-primary group-hover:w-full group-hover:-translate-y-2 group-hover:-rotate-45 rounded-full absolute left-0 top-[16px]" />
                    </div>
                </div>

                <div className="border-y-2 border-slate-200 p-2 xl:p-4 bg-primary/5 rounded-lg shadow-sm flex gap-x-2 items-center">
                    <img className="w-10 h-10 xl:w-14 xl:h-14 rounded-full" src="https://via.placeholder.com/60x60" alt=""/>

                    <div className="flex flex-col">
                        <div className="text-zinc-500 text-sm xl:text-lg flex gap-x-2 ">
                            <span className="font-normal" >Hi,</span>
                            <span className="font-semibold" >{user.first}</span>
                        </div>
                        <div className="w-full overflow-hidden">
                            <p className="text-neutral-400 text-sm font-normal text-ellipsis">{user.username}</p>
                        </div>
                    </div>
                </div>

                <ul className="flex flex-col gap-x-2 divide-y divide-primary/10">

                    { menu.map( ({label, link, icon},index) => (
                        <li key={index} className="py-4 text-slate-500 text-sm font-normal">
                            <NavLink to={link} className={ ({isActive}) => `${isActive ? "text-slate-700 font-semibold" : ""} flex items-center gap-x-4`}>                                
                                {icon}
                                {/* <div className="w-6 h-6 relative bg-slate-600" /> */}
                                {label}
                            </NavLink>
                        </li>
                    ))}
                    <li className="py-4 text-red-600 text-sm font-normal">
                        <button onClick={logout} className="flex items-center gap-x-4">
                            <span className="text-2xl">
                                <AiOutlinePoweroff/>
                            </span>
                            Déconnexion
                        </button>
                    </li>
                </ul>

                <div className="hidden border-t-2 border-primary rounded-lg">

                </div>
            </div>
            <div className=" flex-1 flex flex-col gap-y-10 rounded-lg shadow-sm p-8">
                <div  ref={pageTitleRef} className="flex items-center pb-4 border-b-2 border-primary/20">
                    <h2 className="text-zinc-500 text-3xl font-semibold">Dashboard</h2>
                </div>
                <Routes>
                    { menu.map( ({page, link }, key) => (
                        <Route key={key} path={link} element={page} />
                    ))}
                </Routes>
            </div>
        </div>
    )
}