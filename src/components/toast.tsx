import { useMemo } from "react"

type props ={
    text : string
    typer? : 'success' | 'warning' | 'danger' | 'info'
    icon? : string
    onClose? : () => void,
    bgColor2? : string
}

export default function Toast({typer, text, icon = 'fas fa-info', bgColor2 = '', onClose} : props){
    const bgColor = useMemo( () => {
        let res = ''
        if(typer === 'danger'){
            res = 'red'
        }else if(typer === 'warning'){
            res = 'indigo'
        }else if(typer === 'success'){
            res = 'green'
        }else{
            res = 'blue'
        }

        return res

    }, [typer])

    return(
        <div className={`relative flex items-center gap-x-2 max-w-sm py-2 px-4 rounded-sm ${bgColor2}-300`}>
            <button 
                onClick={onClose}
                className={`absolute -top-3 right-1 hover:scale-105 flex items-center justify-center w-6 h-6 rounded-full  text-sm fas fa-close ${bgColor2}-400 shadow-md hover:text-white`} 
            />
            <i className={`${icon} text-2xl`} />
            <p>{text}</p>
        </div>
    )
}