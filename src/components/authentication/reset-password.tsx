import {useState, useCallback} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import HttpStatusCode from '../../utils/constants/http-status-code'
import InputPatterns from '../../utils/constants/input-patterns'
import Button from '../button'
import MyForm, { FieldInputType } from '../my-form'

type States = {
    isLoading? : boolean
    errorStatusCode? : number
}

export default function ResetPassword(){
    const {resetPasswordRequest} = useAuth()
    const [states, setStates] = useState<States>({})
    const navigate = useNavigate()

    const Notification = useCallback( () => {
        if(states.errorStatusCode === HttpStatusCode.CANT_REACH){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-red-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-red-400 shadow-md hover:text-white`} 
                    />
                    <i className="fas fa-bug text-2xl" />
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
                    <i className="fas fa-bug text-2xl" />
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
                    <i className="fa fa-warning text-2xl" />
                    <p className="text-xs">Vous devez activer votre compte! <br/> consulter votre boite-mail!</p>
                </div>
            )
        }else if( states.errorStatusCode === HttpStatusCode.UNAUTHORIZED ){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-red-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-red-400 shadow-md hover:text-white`} 
                    />
                    <i className="fas fa-info text-2xl" />
                    <p className="text-xs">Informtions incorrectes!</p>
                </div>
            )
        }else{
            return <></>
        }
    }, [states.errorStatusCode])

    const onSubmit = useCallback( (username : string) => {
        
        setStates( prev => ({...prev, isLoading : true, errorStatusCode : undefined}))

        resetPasswordRequest(username)
        .then( () => navigate("/auth/update-password", { state : {username}}))
        .catch( err => setStates( prev => ({...prev, errorStatusCode : (err.response?.data || {statusCode : HttpStatusCode.CANT_REACH}).statusCode})) )
        .finally( () => setStates( prev => ({...prev, isLoading : false})) )
    }, [navigate, resetPasswordRequest])

    return(
        <>
            {/* <div className="fas fa-refresh -mt-16 mb-8 mx-auto w-24 h-24 flex justify-center items-center bg-white text-5xl shadow rounded-full" /> */}
            <Notification />
            
            <h1 className='py-4 text-3xl md:text-5xl font-semibold'>Mot de passe oublié</h1>
            <p className=" max-lg:bg-slate-200  max-md:text-[.6rem] max-md:leading-3 max-lg:p-3 max-lg:my-4 max-lg:rounded md:py-7 text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores harum perferendis blanditiis cum velit. Molestias ad id vero amet sed commodi quisquam laboriosam recusandae facere tempore? Maxime placeat sapiente iure?
            </p>
            <MyForm
                className='' 
                fields={{
                    username : {
                        label:"Adresse email",
                        type : FieldInputType.TEXT,
                        placeholder : 'adresse email de connexion',
                        id : 'username',
                        required : true,
                        pattern : InputPatterns.EMAIL,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'adresse email invalid!',
                        onChange : field => console.log(field)                        
                    },
                } }

                onSubmit={fields => onSubmit(fields.username)}
            >
                <div className='pt-4 flex flex-col gap-y-4'>
                    <Button 
                        className='w-full flex items-center justify-center gap-2' 
                        disabled={states.isLoading}
                    >
                        <span>Réinitialiser</span>
                        { states.isLoading ? <span className='fa-solid fa-circle-notch animate-spin' /> : <i className="fas fa-refresh" />  }
                    </Button>
                    <Link to='/auth/signin' className="w-fit mx-auto underline underline-offset-2 text-primary">se connecter</Link>
                </div>
            </MyForm>
        </>
    )
}