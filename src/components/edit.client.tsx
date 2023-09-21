import { useCallback, useState } from "react";
import { Client } from "../models";
import Modal from "./modal";
// import MyForm, { InputFieldTemplate2 } from "./my-form";

import MyForm, { FieldInputType, InputRadioButtonList } from './my-form';
import Button from './button';
import { executeAfter } from "../utils/helpers/timeout-interval";
import InputPatterns from "../utils/constants/input-patterns";
import { useApiCrud } from "../hooks";
import raiseCustomEvent from "../utils/helpers/events";
type props = {
    onClose: (succed?: boolean) => void
    Client?: Client
}
type States = {
    isLoading?: boolean
    data?: Partial<Client>
}
export default function EditClient({onClose, Client}: props) {
    const [states, setStates] = useState<States>()
    const { save } = useApiCrud("clients")
    const onSubmit= useCallback( (fields: any) => {
        
        
        setStates( prev => ({...prev, isLoading: true}))
        setTimeout( () => {
            save(fields)
            .then( res => {
                raiseCustomEvent("show-alert", { message: "le nouveau client à bien été enregistré", severity: "success"  })
                onClose(true)
            })
            .catch( err => {
                console.log("error");
            })
            .finally( () => {
                setStates( prev => ({...prev, isLoading: false}))
            })
        }, 2000)
    }, [onClose, save])
    
    return(
        <Modal showCloseButton onClose={onClose}>
            <h3 className="bg-primary/20 p-4 text-sm sm:text-lg md:text-2xl border-b-2 border-primary/10"> { Client ? "" : "Enregistrer un client (App Mobile)"} </h3>
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
                        renderFieldComponent: InputRadioButtonList,
                        required: true,
                        extraData: {halfWidth: true, autoFocus: true, flexWrapOptions: true, addWrapper: true, options: [ {label: "Homme", value: "homme"}, { label: "Femme", value:"femme"} ]}
                    },
                    adress: {
                        label: "Adresse",
                        placeholder: "",
                        required: true,
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
