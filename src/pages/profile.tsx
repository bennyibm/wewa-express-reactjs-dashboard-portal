import { useCallback, useContext, useEffect, useState, useRef, useMemo } from "react";
import { Button, CustomSelectBox } from "../components";
import MyForm, { FieldValidity } from "../components/my-form";
import { GlobalContext } from "../contexts/context/global";
import { useApiCrud } from "../hooks";
import ApisConfigs from "../utils/configs/api";
import { PATTERN_MIN_LENGTH_PATTERN } from "../utils/constants/input-patterns";
import { getDate } from "../utils/helpers/date-time";

type States = {
    isLoadingImage? : boolean
    isImageError? : boolean
    profilePictFile? : File
    profilePicturePath : string
    isSubmiting? : boolean
    notification? : any
    isUploadingFiles? : boolean
}

export default function ProfilePage() {
    
    const context = useContext(GlobalContext)
    const author = useMemo( () => context.user as any, [context.user])
    const setAuthSession = useMemo( () => context.setAuthSession, [context.setAuthSession])
    const {customRequest : saveAuthor} = useApiCrud<any>('authors')
    const imgRef = useRef<HTMLImageElement | null>(null)
    const [states, setStates] = useState<States>( () => ({
        profilePicturePath : author.profilePic ? `${ApisConfigs.CORE_API_URL}files/public/${author._id}` : `/images/avatar-${author.gender === "homme" ? "man" : "woman"}.png`,
        isLoadingImage : author.profilePic !== undefined
    }))

    const onPictureFileChange = useCallback( ( e : any) => {
        e.target?.files &&  e.target.files[0] && setStates(prev => ({...prev, profilePictFile : e.target.files[0], profilePicturePath : URL.createObjectURL(e.target.files[0])}))
    }, [])

    const onSubmit = useCallback( (data : any) => {
        setStates(prev => ({...prev, isSubmiting : true, notification : undefined}))
        setTimeout( () => {
            saveAuthor({
                headers : { 'Content-Type' : 'multipart/form-data' },
                url : data._id,
                data,
                method : 'put'
            })
            .then( saved => {
                setAuthSession( prev => ({...prev, user : {...prev?.user, ...saved}}))
                setStates( prev => ({
                    ...prev,
                    notification : () => (
                        <div className="bg-green-300 flex items-center gap-4 py-2 px-4 w-fit rounded-md">
                            <i className="fa-solid fa-info text-2xl text-white bg-green-600 flex justify-center items-center w-12 h-12 rounded-full" />
                            <p className="text-sm">
                                Modification(s) enregistrée(s)!
                            </p>
                        </div>
                    )
                }))
            })
            .catch( () => {
                setStates( prev => ({
                    ...prev,
                    notification : () => (
                        <div className="bg-red-300 flex items-center gap-4 py-2 px-4 w-fit rounded-md animate-slide-in">
                            <i className="fas fa-bug text-2xl text-white bg-red-600 flex justify-center items-center w-12 h-12 rounded-full" />
                            <p className="text-sm">
                                Une erreur est survenue! Veuillez réessayez s.v.p
                            </p>
                        </div>
                    )
                }))
            })
            .finally( () => setStates( prev => ({...prev, isSubmiting : false})) )
        }, 1500)

    }, [saveAuthor, setAuthSession])

    useEffect( () => {
        document.title = 'Duma Reader | Mon profil'
    }, [])
    
    return(
        <div className="flex flex-col lg:flex-row gap-x-4 px-4 xl:px-20 -translate-y-20 lg:-translate-y-[6rem]">
            <div className="relative h-fit w-fit mx-auto lg:mx-0" onClick={ e => e.currentTarget.querySelector('input')?.click()}>
                <img
                    ref={imgRef}
                    onLoad={() => setStates(prev => ({...prev, isLoadingImage : false}))} 
                    src={states.profilePicturePath} 
                    className={`h-40 w-40 md:h-36 lg:h-48 md:w-36 lg:w-48 rounded-full  shadow-md overflow-hidden object-cover ${states.isLoadingImage ? 'bg-gray-300 animate-pulse duration-75' : ''  }`} 
                    alt=""
                    onError={ () => {
                        imgRef.current!.src = '/images/blog-2.jpg'
                        setStates( prev => ({...prev, isImageError : true}))
                    }}
                />
                {
                    states.isImageError && (
                        <div>

                        </div>
                    )
                }
                {
                    !states.isImageError && (
                        <>
                            <input type="file" accept="image/*" className="hidden" id='poricPic' onChange={onPictureFileChange} />
                            <i className="fas fa-camera absolute left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl w-10 h-10 flex justify-center items-center rounded-full hover:text-primary bg-gray-100 hover:scale-110 cursor-pointer shadow-md" />
                        </>
                    )
                }
            </div>
            
            <div className="flex-1 translate-y-8 md:translate-y-12">
                <h1 className="text-2xl text-center lg:text-left md:text-4xl font-semibold text-gray-400">Mon profil</h1>
                <MyForm 
                    className='flex flex-wrap gap-x-4 mb-4'
                    // renderFieldComponent={InputFieldTemplate2}
                    onSubmit={ fields => onSubmit( {...fields, profilePictFile : states.profilePictFile})}
                    fields={{
                        first : {
                            id : 'first',
                            placeholder : '',
                            label : 'Prenom',
                            required : true,
                            onEmptyErrorMessage : 'Champ obligatoire',
                            initialValue : author?.first
                        },
                        last : {
                            id : 'last',
                            placeholder : '',
                            label : 'Nom',
                            required : true,
                            onEmptyErrorMessage : 'Champ obligatoire',
                            initialValue : author?.last
                        },
                        gender : {
                            id : 'gender',
                            label : 'Genre',
                            required : true,
                            onEmptyErrorMessage : 'Champ obligatoire',
                            initialValue : author?.gender,
                            renderFieldComponent : props => (
                                <div className="w-full sm:w-[48%] mt-4">
                                    <div className="flex flex-wrap w-full gap-2">
                                        <label className="text-gray-500" htmlFor="category">Catégorie</label>
                                        { props.hasError && (
                                            <p className='text-red-500 text-xs mt-1'> { props.validity === FieldValidity.EMPTY ? props.onEmptyErrorMessage : props.onInvalidErrorMessage } </p>
                                        )}
                                    </div>
                                    <CustomSelectBox
                                        className="bg-white"
                                        name={props.name}
                                        placeholder="placer dans catégorie"
                                        defaultValue={props.initialValue}
                                        options={[{label : 'Homme', value : 'homme'}, {label : 'Femme', value : 'femme'}]}
                                        search
                                        sort
                                        onChange={ option => props.onChange && props.onChange({name : props.name, value : option.value!} ) }
                                    />
                                </div>
                            )
                            
                        },
                        dob : {
                            id:  'dob',
                            label : 'Anniversaire',
                            initialValue : getDate(author.dob)?.toISOString()?.slice(0, 10),
                            renderFieldComponent : props => (
                                <div className="w-full sm:w-[48%] mt-4">
                                    <label htmlFor={props.id}>{props.label}</label>
                                    <input
                                        onChange={ e => props.onChange && props.onChange({name : props.name, value : e.target.value}) }
                                        defaultValue={props.initialValue}
                                        name={props.name}
                                        id={props.id} 
                                        type="date" 
                                        className="h-8 w-full border px-2" 
                                    />
                                </div>
                            )
                        },
                        biography : {
                            id : "biography",
                            label : 'Biographie',
                            required : true,
                            pattern : PATTERN_MIN_LENGTH_PATTERN(200),
                            onEmptyErrorMessage : 'Champ obligatoire',
                            onInvalidErrorMessage : 'Vous devez écrire au moins 200 caracters',
                            initialValue : author?.biography,
                            placeholder : 'entrée une description du livre (au moins 200 caracters)',
                            renderFieldComponent : props => (
                                <div className="w-full sm:w-[98%] mt-4">
                                    <div className="flex flex-wrap w-full gap-2">                       
                                        <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                                        { props.hasError && <p className='text-red-500 text-xs mt-1'>{ (props.validity === FieldValidity.EMPTY) ? props.onEmptyErrorMessage : props.onInvalidErrorMessage}</p>}
                                    </div>
                                    <textarea 
                                        onChange={e => props.onChange && props.onChange({name : e.target.name, value : e.target.value})}
                                        name={props.name}
                                        id={props.id} 
                                        rows={5} 
                                        placeholder={props.placeholder}
                                        defaultValue={props.initialValue}
                                        className="p-2 w-full border rounded-sm"
                                    />
                                </div>
                            ),
                        },
                        _id : {
                            initialValue : author?._id,
                            renderFieldComponent : () => <></> 
                        }

                    }}
                >

                    <div className="mt-4">
                        <Button className='flex items-center justify-center gap-2' disabled={states.isSubmiting}>
                            <span>Enregistrer</span>
                            { states.isSubmiting ? <span className='fa-solid fa-circle-notch animate-spin' /> : <i className="fas fa-unlock" />  }
                        </Button>
                    </div>

                </MyForm>

                { states.notification && <states.notification />}
            </div>
        </div>
    )
};
