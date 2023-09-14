import { BiLoaderAlt } from 'react-icons/bi';
type props = {
    type? : 'spinner' | 'bounce' | 'other'
    className? : string
}

export default function Loader({type = 'spinner', className = ''} : props){
    return(
        <div className="w-full flex-1 flex justify-center items-center text-gray-400 text-4xl">
            <span className={`${className} fa-solid fa-circle-notch animate-spin`}>
                <BiLoaderAlt/>
            </span>
        </div>
    )
}