import { Field, FieldValidity } from "../my-form";

export default function TextAreaFieldTemplaate( props : Field & {name : string, validity? : FieldValidity, hasError? : boolean} ){
    return (
        <div className='my-4 w-full'>
            <div className="w-full">
                <div className="flex flex-wrap w-full gap-2">                       
                    <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                    { props.hasError && (props.validity === FieldValidity.EMPTY) && <p className='text-red-500 text-xs mt-1'>{props.onEmptyErrorMessage}</p>}
                </div>
                <textarea  
                    className='p-2 w-full border rounded-sm'
                    rows={4}
                    id={props.id}
                    name={props.name} 
                    onChange={e => props.onChange && props.onChange({name : e.target.name, value : e.target.value})} 
                    placeholder={props.placeholder}
                    defaultValue={props.initialValue}
                    readOnly={props.readonly} 
                />
            </div>
            { props.hasError && (props.validity === FieldValidity.INVALID) && <p className='text-red-500 text-xs mt-1 '>{props.onInvalidErrorMessage}</p> }
        </div>
    )
}

