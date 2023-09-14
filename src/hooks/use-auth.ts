import { useCallback, useContext, useEffect } from "react";
import useApi from "./api/use-api";
import UpdatePasswordDto from '../models/user/update-password';
import { User, LoginResponse } from "../models";
import { GlobalContext } from "../contexts/context/global";
import { faker } from "@faker-js/faker";
import DUMMY_USERS from "../utils/dummy/users.dummy";

export default function useAuth(){

    const {user, accessToken, setAuthSession} = useContext(GlobalContext)

    const {api, addRequestInterceptor} = useApi('auth', "https://api.auth.diginco.com")

    const signup = useCallback( async (user : User & {password? : string}) => {
        return await api.post<User>('signup', {...user, role : 'author'})
        .then( ( {data} ) => data)
    }, [api])

    const askForNewActivationLink = useCallback( async (email : string) => {
        return await api.patch('new-activation-link', {}, {
            headers : { 'email' : email }
        })
    }, [api])
    
    const askForNewResetCode = useCallback( async (email : string) => {
        return await api.patch('new-reset-password-code', {}, {
            headers : { 'email' : email }
        })
    }, [api])

    const signin = useCallback( async (loginRequest : {username : string, password : string}) => {
        const user = DUMMY_USERS.find( (user) => (user.username === loginRequest.username) && (user.password === loginRequest.password) )
        if( user ){
            setAuthSession( { user, token: faker.database.mongodbObjectId() })
            return Promise.resolve()
        }else{
            throw new Error()
            // Promise.reject("Utilisateur non valide")
        }
        // api.post<LoginResponse>('signin', loginRequest ).then( response => setAuthSession( response.data))
    }, [api, setAuthSession ])

    const logout = useCallback( async () => {

        setAuthSession(undefined)
    }, [setAuthSession])

    const resetPasswordRequest = useCallback( (username : string) => {
        return api.patch('reset-password-request', {}, {
            headers : { 'email' : username}
        })
    }, [api])

    const updatePasswordRequest = useCallback( async (updatePasswordDto : UpdatePasswordDto) =>{
        return await api.patch('update-password', updatePasswordDto)
    }, [api])

    const refreshToken = useCallback( async () => {
        await api.head<string>('refresh-session', {
            headers : { Authorization : `Bearer ${accessToken}`}
        })
        .then( ({data}) => {
            // setAuthSession()
            setAuthSession( prev => ({...prev, token : data}) )
        })
    }, [accessToken, setAuthSession, api])

    const getUserFullname = useCallback( () => {
        return user ? `${user.first} ${user.last}` : ''
    }, [user])
    
    useEffect( () => {
        addRequestInterceptor( config => {
            return {
                ...config,
                headers: { ...config.headers, "X-API-KEY" : "83d0c03f-4952-4164-b79a-22763" },
                // data : {...config.data, app : 'web'}
            }
        })
    }, [addRequestInterceptor])

    return {
        user, 
        getUserFullname,
        accessToken, 
        signup,
        signin, 
        askForNewActivationLink, 
        askForNewResetCode, 
        logout, 
        resetPasswordRequest, 
        updatePasswordRequest, 
        refreshToken
    }
}