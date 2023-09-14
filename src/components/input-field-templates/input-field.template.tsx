import { Field, FieldValidity } from "../my-form";

export default function InputFieldTemplate( props : Field & {name : string, validity? : FieldValidity, hasError? : boolean} ){
    return (
        <div className='my-4'>
            <div className={`group overflow-hidden rounded-sm flex flex-1 h-10 border ${props.hasError ? 'border-red-500': (props.validity === FieldValidity.VALID) ? 'border-blue-200' : ''}`}>
                <label 
                    htmlFor={props.id}
                    className={`${props.icon} ${props.hasError ? 'bg-red-500 text-white' : (props.validity === FieldValidity.VALID) ? 'bg-blue-100' : 'group-focus-within:bg-primary bg-slate-100 group-focus-within:text-white'}   flex justify-center items-center w-10 h-full`} 
                />
                <input
                    id={props.id}
                    type={props.type} 
                    name={props.name} 
                    onChange={e => props.onChange && props.onChange({name : e.target.name, value : e.target.value})} 
                    placeholder={props.placeholder}
                    defaultValue={props.initialValue}
                    readOnly={props.readonly}
                    className='h-full w-full pl-2' 
                />
            </div>
            { props.hasError && (
                <p className='text-red-500 text-xs mt-1 '> { props.validity === FieldValidity.EMPTY ? props.onEmptyErrorMessage : props.onInvalidErrorMessage } </p>
            )}
        </div>
    )
}