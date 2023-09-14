import {useState, useMemo, useCallback} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { SigninRequestDto } from '../../models'
import HttpStatusCode from '../../utils/constants/http-status-code'
import InputPatterns from '../../utils/constants/input-patterns'
import Button from '../button'
import MyForm, { Field, FieldInputType } from '../my-form'
import Toast from '../toast'
import { FieldValidity } from '../my-form';

type States = {
    isLoading? : boolean
    signinRequestDto : SigninRequestDto
    notification? : {type? : 'success' | 'warning' | 'danger' | 'info', text : string, icon? : string} | undefined
}

export default function SinginTestMyForm(){
    const navigate = useNavigate()
    const location = useLocation()
    const fromPage = useMemo( () => (location.state ? (location.state as any) : { from : '/' }).from, [location])

    const {signin} = useAuth()
    const [states, setStates] = useState<States>({ signinRequestDto : {username : '', password : ''} })
    
    const onInputChange = useCallback( (field : {name : string, value : string}) => {
        console.log(field);
    }, [])

    const onSubmit = useCallback( (fields : {username : string, password : string}) => {
        console.log(fields);

        setStates( prev => ({...prev, isLoading : true, notification : undefined}))

        signin(fields)
        .then( () => {
            navigate(fromPage)
        })
        .catch( err => {
            let notification : any
            if(err.response){
                const {statusCode} = err.response.data
                console.log(err.response);
                if( statusCode === HttpStatusCode.FORBIDEN){
                    notification = { text : 'consulter votre boite-mail et activer votre compte!', typer : 'warning' }
                }else if( statusCode === HttpStatusCode.UNAUTHORIZED){
                    notification = { text : 'informtions incorrectes', typer : 'danger' }
                }else{
                    notification = { text : "erreur de connexion, veuillez réessayer!", typer : 'warning' }
                }
            }else{
                notification = { text : "pas d'accés internet!", typer : 'warning' }
            }
            setStates( prev  => ({
                ...prev,
                notification
            }))
        })
        .finally( () => {
            setStates( prev => ({...prev, isLoading : false}))
        })
    }, [signin, navigate, fromPage])


    const RenderField = useCallback( (field : Field & {name : string, hasError? : boolean, validity? : FieldValidity}) => {

        return (
            <div className='my-4'>
                <div className={`group overflow-hidden rounded-sm flex flex-1 h-10 border ${field.hasError ? 'border-red-500': ''}`}>
                    <label 
                        htmlFor={field.id}
                        className={`${field.icon} ${field.hasError ? 'bg-red-500': 'group-focus-within:bg-primary bg-slate-100'} group-focus-within:text-white  flex justify-center items-center w-10 h-full`} 
                    />
                    <input
                        id={field.id}
                        type={field.type} 
                        name={field.name} 
                        onChange={e => field.onChange && field.onChange({name : e.target.name, value : e.target.value})} 
                        placeholder={field.placeholder}
                        className='h-full w-full pl-2' 
                    />
                </div>
                { field.hasError && (
                    <p className='text-red-500 text-xs mt-1 '> { field.validity === FieldValidity.EMPTY ? field.onEmptyErrorMessage : field.onInvalidErrorMessage } </p>
                )}
            </div>
        )
    }, [])
    
    return(
        <>
            <div className="fas fa-user-lock -mt-16 mb-8 mx-auto w-24 h-24 flex justify-center items-center bg-white text-5xl rounded-full" />
            {
                states.notification && (
                    <Toast 
                        onClose={() => setStates(prev => ({...prev, notification : undefined}))} 
                        {...states.notification} 
                    />
                )
            }
            
            <MyForm
                className=' max-w-sm' 
                fields={{
                    username : {
                        icon : 'fas fa-at',
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
                        icon : 'fas fa-lock',
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
                onChange={onInputChange}
                renderFieldComponent={RenderField}

                onSubmit={fields => onSubmit(fields as any)}
            >
                <Button 
                    className='w-full flex items-center justify-center gap-2' 
                    disabled={states.isLoading}
                >
                    <span>se connecter</span>
                    { states.isLoading ? <span className='fa-solid fa-circle-notch animate-spin' /> : <i className="fas fa-unlock" />  }
                </Button>
                <div className="text-center my-3 divide-y-8 divide-transparent flex flex-col items-center justify-center ">
                    <Link to='/auth/reset-password' className="underline underline-offset-2 text-primary">Mot de passe oublié?</Link>
                    <Link to='/auth/signup' className="underline underline-offset-2 text-primary">Créer un compte auteur</Link>
                </div>
            </MyForm>
            
        </>
    )
}