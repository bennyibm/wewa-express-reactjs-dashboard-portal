import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function usePath() {
    let {pathname, state} = useLocation()

    const currentPath = useMemo( () => pathname, [pathname])

    const isCurrentPath = useCallback( (path : string) => pathname.endsWith(path) , [pathname])
    const isHomePath = useCallback( () => {
        const parts = pathname.split('/')

        return parts[parts.length-1] === ''
    }, [pathname])

    const lastPathRoute = useMemo( () => {
        const parts = pathname.split('/')
        if(parts.length === 2){
            return '/'
        }
        return parts[parts.length-1]
    } , [pathname])

    const getContextState = useCallback( <T = any>() => {
        console.log('context state ==> ', state)
        if(state !== undefined){
            return state as T
        }
        return state
    }, [state])

    return {currentPath, isCurrentPath, isHome: isHomePath, lastPathRoute, getContextState}
};
