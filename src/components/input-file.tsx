import { useRef, useCallback, useState } from "react"

type props = {
    onChange? : (currentFile : File) => void
    className? : string
    placeholder? : string
    name? : string
    id? : string
    accept? : string
}
export default function InputFile({accept, name, id,  onChange, className = '', placeholder} : props){
    const inputFileRef = useRef<HTMLInputElement | null> (null)
    const [label, setLabel] = useState(placeholder)

    const handleFileInputChange = useCallback( (e : any) => {
        const {files} = e.target
        if(files){

            const file = files[0]
            setLabel(file?.name)
            onChange && onChange(file)
        }
        
    }, [onChange])

    return(
        <div 
            className={`w-full flex items-center justify-between cursor-pointer ${className}`} 
            onClick={e  => {
                e.preventDefault()
                e.stopPropagation()
                inputFileRef.current?.click()
            }}
        >
            <label htmlFor="bookFile" className={`truncate w-full cursor-pointer ${label === placeholder ? 'text-gray-400' : ''}`} >{label}</label>
            <button className="h-8 w-fit py-1 px-2 bg-gray-100 hover:bg-gray-50 text-gray-600 truncate rounded-sm" >sélectionner</button>
            <input accept={accept} ref={inputFileRef} type="file" name={name} id={id} className="hidden" onChange={handleFileInputChange} onClick={ e => e.stopPropagation()} />
        </div>
    )
}