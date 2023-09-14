import { createContext, ReactNode, useState } from "react"
import { LoginResponse, User } from "../../models"
import Constants from "../../utils/constants/constants"
import { getFromLocalStorage } from "../../utils/helpers/local-storage"

export type LayoutContextProps = {
    showHeader? : boolean
    showFooterMenu? : boolean
    setShowFooterMenu : (show : boolean) => void
    showUserMenu? : boolean
    setShowUserMenu : React.Dispatch<React.SetStateAction<boolean>>
}
export const LayoutContext = createContext<LayoutContextProps>({
    setShowFooterMenu : () => {},
    setShowUserMenu : () => {},
})

export default function LayoutContextProvider ( {children} : {children : ReactNode}) {
    const [showFooterMenu, setShowFooterMenu] = useState(true)
    const [showUserMenu, setShowUserMenu] = useState(false)
    
    return(
        <LayoutContext.Provider value={{ showFooterMenu, setShowFooterMenu, showUserMenu, setShowUserMenu }}>
            {children}
        </LayoutContext.Provider>
    )
}