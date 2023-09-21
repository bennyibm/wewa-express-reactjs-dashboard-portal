import { useCallback, useMemo, useRef, useState } from "react";
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
type props = {
    onClose: (succed?: boolean) => void
    driver?: Driver
}
type States = {
    isLoading?: boolean
    data?: Partial<Driver>
}
export default function EditDriver({onClose, driver}: props) {
    const [states, setStates] = useState<States>()
    const { save } = useApiCrud("drivers")
    const onSubmit= useCallback( (fields: any) => {
        
        console.log(fields);
        
        setStates( prev => ({...prev, isLoading: true}))
        setTimeout( () => {
            save(fields)
            .then( res => {
                raiseCustomEvent("show-alert", { message: "Le nouveau chauffeur a bien été enregistré", severity: "success"  })
                onClose(true)
            })
            .catch( err => {
                console.log("error");
            })
        }, 2000)
        executeAfter( {delay: 2000, callback : () => setStates( prev => ({...prev, isLoading: false}))})
    }, [onClose, save])
    
    return(
        <Modal showCloseButton onClose={onClose}>
            <h3 className="bg-primary/20 p-4 md:text-2xl border-b-2 border-primary/10"> { driver ? "" : "Enregistrer un nouveau Chauffeur"} </h3>
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
