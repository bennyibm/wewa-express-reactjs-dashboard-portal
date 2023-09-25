import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi"
import { Driver, User } from "../models";
import Modal from "./modal";
// import MyForm, { InputFieldTemplate2 } from "./my-form";

import MyForm, { FieldInputType, InputFieldCustomSelect, InputCheckBoxList, InputRadioButtonList } from './my-form';
import CustomSelectBox from "./custom-select-box";
import Button from './button';
import { executeAfter } from "../utils/helpers/timeout-interval";
import InputPatterns from "../utils/constants/input-patterns";
import { useApiCrud } from "../hooks";
import raiseCustomEvent from "../utils/helpers/events";
import HttpStatusCode from '../utils/constants/http-status-code';
import { Alert } from "@material-ui/lab";
type props = {
    onClose: (succed?: boolean) => void
    driver?: Driver
}
type States = {
    isLoading?: boolean
    data?: Partial<Driver>
    error?: HttpStatusCode
}
export default function EditDriver({onClose, driver}: props) {
    const [states, setStates] = useState<States>()
    const { save } = useApiCrud("drivers")
    const errorAlertRef = useRef<number>()
    const onSubmit= useCallback( (fields: any) => {
        
        console.log(fields);
        
        setStates( prev => ({...prev, isLoading: true, error: undefined}))
        setTimeout( () => {
            save(fields)
            .then( res => {
                raiseCustomEvent("show-alert", { message: "Le nouveau chauffeur a bien été enregistré", severity: "success"  })
                onClose(true)
            })
            .catch( err => {
                setStates( prev => ({...prev, error: err?.response?.data?.statusCode || HttpStatusCode.CANT_REACH}))
            })
            .finally( () => {
                setStates( prev => ({...prev, isLoading: false}))
            })
        }, 2000)
    }, [onClose, save])
    
    useEffect( () => {
        
        if(states?.error){
            errorAlertRef.current = setTimeout( () => setStates( prev => ({...prev, error: undefined})), 7000, "")    
        }else{
            clearTimeout(errorAlertRef.current)
        }
    }, [states?.error])
    return(
        <Modal showCloseButton onClose={onClose}>
            <h3 className="sticky top-0 bg-[#f7dfd9] p-4 text-sm sm:text-lg md:text-2xl border-b-2 border-primary/10"> { driver ? "" : "Enregistrer un nouveau Chauffeur"} </h3>
            { states?.error && (
                <Alert onClose={ () => setStates( prev => ({...prev, error: undefined}))} variant="filled" elevation={1} severity={states.error === HttpStatusCode.CONFLICT ? "warning" : "error"}>
                    {states.error === HttpStatusCode.CONFLICT ? "cette adresse mail est déjà utilisé par un autre" : "une erreure est survenu! veillez réessayer svp!"}
                </Alert>
            )}
            <MyForm onSubmit={onSubmit} className="p-4 md:p-8 flex flex-wrap justify-between gap-4"
                onChange={({name, value}: {name: string, value: string}) =>  setStates( prev => ({...prev, data: {...prev?.data, [name]: value }}))}
                fields={{ 
                    first: {
                        label:"Prénom",
                        placeholder: "",
                        required: true,
                        extraData: {halfWidth: true}
                    },
                    last: {
                        label: "Nom",
                        required: true,
                        extraData: {halfWidth: true}
                    },
                    phone:{
                        label: "Téléphone",
                        required: true,
                        extraData: {halfWidth: true}
                    },
                    username: {
                        label: "Email",
                        required: true,
                        extraData: {halfWidth: true},
                        type: FieldInputType.EMAIL,
                        pattern: InputPatterns.EMAIL
                    },
                    dob: {
                        label: "Date de naissance",
                        placeholder: "",
                        type: FieldInputType.DATE,
                        required: false,
                        extraData: {halfWidth: true}
                    },
                    gender: {
                        label: "Genre",
                        placeholder: "",
                        // renderFieldComponent: InputFieldCustomSelect,
                        renderFieldComponent: InputRadioButtonList,
                        required: true,
                        extraData: {halfWidth: true, autoFocus: true, flexWrapOptions: true, addWrapper: true, options: [ {label: "Homme", value: "homme"}, { label: "Femme", value:"femme"} ]}
                    }
                }}
                onEmptyErrorMessage="Champ obligatoir"
                onInvalidErrorMessage="Format invalide"
            >

                <div>
                    <Button 
                        className='text-sm w-full flex items-center justify-center gap-2' 
                        isLoading={states?.isLoading}
                        type="submit"
                    >
                        <span>Enregistrer</span>
                    </Button>
                </div>
            </MyForm>
        </Modal>
    )
};
