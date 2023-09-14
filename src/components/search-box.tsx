import { useCallback, useRef, useState } from 'react';

type props = {
    debounceDuration? : number
    callback : (searchText : string) => void
    placeholder? : string
}

export default function SearchBox( {debounceDuration = 1000, callback, placeholder} : props ){
    const [isEmpty, setIsEmpty] = useState(true)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const timeoutIdRef = useRef<number>()
    const resetSearch = useCallback( () => {
        if(!isEmpty){
            setIsEmpty(true)
            inputRef.current!.value = ""
            callback("")
        }
    }, [callback, isEmpty])
    
    const handleChange = useCallback( (text : string) => {
        setIsEmpty(text === "")
        if(timeoutIdRef.current){
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = undefined
        }

        timeoutIdRef.current = setTimeout( () => callback(text), debounceDuration, text)
    }, [callback, debounceDuration])


    return (
        <div className="hidden sm:flex items-center h-fit text-xs border border-slate-200 bg-transparent rounded overflow-hidden">
            <input
                ref={inputRef}
                type="text" 
                placeholder={placeholder} 
                className="bg-transparent pl-2 w-80 h-10 text-slate-300" 
                onChange={ e => handleChange(e.target.value)}
            />
            <label htmlFor="search" onClick={resetSearch} className={`fas ${isEmpty ? "fa-search" : "fa-close hover:text-white cursor-pointer"} text-gray-400 text-lg flex justify-center items-center w-8 h-8 xl:font-bold`} />
        </div>
    )
}