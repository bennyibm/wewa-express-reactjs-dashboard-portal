import { createContext, ReactNode, useEffect, useMemo, useState } from "react"
import { User, LoginResponse } from "../../models"
import Constants from "../../utils/constants/constants"
import UserRole from "../../utils/constants/user-role"
import { deleteFromLocalStorage, getFromLocalStorage, saveToLocalStorage } from "../../utils/helpers/local-storage"
import AuthContextProvider from "./auth"
import LayoutContextProvider from "./layout"
export type GlobalContextProps = {
    user?: User,
    accessToken? : string,
    setAuthSession : React.Dispatch<React.SetStateAction<LoginResponse | undefined>>,
    userMenu? : {label : string, link : string}[] 
}
export const GlobalContext = createContext<GlobalContextProps>({setAuthSession : () => undefined})

export default function GlobalContextProvider ( {children} : {children : ReactNode}) {

    const [authSession, setAuthSession] = useState( getFromLocalStorage<LoginResponse>( Constants.AUTHENTICATED_USER ) )
    const user = useMemo<User | undefined>( () => authSession ? authSession.user : undefined, [authSession])
    const accessToken = useMemo( () => authSession ? authSession.token : undefined, [authSession] )
    
    const userMenu = useMemo( () => {
        if(!user){
            return undefined
        }
        
        if((user as any).role === UserRole.AUTHOR){
            return [
                { label : 'Tableau de bord', link : '' },
                { label : 'Mes livres', link : 'books' },
                { label : 'Mon Profil', link : 'my-profile' },
            ]
        }else{
            return [
                { label : 'Tableau de bord', link : '' },
                { label : 'Livres', link : 'books' },
                { label : 'Auteurs', link : 'authors' },
                { label : 'Lecteurs', link : 'readers'},
            ]
        }
    }, [user])
    
    useEffect( () => {
        if(!authSession){
            deleteFromLocalStorage( Constants.AUTHENTICATED_USER )
        }else{
            saveToLocalStorage( Constants.AUTHENTICATED_USER, authSession )
        }
    }, [authSession])

    return(
        <GlobalContext.Provider value={{
            user, 
            accessToken,
            setAuthSession,
            userMenu
        }}>
            <LayoutContextProvider>
                <AuthContextProvider>
                    {children} 
                </AuthContextProvider>
                
            </LayoutContextProvider>
        </GlobalContext.Provider>
    )
}
