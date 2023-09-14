import {useState, useCallback} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { User } from '../../models'
import HttpStatusCode from '../../utils/constants/http-status-code'
import InputPatterns from '../../utils/constants/input-patterns'
import Button from '../button'
import MyForm, { FieldInputType } from '../my-form'

type States = {
    isLoading? : boolean
    user? : User
    errorStatusCode? : number
}

export default function Signup(){
    const navigate = useNavigate()
    const {signup} = useAuth()
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
        }else if(states.errorStatusCode === HttpStatusCode.CONFLICT){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-orange-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-orange-400 shadow-md hover:text-white`} 
                    />
                    <i className="fa fa-warning text-2xl" />
                    <p className="text-xs">Cette adresse est déjà utiiliée!</p>
                </div>
            )
        }else if( states.errorStatusCode === HttpStatusCode.UNPROCESSABLE_ENTITY ){
            return(
                <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 bg-red-300 rounded-sm `}>
                    <button 
                        onClick={() => setStates( prev => ({...prev, errorStatusCode : undefined}) )}
                        className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-xs fas fa-close bg-red-400 shadow-md hover:text-white`} 
                    />
                    <i className="fas fa-info text-2xl" />
                    <p className="text-xs">
                        mot de passe trop faible <br/>
                        le mot de passe doit contenir au moins 8 caracters, avec des majuscules, minuscues et des chiffres
                    </p>
                </div>
            )
        }else{
            return <></>
        }
    }, [states.errorStatusCode])
    
    const onSubmit = useCallback( (user : User) => {
        
        setStates( prev => ({...prev, isLoading : true, errorStatusCode : undefined}))
        signup(user)
        .then( () => navigate('/auth/signin', { state : { isgnupSucceed : true, username : user.email } }))
        .catch( err => setStates( prev  => ({ ...prev, errorStatusCode : (err.response?.data || {statusCode : HttpStatusCode.CANT_REACH}).statusCode })) )
        .finally( () => setStates( prev => ({...prev, isLoading : false})) )
    }, [signup, navigate])

    return(
        <>
            <Notification />
            <h1 className='py-4 text-5xl font-semibold'>Créer un compte</h1>
            {/* <p className="py-7 text-sm text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores harum perferendis blanditiis cum velit. Molestias ad id vero amet sed commodi quisquam laboriosam recusandae facere tempore? Maxime placeat sapiente iure?
            </p>             */}
            <MyForm
                className='' 
                fields={{
                    first : {
                        icon : 'fas fa-user',
                        type : FieldInputType.TEXT,
                        placeholder : 'Prénom',
                        id : 'first',
                        required : true,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'doit compter au moins 4 caracters et ne doit pas contenir des caracteres spéciaux!',
                    },
                    last : {
                        icon : 'fas fa-user',
                        type : FieldInputType.TEXT,
                        placeholder : 'Nom',
                        id : 'last',
                        required : true,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'doit compter au moins 4 caracters et ne doit pas contenir des caracteres spéciaux!',
                    },
                    email : {
                        icon : 'fas fa-at',
                        type : FieldInputType.TEXT,
                        placeholder : 'adresse email',
                        id : 'username',
                        required : true,
                        pattern : InputPatterns.EMAIL,
                        onEmptyErrorMessage : 'champ obligatoire',
                        onInvalidErrorMessage : 'adresse email invalid!',
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
                    }
                } }

                onSubmit={fields => onSubmit(fields as any)}
            >
                <div className='flex flex-col gap-y-4 py-2'>                    
                    <Button 
                        className='w-full flex items-center justify-center gap-2' 
                        disabled={states.isLoading}
                    >
                        <span>Créer le compte</span>
                        { states.isLoading ? <span className='fa-solid fa-circle-notch animate-spin' /> : <i className="fas fa-save" />  }
                    </Button>

                    <div className="text-center my-2 divide-y-8 divide-transparent ">
                        <Link to='/auth/signin' className="underline underline-offset-2 text-primary">se connecter</Link>     
                    </div>
                </div>
            </MyForm>
        </>
    )
}