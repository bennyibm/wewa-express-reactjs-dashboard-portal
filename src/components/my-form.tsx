import { FunctionComponent, useCallback, useRef, useState } from "react"
import { FaCheck } from "react-icons/fa"
import CustomSelectBox from "./custom-select-box"

enum InputPatterns{
    EMAIL = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
    PASSWORD = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}",
    MIN_HEIGHT_8 = "(?=.*).{8,}",
    URL = "https?://.+",
    ALPHABETS_AND_SPACES = '[a-zA-Z.\\D]+'
}

export const isMatchingPattern = (text : string, pattern : string) => (new RegExp(pattern)).test(text)


export enum FieldInputType {
    TEXT = 'text',
    PASSWORD = 'password',
    SELECT_BOX = 'selectbox',
    NUMBER = 'number',
    PHONE = 'tel',
    FILE = 'file',
    DATE = "date",
    EMAIL = "email"
}

export enum FieldValidity{
    VALID = 'valid',
    EMPTY = 'empty',
    INVALID = 'invalid'
}

export type Field  = {
    type? : FieldInputType
    label? : string
    id? : string
    initialValue? : string
    placeholder? : string
    icon? : string
    required? : boolean
    readonly? : boolean
    pattern? : InputPatterns | string
    onChange? : (field : {name : string, value : any}) => void

    onEmptyErrorMessage? : string
    onInvalidErrorMessage? : string
    renderFieldComponent? : FunctionComponent<Field & {name : string, validity? : FieldValidity, hasError? : boolean}>
    className? : string
    extraData? : any
}

type props = {
    id?: string
    fields : {[x : string] : Field}
    renderFieldComponent? : FunctionComponent<Field & {name : string, validity? : FieldValidity, hasError? : boolean}>
    onChange? : (field : {name : string, value : any}) => void
    onSubmit? : ( fields : {[x : string] : any}) => void
    className? : string
    SubmitButton? : any
    children? : any
    ref?: React.LegacyRef<HTMLFormElement>
    onEmptyErrorMessage? : string
    onInvalidErrorMessage? : string
}

export function InputFieldTemplate1( props : Field & {name : string, validity? : FieldValidity, hasError? : boolean} ){
    return (
        <div className={`w-full ${props.extraData?.halfWidth ? "md:w-[48%]" : ""}`}>
            <div className="w-full">
                <div className="mb-2 flex items-center flex-wrap w-full gap-2">                       
                    <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                    { props.hasError && <p className='text-red-500 text-[.6rem]'>{ (props.validity === FieldValidity.EMPTY) ? props.onEmptyErrorMessage :props.onInvalidErrorMessage }</p>} 
                    {/* (props.validity === FieldValidity.EMPTY) && <p className='text-red-500 text-[.6rem]'>{props.onEmptyErrorMessage}</p>} */}
                </div>
                <input  
                    className='rounded-md p-2 h-12 w-full border'
                    id={props.id}
                    type={ (props.type === FieldInputType.PASSWORD) || (props.type === FieldInputType.DATE) ? props.type : undefined} 
                    name={props.name} 
                    onChange={e => props.onChange && props.onChange({name : e.target.name, value : e.target.value})} 
                    placeholder={props.placeholder}
                    defaultValue={props.initialValue}
                    readOnly={props.readonly} 
                />
            </div>
            {/* { props.hasError && (props.validity === FieldValidity.INVALID) && <p className='text-red-500 text-[.6rem] '>{props.onInvalidErrorMessage}</p> } */}
        </div>
    )
}

export function InputFieldTextArea( props : Field & {name : string, validity? : FieldValidity, hasError? : boolean} ){
    return (
        <div className="w-full">
            <div className="mb-2 flex items-center flex-wrap w-full gap-2">                       
                <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                { props.hasError && <p className='text-red-500 text-[.6rem]'>{ (props.validity === FieldValidity.EMPTY) ? props.onEmptyErrorMessage : props.onInvalidErrorMessage}</p>}
            </div>
            <textarea 
                onChange={e => props.onChange && props.onChange({name : e.target.name, value : e.target.value})}
                name={props.name} 
                id={props.id} 
                rows={5} 
                placeholder={props.placeholder} // 'entrée une description du livre (aumoins 500 characters)'
                defaultValue={props.initialValue}
                className="p-2 w-full border rounded-md"
            />
        </div>
    )
}

export function InputFieldCustomSelect( props : Field & {name : string, validity? : FieldValidity, hasError? : boolean} ){
    return(
        <div className={`w-full ${props.extraData?.halfWidth ? "md:w-[48%]" : ""}`}>
            <div className="mb-2 flex items-center flex-wrap w-full gap-2">
                <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                { props.hasError && (
                    <p className='text-red-500 text-[.6rem]'> { props.validity === FieldValidity.EMPTY ? props.onEmptyErrorMessage : props.onInvalidErrorMessage } </p>
                )}
            </div>
            <CustomSelectBox
                id={props.id}
                className="bg-white"
                name={props.name}
                placeholder={props.placeholder}
                defaultValue={props.initialValue}
                options={props.extraData?.options}
                onChange={ option => props.onChange && props.onChange({name : props.name, value : option.value!} ) }
            />
        </div>
    )
}

export function InputCheckBoxList ( props: Field & { name: string, validity?: FieldValidity, hasError?: boolean} ){
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null)
    const handleOnChecked = useCallback( (e:any) => {
        const values = inputRef.current?.value
  
        if(values?.includes(e.target.value) ){
          inputRef.current!.value = inputRef?.current?.value?.replace(`${e.target?.value};`, "") || ""
        }else{
          inputRef.current!.value = inputRef?.current?.value?.concat(`${e.target?.value};`) || ""
        }
  
       props.onChange && props.onChange({ name: props.name, value: inputRef.current!.value })
    }, [props]) 

    return (
        <div className={`w-full ${props.extraData?.halfWidth ? "md:w-[48%]" : ""}`}>
             <div className="mb-2 flex items-center flex-wrap w-full gap-2">
                <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                { props.hasError && (
                    <p className='text-red-500 text-[.6rem]'> { props.validity === FieldValidity.EMPTY ? props.onEmptyErrorMessage : props.onInvalidErrorMessage } </p>
                )}
            </div>
            <div className={`${props.extraData?.flexWrapOptions ? "flex-wrap" : ""} text-sm flex items-center gap-x-2.5 sm:gap-x-5`}>
                <input className={props.required ? "required" : ""} ref={inputRef as any} type="hidden" defaultValue={props.initialValue} name={props.name} onChange={handleOnChecked}/>
                {  props.extraData?.options.map( (opt: any, key: number) => (
                <label autoFocus={props.extraData?.autoFocus} htmlFor={`${props.type}-${props.name}-${key}`} className='h-6 flex gap-x-1 items-center cursor-pointer capitalize text-black'>          
                    <input onChange={handleOnChecked} className="peer hidden" defaultChecked={ props.initialValue?.includes(opt?.value || opt)} key={key.valueOf()} id={`${props.type}-${props.name}-${key}`} name={`opts-${props.name}-${key}`} value={opt?.value || opt} type="checkbox"/>
                    <div className='w-5 h-5 bg-gray-200 rounded block peer-checked:hidden'/>
                    <div className='w-5 h-5 bg-primary rounded hidden peer-checked:flex items-center justify-center text-white text-xs'>            
                    <FaCheck/>
                    </div>
                    <span className='flex-1 '>{opt?.label || opt}</span>
                </label>
                ))}
            </div>
        </div>
    )
}

export function InputRadioButtonList(props: Field & { name: string, validity?: FieldValidity, hasError?: boolean} ){
    const onRadioClick = useCallback((key: number) => {
      document.getElementById(`${props.type}-${props.name}-${key}`)?.click()
    }, [props.name, props.type])
    
    return (
        <div className={`w-full ${props.extraData?.halfWidth ? "md:w-[48%]" : ""}`}>
             <div className="mb-2 flex items-center flex-wrap w-full gap-2">
                <label className="text-gray-500" htmlFor={props.id}>{props.label}</label>
                { props.hasError && (
                    <p className='text-red-500 text-[.6rem]'> { props.validity === FieldValidity.EMPTY ? props.onEmptyErrorMessage : props.onInvalidErrorMessage } </p>
                )}
            </div>           
            <div className={`${props.extraData?.flexWrapOptions ? "flex-wrap" : ""} ${props.extraData?.flexCol? "flex-col gap-y-3": "items-center"} text-sm flex gap-x-2.5 lg:gap-x-5`}>
                { props.extraData?.options?.map( (opt: any, key: number) => (
                    <button type="button" autoFocus={props.extraData?.autoFocus && key===0} key={key.valueOf()} className={`${props.extraData?.addWrapper ? "py-4 px-2 border rounded": ""} h-12 flex gap-x-1 items-center cursor-pointer capitalize text-left text-black`} onClick={() => onRadioClick(key)}>
                        <input onChange={ e => props.onChange && props.onChange({name: props.name, value: e.target.value})} className={`${props.required ? "required" : ""} input peer hidden`} defaultChecked={ props.initialValue === (opt?.value || opt)} key={key.valueOf()} id={`${props.type}-${props.name}-${key}`} name={props.name} type="radio" value={opt?.value || opt} />
                        <span className='inline-block w-6 h-6 rounded-full bg-gray-200 peer-checked:bg-primary relative peer-checked:after:bg-white after:absolute after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:rounded-full' />
                        <span className='flex-1 '>{opt?.label || opt}</span>
                    </button>
                )) }
            </div>
        </div>
    )
}
export default function MyForm({ ref, id, fields, onChange, onSubmit, className,onEmptyErrorMessage, onInvalidErrorMessage, renderFieldComponent: RenderFieldComponent = InputFieldTemplate1, children} : props){
    const [states, setStates] = useState( { fields  })
    const formDatas = useRef( (() => {
        let datas : {[x : string] : string} = {}
        Object.entries(fields).forEach( ([fieldName, field]) => {
            datas[fieldName] = field.initialValue || ''
        })

        return datas
    })() ) 

    const validateField = useCallback( (field : Field, currentValue : string) => {
        
        if(field.required){
            if(!currentValue) return FieldValidity.EMPTY
        }

        if( field.pattern && !isMatchingPattern(currentValue, field.pattern) ){
            return FieldValidity.INVALID
        }

        return FieldValidity.VALID
    }, [])
    
    const handleSubmit = useCallback( (e : any) => {
        e.preventDefault()

        let anyError = false
        const newDatas : any = {}
        Object.entries(states.fields).forEach( ([fieldName, field]) => {
            const validity = validateField(field, formDatas.current[fieldName])
            newDatas[fieldName] = {
                ...fields[fieldName],
                initialValue : formDatas.current[fieldName], 
                validity, 
                hasError : validity !== FieldValidity.VALID 
            }
            anyError ||= validity !== FieldValidity.VALID
        })

        setStates( prev => ({...prev, fields : newDatas}))

        !anyError && onSubmit && onSubmit(formDatas.current)

    }, [fields, onSubmit, states.fields, validateField])
    
    const handleChange = useCallback( (field : {name : string, value : any}) => {
        formDatas.current = {...formDatas.current, [field.name] : field.value}
        onChange && onChange(field)
    }, [onChange])

    return (
        <form
            ref={ref}
            id={id} 
            onSubmit={handleSubmit}
            className={` ${className}`}
            
            onKeyDown={ e => (e.key === 'Enter') && handleSubmit(e) }
        >
            { 
                Object.entries(states.fields)
                .map( ([name, field], index) => (
                    field.renderFieldComponent ? <field.renderFieldComponent key={index} onEmptyErrorMessage={onEmptyErrorMessage} onInvalidErrorMessage={onInvalidErrorMessage} {...field} name={name} onChange={handleChange} />: <RenderFieldComponent key={index} onEmptyErrorMessage={onEmptyErrorMessage} onInvalidErrorMessage={onInvalidErrorMessage} {...field} name={name} onChange={handleChange} />
                )) 
            }

            {children}
        </form>
    )
}