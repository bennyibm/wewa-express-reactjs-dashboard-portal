import { useState, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { SigninRequestDto } from '../../models'
import HttpStatusCode from '../../utils/constants/http-status-code'
import InputPatterns from '../../utils/constants/input-patterns'
import Button from '../button'
import MyForm, { FieldInputType } from '../my-form'
import Logo from '../logo';
import { AiFillBug } from 'react-icons/ai';

type States = {
    isLoading? : boolean
    errorStatusCode? : number
}

export default function Singin(){
    const navigate = useNavigate()
    const locationState = useLocation().state as any
    const fromPage = useMemo( () => locationState?.from || '/', [locationState])

    const {signin} = useAuth()

    const [states, setStates] = useState<States>({})

    const Notification = useCallback( () => {
        if(states.errorStatusCode === HttpStatusCode.CANT_REACH){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-red-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-red-400 shadow-md hover:text-white`} 
                    />
                    <span className="text-2xl text-black">
                        <AiFillBug />
                    </span>
                    <p className="text-xs">Pas de connexion internet!</p>
                </div>
            )
        }else if(states.errorStatusCode === HttpStatusCode.SERVER_ERROR){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-red-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-red-400 shadow-md hover:text-white`} 
                    />
                    <span className="text-2xl text-black">
                        <AiFillBug />
                    </span>
                    <p className="text-xs">Oops! réesayez svp!</p>
                </div>
            )
        }else if(states.errorStatusCode === HttpStatusCode.LOCKED){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-orange-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-orange-400 shadow-md hover:text-white`} 
                    />
                    <span className="text-2xl text-black">
                        <AiFillBug />
                    </span>
                    <p className="text-xs">Vous devez activer votre compte! <br/> consulter votre boite-mail!</p>
                </div>
            )
        }else if( states.errorStatusCode === HttpStatusCode.UNAUTHORIZED ){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-red-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  fas fa-close bg-red-400 shadow-md hover:text-white`} 
                    >x</button>
                    <span className="text-5xl text-black">
                        <AiFillBug />
                    </span>
                    <p className="text-sm text-white">Utilisateur Invalide</p>
                </div>
            )
        }else{
            return <></>
        }
    }, [states.errorStatusCode])
    
    const SignupSuccedNotification = useCallback( () => {
        if(locationState?.isgnupSucceed){
            return(
                <div className=' w-full text-gray-500 text-center bg-blue-200 py-2 rounded relative' >
                    <div 
                        className='absolute -top-3 -right-2 flex items-center justify-center w-6 h-6 shadow bg-blue-200 hover:bg-red-400 cursor-pointer rounded-full text-white fas fa-close' 
                        onClick={ () => navigate("") }
                    />
                    <i className="fas fa-info text-4xl text-white" />

                    <p className='text-center text-xs leading-5'>
                        Félicitation! Inscription réussie. <br /> vérifier votre boite-mail <br /> <span className='font-semibold text-primary'>{locationState?.username}</span> <br/>pour l'activer!
                    </p>
                </div>
            )
        }else{
            return <></>
        }
    }, [locationState?.isgnupSucceed, locationState?.username, navigate])

    const PasswordUpdatedNotification = useCallback( () => {
        const {passwordUpdated, username} = locationState || {passwordUpdated : undefined, username : undefined}
        if(passwordUpdated){
            return (
                <div className={`flex items-center gap-x-2 -translate-y-4 max-w-sm py-2 px-4 bg-blue-50 rounded-sm `}>
                    <p className="ml-2 text-xs text-center">
                        Félicitation <span className='font-semibold'>{username}</span> <br />
                        votre mot de passe a bien été mise-à-jour! <br />
                        utlisez le nouveau mot de passe pour vous connecter
                    </p>
                </div>
            )
        }else{
            return <></>
        }
    }, [locationState])
    
    const onSubmit = useCallback( (fields : SigninRequestDto) => {
        setStates( prev => ({...prev, isLoading : true, errorStatusCode : undefined}))

        setTimeout( () => {
            try {
                signin(fields)
                .then( () => navigate(fromPage))
                .catch( err => setStates( prev => ({...prev, errorStatusCode : 401})) )
                // .catch( err => setStates( prev => ({...prev, errorStatusCode : (err.response?.data || {statusCode : HttpStatusCode.CANT_REACH}).statusCode})) )
                .finally( () => setStates( prev => ({...prev, isLoading : false})) )            
            } catch (error) {
                setStates( prev => ({...prev, isLoading : false, errorStatusCode : 401}))
            }
        }, 1000)
        
    }, [signin, navigate, fromPage])

    return(
        <>
            <SignupSuccedNotification />
            <PasswordUpdatedNotification />
            <Notification />
            <h1 className=' md:py-4 text-3xl md:text-5xl font-semibold'>Connexion</h1>
            <p className=" max-lg:bg-slate-200  max-md:text-[.6rem] max-md:leading-3 max-lg:p-3 max-lg:my-4 max-lg:rounded md:py-7 text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores harum perferendis blanditiis cum velit. Molestias ad id vero amet sed commodi quisquam laboriosam recusandae facere tempore? Maxime placeat sapiente iure?
            </p>

            <MyForm
                className='flex flex-col gap-y-4' 
                fields={{
                    username : {
                        label: "Email",
                        type : FieldInputType.TEXT,
                        placeholder : 'adresse email',
                        id : 'username',
                        required : true,
                        pattern : InputPatterns.EMAIL,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'adresse email invalid!',
                        onChange : field => console.log(field)                        
                    },
                    password : {
                        label: "Mot de passe",
                        type : FieldInputType.PASSWORD,
                        placeholder : 'mot de passe',
                        id : 'password',
                        required : true,
                        pattern : InputPatterns.PASSWORD,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'le mot de passe doit compter au moins 8 caracters et contenir les lettres (minuscule et majuscule) et  au moins un character special ',
                        onChange : field => console.log(field)                        
                    }
                } }

                onSubmit={fields => onSubmit(fields as any as SigninRequestDto)}
            >
                <div className='pt-4 flex flex-col gap-y-4'>
                    <Button 
                        className='w-full flex items-center justify-center gap-2' 
                        isLoading={states.isLoading}
                    >
                        <span>Se connecter</span>
                    </Button>
                    <Link to='/auth/reset-password' className="w-fit mx-auto text-sm text-center hover:underline underline-offset-4">Mot de passe oublié?</Link>
                </div>
            </MyForm>
            
        </>
    )
}