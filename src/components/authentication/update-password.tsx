import {useState, useCallback} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import HttpStatusCode from '../../utils/constants/http-status-code'
import InputPatterns from '../../utils/constants/input-patterns'
import Button from '../button'
import MyForm, { FieldInputType } from '../my-form'

type States = {
    isLoadingReset? : boolean
    isLoading? : boolean
    errorStatusCode? : number
    isPasswordsNotEqual? : boolean
}

export default function UpdatePassword(){
    const location = useLocation()
    const navigate = useNavigate()
    const {updatePasswordRequest, resetPasswordRequest} = useAuth()
    const [states, setStates] = useState<States>({})
    
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
        }else if(states.errorStatusCode === 500){
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

    const resetPassword = useCallback( (username : string) => {

        setStates( prev => ({...prev, isLoadingReset : true}))
        resetPasswordRequest(username)
        .then( () => {} )
        .catch( err => {})
        .finally( () => setStates( prev => ({...prev, isLoadingReset : false})))
    }, [resetPasswordRequest])

    const arePasswordsEquel = useCallback( (pwd : string, cPwd : string) => {
        const thereEqual = !(pwd === cPwd)
        setStates( prev => ({ ...prev, isPasswordsNotEqual : thereEqual}))
        return thereEqual
    }, [] )

    const onSubmit = useCallback( (updatePasswordDto : any) => {
        if(arePasswordsEquel( updatePasswordDto.password, updatePasswordDto.confirmPassword )){
            return
        }

        setStates( prev => ({...prev, isLoading : true, errorStatusCode : undefined}))
        updatePasswordRequest(updatePasswordDto)
        .then( () => navigate("/auth/signin", {state : {passwordUpdated : true, username : updatePasswordDto.email}}))
        .catch( err => setStates( prev => ({...prev, errorStatusCode : (err.response?.data || {statusCode : HttpStatusCode.CANT_REACH}).statusCode})) )
        .finally( () => setStates( prev => ({...prev, isLoading : false})) )
    }, [arePasswordsEquel, navigate, updatePasswordRequest])

    return(
        <>
            <div className="fas fa-refresh -mt-16 mb-8 mx-auto w-24 h-24 flex justify-center items-center bg-white text-5xl shadow rounded-full" />
            

            <div className={`gap-x-2 -translate-y-4 max-w-sm py-2 px-4 bg-blue-50 rounded-sm `}>
                <p className="ml-2 text-xs text-center">Vérifier votre mail-box pour trouver le code de réinitialisation! <br />
                cliiquer sur ce <button onClick={ () => resetPassword((location.state as any).username)} className='text-primary underline underline-offset-1'>lien</button> pour renvoyer un nouveau code</p>
                {states.isLoadingReset && (
                    <p className='text-xs text-center my-2 py-2 bg-blue-100'>
                        envoi du nouveau code à l'adresse email {(location.state as any).username}
                        <span className='ml-2 fa-solid fa-circle-notch animate-spin' />
                    </p>
                )}

            </div>
            <Notification />
            <MyForm
                className=' max-w-sm' 
                fields={{
                    username : {
                        icon : 'fas fa-at',
                        type : FieldInputType.TEXT,
                        placeholder : 'adresse email',
                        initialValue : (location.state as any)?.username,
                        id : 'username',
                        required : true,
                        readonly : true,
                        pattern : InputPatterns.EMAIL,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'adresse email invalid!',
                    },
                    code : {
                        icon : 'fas fa-key',
                        type : FieldInputType.TEXT,
                        placeholder : 'code de réinitialisation',
                        id : 'reset-code',
                        required : true,
                        // pattern : InputPatterns.ALPHABETS_AND_SPACES,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'doit compter au moins 4 caracters et ne doit pas contenir des caracteres spéciaux!',
                    },
                    password : {
                        icon : 'fas fa-lock',
                        type : FieldInputType.PASSWORD,
                        placeholder : 'mot de passe',
                        id : 'password',
                        required : true,
                        pattern : InputPatterns.PASSWORD,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'le mot de passe doit compter au moins 8 caracters et contenir les lettres (minuscule et majuscule) et  au moins un character special ',
                    },
                    confirmPassword : {
                        icon : 'fas fa-lock',
                        type : FieldInputType.PASSWORD,
                        placeholder : 'mot de passe',
                        id : 'confirm-password',
                        required : true,
                        pattern : InputPatterns.PASSWORD,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'le mot de passe doit compter au moins 8 caracters et contenir les lettres (minuscule et majuscule) et  au moins un character special ',
                    }
                } }

                onSubmit={ fields => onSubmit(fields)}
            >
                { states.isPasswordsNotEqual && <p className="text-xs text-red-600 -mt-2 mb-3">Les mots de passe ne correspondent pas !</p> }
                <Button 
                    className='w-full flex items-center justify-center gap-2' 
                    disabled={states.isLoading}
                >
                    <span>metre à jour</span>
                    { states.isLoading ? <span className='fa-solid fa-circle-notch animate-spin' /> : <i className="fas fa-update" />  }
                </Button>

                <div className="text-center my-2 divide-y-8 divide-transparent ">
                    <Link to='/auth/signin' className="underline underline-offset-2 text-primary">se connecter</Link>       
                </div>
            </MyForm>

        </>
    )
}