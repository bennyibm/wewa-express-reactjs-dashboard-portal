import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useMemo, useRef, useCallback, useEffect } from 'react'
import ApisConfigs from '../../utils/configs/api'
import { conactUrl } from '../../utils/helpers/http'

export default function useApi(path : string, baseRoute = ApisConfigs.CORE_API_URL) {
    const controller = useMemo( () => new AbortController() , [])
    
    const api = useMemo( () => (
        axios.create({
            baseURL : conactUrl(baseRoute, path),
            signal : controller.signal
        })
    ), [baseRoute, path, controller])

    const abortRequest = useCallback( () => { controller.abort() }, [controller])

    const requestInterceptors = useRef<number[]>([])
    const responseInterceptors = useRef<number[]>([])

    const addRequestInterceptor = useCallback( ( onRequest : (config : AxiosRequestConfig) => AxiosRequestConfig, onRejected? : (error : any) => any | undefined) =>{
        requestInterceptors.current.push(api.interceptors.request.use(onRequest, onRejected))
    }, [ api ])

    const addResponseInterceptor = useCallback( ( onRequest : (config : AxiosResponse) => AxiosResponse, onRejected? : (error : any) => any) =>{
        requestInterceptors.current.push(api.interceptors.response.use(onRequest, onRejected))
    }, [ api ])

    useEffect( () => {

        // addResponseInterceptor( response => response.data)
        
        const requestInterceptorsToClean = requestInterceptors.current
        const responseInterceptorsToClean = responseInterceptors.current

        return function(){

            requestInterceptorsToClean.forEach(interceptorId => {
                api.interceptors.request.eject(interceptorId)
            })

            responseInterceptorsToClean.forEach(interceptorId => {
                api.interceptors.request.eject(interceptorId)
            })
        }
    }, [addResponseInterceptor, api.interceptors.request])

    return {api, abortRequest, controller, addRequestInterceptor, addResponseInterceptor}
};
