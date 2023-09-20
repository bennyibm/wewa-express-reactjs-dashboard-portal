import { useContext, useEffect } from "react";
import useApi from "./use-api";
import { GlobalContext } from '../../contexts/context/global';

export default function useApiSecured(path : string, baseRoute? : string) {
    const {accessToken} = useContext(GlobalContext) // {accessToken : ''}
    const api = useApi(path)

    
    useEffect( () => {        
        api.addRequestInterceptor( config => {
            config.headers = { ...config.headers, 'Authorization' : `Bearer ${accessToken}` }
            return config
        })
    }, [accessToken, api])

    return api
};
