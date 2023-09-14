import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type Option = {
    value? : string,
    label : string
}
type props = {
    name? : string
    placeholder : string
    options? : Option[]
    defaultValue? : string
    onChange? : (option : Option) => void
    maxItems? : number
    search? : boolean
    sort? : boolean
    className? : string
    id? : string
}
export default function CustomSelectBoxV2({className = '', id = Date.now().toString(), placeholder, name = '' , options = [], defaultValue,maxItems = 5, onChange, search, sort} : props){
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [currentOption, setCurrentOption] = useState(options.find( option => option.value === defaultValue))
    const label = useMemo( () => currentOption?.label || placeholder, [currentOption, placeholder])
    const componentRef = useRef<HTMLDivElement | null>(null)

    const isCurrent = useCallback( (optionValue : Option) => {
        if(!currentOption){
            return false
        }else if(currentOption.label === optionValue.label){
            return true
        }else{
            return false
        }
        
    }, [currentOption])

    const RenderOption = useCallback( ({option} : {option : Option}) => (
        <button 
            className={`w-full flex items-center py-2 px-1 text-sm cursor-pointer hover:bg-gray-100 ${isCurrent(option) ? 'bg-gray-100 text-primary' : ''}`} 
            onClick={ () => {
                setShowDropdown(false)
                setCurrentOption(option)
            }}
        >
            {isCurrent(option) && <i className="fas fa-check mx-1 " />}
            <span className=''>{option.label}</span>
        </button>
    ), [isCurrent])

    const filter = useCallback( () => {
        return options.filter(option => {
            return !searchText ?  option : (
                 option.label.toLowerCase().includes(searchText.toLowerCase()) 
            )
        })
                        
    }, [options, searchText])

    const sorting = useCallback( (options : Option[]) => {
        return sort ? options.sort( (a, b) => a.label.localeCompare(b.label) ) : options
    }, [sort])

    useEffect( () => {
        setCurrentOption( options.find( option => option.value === defaultValue) )
    }, [defaultValue, options])

    useEffect( () => {
        
        currentOption && onChange && onChange(currentOption)
    }, [currentOption, onChange])

    return(
        <div
            id={id}
            ref={componentRef}
            
            onBlur={ e =>  {
                setTimeout( () => {
                    const activElInDoc = document.activeElement
                    let hasFocusIn = false
                    componentRef.current?.querySelectorAll('button')?.forEach( btn => {
                        if(btn === activElInDoc){
                            hasFocusIn = true
                            return
                        }
                    })
                    
                    if(!hasFocusIn){
                        setShowDropdown(false)
                    }
                }, 30)
            } }
            className={`relative ${showDropdown ? '' : 'overflow-hidden'}`} >
            <button onClick={ () =>  setShowDropdown(prev => !prev)} className={`cursor-pointer flex justify-between items-center h-8 border ${className}`} >
                <span className="text-gray-400 truncate whitespace-nowrap cursor-pointer p-1 flex-1 text-left" >
                    {label}
                </span>
                <span className="flex justify-center items-center w-6 border-l h-full cursor-pointer  text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    <i className={`fas fa-angle-right ${showDropdown ? '-rotate-90' : 'rotate-90'}`} />
                </span>
            </button>
            <div className={` absolute z-20 w-full bg-gray-50 rounded shadow`} >
                { search && (
                        <div className="flex items-center gap-1 bg-gray-100 text-sm border">
                            <label className="fas fa-search mx-1" />
                            <input onClick={ e => e.stopPropagation()} placeholder="taper pour filtrer" type="text" className="flex w-full h-8 bg-gray-100" onChange={e => setSearchText(e.target.value)} />
                        </div>
                    )
                }
                <div className="divide-y max-h-[10.5rem] overflow-y-auto">
                    {
                        sorting(filter()).map( (option, index) => <RenderOption key={index} option={option} />)
                    }

                </div>
            </div>

            <input type="hidden" name={name}  />
        </div>
    )
}