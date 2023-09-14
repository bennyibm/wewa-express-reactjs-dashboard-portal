import { createContext, ReactNode, useState } from "react"
import { User, LoginResponse } from "../../models"
import Constants from "../../utils/constants/constants"
import { getFromLocalStorage } from "../../utils/helpers/local-storage"

export type GlobalContextProps = {
    user?: User,
    setUser : (user : User | undefined) => void,
    accessToken? : string,
    setAccessToken : (token : string | undefined) => void
}
export const AuthContext = createContext<GlobalContextProps>({
    setUser : () => {}, 
    setAccessToken: () => {},
})

export default function AuthContextProvider ( {children} : {children : ReactNode}) {

    const authSession = getFromLocalStorage<LoginResponse>( Constants.AUTHENTICATED_USER )
    const [user, setUser] = useState<User | undefined>( authSession ? authSession.user : undefined)
    const [accessToken, setAccessToken] = useState<string | undefined>( authSession ? authSession.token : undefined )
    
    return(
        <AuthContext.Provider value={{
            user, 
            setUser, 
            accessToken, 
            setAccessToken,
        }}>
            {children}
        </AuthContext.Provider>
    )
}