import { useCallback, useEffect, useMemo, useState } from "react";
import { Client, Driver } from "../models";
import Modal from "./modal";
// import MyForm, { InputFieldTemplate2 } from "./my-form";

import MyForm, { FieldInputType } from './my-form';
import Button from './button';
import InputPatterns from "../utils/constants/input-patterns";
import { useApiCrud, useApiSecured } from "../hooks";
import raiseCustomEvent from "../utils/helpers/events";
import { InputFieldCustomSelect } from './my-form';
type props = {
    onClose: (succed?: boolean) => void
    data?: { drivers?: Driver[], clients?: Client[] }
}
type States = {
    isLoading?: boolean
    data?: Partial<Client>
    drivers?: Driver[]
    clients?: Client[]
}
export default function AddDelivery({onClose, data}: props) {
    const [states, setStates] = useState<States>({ drivers: data?.drivers, clients: data?.clients})
    const { save } = useApiCrud("delivery")

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
    
    const Form = useMemo( () => () => (
        <MyForm onSubmit={onSubmit} className="p-4 md:p-8 flex flex-wrap justify-between gap-4"
                onChange={({name, value}: {name: string, value: string}) =>  setStates( prev => ({...prev, data: {...prev?.data, [name]: value }}))}
                fields={{ 
                    client: {
                        label:"Client",
                        placeholder: "",
                        required: true,
                        renderFieldComponent: InputFieldCustomSelect,
                        extraData: {halfWidth: true, options: states?.clients?.map(({user}) => ({label: `${user.first} ${user.last}`, value: user._id})) }
                    },
                    driver: {
                        label: "Chauffeur",
                        required: true,
                        renderFieldComponent: InputFieldCustomSelect,
                        extraData: {halfWidth: true, options: states?.drivers?.map(({user}) => ({label: `${user.first} ${user.last}`, value: user._id})) }
                    },
                    adrepickupAdressss: {
                        label: "Où prendre le colis",
                        required: true,
                    },
                    destinatorName: {
                        label: "Nom du destinateur",
                        placeholder: "",
                        required: true,
                    },
                    destinatorPhone: {
                        label: "Téléphone du destinateur",
                        placeholder: "",
                        required: true,
                        extraData: {halfWidth: true},
                        type: FieldInputType.PHONE,
                    },
                    destinatorEmail: {
                        label: "Email du destinateur",
                        placeholder: "",
                        required: false,
                        extraData: {halfWidth: true},
                        type : FieldInputType.EMAIL,
                        pattern: InputPatterns.EMAIL
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
    ), [states?.isLoading])
    
    return(
        <Modal showCloseButton onClose={onClose}>
            <h3 className="bg-primary/20 p-4 text-sm sm:text-lg md:text-2xl border-b-2 border-primary/10"> Créer une demande de livraison</h3>
            <Form />
            {/* <MyForm onSubmit={onSubmit} className="p-4 md:p-8 flex flex-wrap justify-between gap-4"
                onChange={({name, value}: {name: string, value: string}) =>  setStates( prev => ({...prev, data: {...prev?.data, [name]: value }}))}
                fields={{ 
                    client: {
                        label:"Client",
                        placeholder: "",
                        required: true,
                        renderFieldComponent: InputFieldCustomSelect,
                        extraData: {halfWidth: true, options: states?.clients?.map(({user}) => ({label: `${user.first} ${user.last}`, value: user._id})) }
                    },
                    driver: {
                        label: "Chauffeur",
                        required: true,
                        renderFieldComponent: InputFieldCustomSelect,
                        extraData: {halfWidth: true, options: states?.drivers?.map(({user}) => ({label: `${user.first} ${user.last}`, value: user._id})) }
                    },
                    adrepickupAdressss: {
                        label: "Où prendre le colis",
                        required: true,
                    },
                    destinatorName: {
                        label: "Nom du destinateur",
                        placeholder: "",
                        required: true,
                    },
                    destinatorPhone: {
                        label: "Téléphone du destinateur",
                        placeholder: "",
                        required: true,
                        extraData: {halfWidth: true},
                        type: FieldInputType.PHONE,
                    },
                    destinatorEmail: {
                        label: "Email du destinateur",
                        placeholder: "",
                        required: false,
                        extraData: {halfWidth: true},
                        type : FieldInputType.EMAIL,
                        pattern: InputPatterns.EMAIL
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
            </MyForm> */}
        </Modal>
    )
};
