import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/context/global";
import { LayoutContext } from '../contexts/context/layout';
import { useAuth } from "../hooks";
import ApisConfigs from '../utils/configs/api';

export default function UserProfile() {
    const {showUserMenu, setShowUserMenu} = useContext(LayoutContext)
    const {user, userMenu} = useContext(GlobalContext)
    const profilePicturePath = useMemo( () => {
        if(user && (user as any)["profilePic"]){
            return  `${ApisConfigs.CORE_API_URL}files/public/${(user as any)["_id"]}`
        }else{
            return "/images/avatar-man.png"
        }
    }, [user])

    const {logout} = useAuth()
    const navigate = useNavigate()
    const onLogoutRequest =useCallback( () => {
        logout()
        .then( () => navigate('/'))
        .catch( () => {
            
        })
    }, [logout, navigate])

    useEffect( () => {
        document.addEventListener('click', () => setShowUserMenu(false))

        return () => document.removeEventListener('click', () => setShowUserMenu(false))
        
    }, [setShowUserMenu])

    return(
        <div className="relative">
            <img src={profilePicturePath}
                className="w-10 h-10 object-cover hover:scale-95 rounded-full bg-gray-500 cursor-pointer shadow-md" 
                alt=""
                onClick={ e=> {setShowUserMenu( prev => !prev); e.stopPropagation()}}
            />

            <div className={`absolute  right-0 z-20 translate-y-1 bg-gray-100 divide-y divide-gray-300 rounded shadow w-44  ${showUserMenu ? 'block' : 'hidden'}`}>
                <div 
                    className="grid px-4 py-3 text-sm text-gray-900"
                    onClick={ e => e.stopPropagation()}
                >
                    <span>{user?.first} {user?.last}</span>
                    <span className="font-medium truncate">{user?.email || user?.username}</span>
                </div>
                <ul className="py-3 pl-2 grid gap-y-3 text-sm text-gray-700 " aria-labelledby="dropdownInformationButton">
                    { userMenu?.map( ({label, link}, index) => (
                        <li key={index} className="flex gap-x-2 items-center hover:text-primary">
                            <i className="fas fa-angle-right"></i>
                            <Link to={`/dashboard/${link}`} >{label}</Link>
                        </li>
                    ))}
                </ul>
                <div className="py-1">
                    <button
                        onClick={onLogoutRequest}
                        className="group block w-fit px-4 py-2 text-sm text-gray-700 hover:text-primary hover:font-bold transition-none transition-colors"
                    >
                        <span className=''>Se déconnecter</span> <i className="fas fa-sign-out group-hover:rotate-180 group-hover:scale-125 duration-500" />
                    </button>
                </div>
            </div>
        </div>

    )
};
