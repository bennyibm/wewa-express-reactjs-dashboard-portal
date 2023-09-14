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
type props = {
    onClose: () => void
    driver?: Driver
}
type States = {
    isLoading?: boolean
    data?: Partial<Driver>
}
export default function EditDriver({onClose, driver}: props) {
    const [states, setStates] = useState<States>()
    const onSubmit= useCallback( (data: Partial<Driver>) => {
        
        console.log(" blabla");
        setStates( prev => ({...prev, isLoading: true}))

        executeAfter( {delay: 2000, callback : () => setStates( prev => ({...prev, isLoading: false}))})
    }, [])
    
    return(
        <Modal showCloseButton onClose={onClose}>
            <h3 className="bg-primary/20 p-4 md:text-2xl border-b-2 border-primary/10"> { driver ? "" : "Enregistrer un nouveau Chauffeur"} </h3>
            <MyForm onSubmit={onSubmit} className="p-4 md:p-8 flex flex-wrap justify-between gap-4"
                onChange={({name, value}: {name: string, value: string}) =>  setStates( prev => ({...prev, data: {...prev?.data, [name]: value }}))}
                fields={{ 
                    firstName: {
                        label:"Prénom",
                        placeholder: "",
                        required: true,
                        extraData: {halfWidth: true}
                    },
                    lastName: {
                        label: "Nom",
                        required: true,
                        extraData: {halfWidth: true}
                    },
                    phone:{
                        label: "Téléphone",
                        required: true,
                        extraData: {halfWidth: true}
                    },
                    email: {
                        label: "Email",
                        required: true,
                        extraData: {halfWidth: true},
                        type: FieldInputType.EMAIL,
                        pattern: InputPatterns.EMAIL
                    },
                    dateNaiss: {
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
