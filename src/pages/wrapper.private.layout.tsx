import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "../components";
import { NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from "./dashboard";
import DeliveryPage from "./delivery.page";
import DriversPage from "./drivers.page";
import ClientsPage from './clients.page';
import { useAuth } from "../hooks";
import { AiOutlinePoweroff, AiOutlineClose } from "react-icons/ai";
import Alert from "@material-ui/lab/Alert";
import Administrators from './admins.page';
import UserRole from "../utils/constants/user-role";

export default function PrivatePagesLayout(){
    const [showAlert, setShowAlert] = useState< {message: string, severity: 'success' | 'info' | 'warning' | 'error'} | undefined>()

    const [showMenu, setShowMenu] = useState(false)
    const {pathname} = useLocation()
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
        { role: UserRole.SUPER_ADMIN, icon: <img src="/images/icons/dashboard.svg" alt="" />, page: <Administrators setHeading={setHeading} />, label :"Administrateurs", link: "administators"},
    ]), [setHeading])

    useEffect( () => {
        !user && navigate("/auth")
    }, [user, navigate])

    useEffect( () => {

        const onShowAlert = (e: any) => {
            setShowAlert( { message : e?.detail?.message, severity: e?.detail?.severity} )
        }

        const onkeydown = (e: any) => {
            if (e.key?.toLowerCase() === 'escape' || e.key?.toLowerCase() === 'esc') {
                setShowMenu(false)
            }
        }

        document.addEventListener('keydown', onkeydown)
        document.addEventListener('show-alert', onShowAlert)

        return () => {
            document.removeEventListener('keydown', onkeydown)
            document.removeEventListener('show-alert', onShowAlert)
        }
    }, [])

    useEffect( () => {
        setShowMenu(false)
        setShowAlert(undefined)
    }, [pathname])

    useEffect( () => {
        if(showMenu){
            document.body.classList.add("overflow-y-hidden")
        }else{            
            document.body.classList.remove("overflow-y-hidden")
        }
    }, [showMenu])

    // return (
    return !user ? <></> :(
        <div className="max-lg:relative flex-1 flex max-lg:flex-col xl:gap-x-6 xl:p-6 min-h-screen">
            <div className="lg:hidden sticky top-0 p-4 w-full bg-white flex justify-between items-center">
                <Logo className="w-20" />
                <button onClick={ () => setShowMenu(true)} className="group flex flex-col items-end gap-y-2 cursor-pointer">
                    <span className="w-8 h-0.5 bg-slate-400 group-hover:bg-primary rounded-full" />
                    <span className="w-6 h-0.5 bg-slate-400 group-hover:bg-primary rounded-full" />
                    <span className="w-4 h-0.5 bg-slate-400 group-hover:bg-primary rounded-full" />
                </button>
            </div>
            <div className={`${showMenu ? "left-0" : "-left-full" } lg:hidden fixed z-20 top-0 w-full`}>
                <div onClick={ () => setShowMenu(false)} className="absolute inset-0 bg-black/60 backdrop-blur" />
                <div className="relative z-10 min-h-screen w-72 rounded-lg bg-white shadow flex flex-col gap-y-8">
                    <div className="flex items-center justify-between p-2.5">
                        <Logo className="w-20" />
                        <button onClick={ () => setShowMenu(false)} className="text-2xl text-red-600 hover:text-slate-700">
                            <AiOutlineClose/>
                        </button>
                    </div>

                    <div className="mx-4 border-y-2 border-slate-200 p-4 bg-primary/5 rounded-lg shadow-sm flex gap-x-2 items-center">
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

                    <ul className="px-6 flex flex-col gap-x-2 divide-y divide-primary/10">

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
            </div>

            <div className="max-lg:hidden sticky top-10 rounded-lg max-w-xs flex-1 bg-white shadow flex flex-col gap-y-14 px-2.5 xl:px-5 py-8 ">
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

                    { menu.map( ({label, link, icon, role},index) => {
                        if( (role !== undefined) && (user.role !== role)){
                            return <></>
                        }

                        return (
                            <li key={index} className="py-4 text-slate-500 text-sm font-normal">
                                <NavLink to={link} className={ ({isActive}) => `${isActive ? "text-slate-700 font-semibold" : ""} flex items-center gap-x-4`}>                                
                                    {icon}
                                    {label}
                                </NavLink>
                            </li>
                        )
                    })}
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
            <div className="lg:flex-1 flex flex-col gap-y-10 rounded-lg shadow-sm p-4 lg:p-8">
                <div  ref={pageTitleRef} className="flex items-center pb-4 border-b-2 border-primary/20">
                    <h2 className="text-zinc-500 text-3xl font-semibold">Dashboard</h2>
                </div>
                { showAlert && <Alert onClose={ () => setShowAlert(undefined)} variant="filled" elevation={3} severity={showAlert.severity}>{showAlert.message}</Alert>}
                <Routes>
                    { menu.map( ({page, link, role }, key) => {
                        if( (role !== undefined) && (user.role !== role)){
                            return <></>
                        }

                        return <Route key={key} path={link} element={page} />
                    })}
                </Routes>
            </div>
        </div>
    )
}