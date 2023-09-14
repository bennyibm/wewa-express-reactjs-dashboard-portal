import { useCallback, useEffect, useMemo, useState } from "react"

export type Option = {
    value? : string,
    label : string
}
type props = {
    id? : string
    name? : string
    placeholder? : string
    options? : Option[]
    defaultValue? : string
    onChange? : (option : Option) => void
    maxItems? : number
    search? : boolean
    sort? : boolean
    className? : string
}
export default function CustomSelectBox({className = '', placeholder, name = '', id, options = [], defaultValue,maxItems = 5, onChange, search, sort} : props){
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [currentOption, setCurrentOption] = useState(options.find( option => option.value === defaultValue))
    const label = useMemo( () => currentOption?.label || placeholder, [currentOption, placeholder])

    
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
        <div 
            className={`flex items-center py-2 px-1 text-sm cursor-pointer hover:bg-gray-100 ${isCurrent(option) ? 'bg-gray-100 text-primary' : ''}`} 
            onClick={ () => setCurrentOption(option)}
        >
            {isCurrent(option) && <i className="fas fa-check mx-1 " />}
            <span className=''>{option.label}</span>
        </div>
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
        setShowDropdown(false)
        currentOption && onChange && onChange(currentOption)
    }, [currentOption, onChange])

    useEffect( () => {
        document.onclick = () => setShowDropdown(false)
    }, [])

    return(
        <div className="relative" onClick={e => e.stopPropagation()}>
            <div className={`cursor-pointer flex justify-between items-center h-12 border rounded-md ${className}`} onClick={ e => {e.preventDefault(); setShowDropdown( prev => !prev)}}>
                <label className="text-gray-400 truncate whitespace-nowrap cursor-pointer p-2 flex-1" htmlFor="">{label}</label>
                <div className="flex justify-center items-center w-6 border-l h-full cursor-pointer  text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    <i className={`fas fa-angle-right ${showDropdown ? '-rotate-90' : 'rotate-90'}`} />
                </div>
            </div>
            <div className={`${showDropdown ? 'block' : 'hidden'} absolute z-20 w-full bg-gray-50 rounded shadow overflow-hidden`} >
                { search && (
                        <div className="flex items-center gap-1 bg-gray-100 text-sm border">
                            <label className="fas fa-search mx-1" />
                            <input placeholder="taper pour filtrer" type="text" className="flex w-full h-8 bg-gray-100" onChange={e => setSearchText(e.target.value)} />
                        </div>
                    )
                }
                <div className="divide-y max-h-[10.5rem] overflow-y-auto">
                    {
                        sorting(filter()).map( (option, index) => <RenderOption key={index} option={option} />)
                    }

                </div>
            </div>

            <input id={id} type="hidden" name={name}  />
        </div>
    )
}