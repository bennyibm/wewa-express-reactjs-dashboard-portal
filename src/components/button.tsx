import { twMerge } from 'tailwind-merge'
import { BiLoaderAlt } from "react-icons/bi"
import { Link } from "react-router-dom"

type props = {
    children? : any
    className? : string
    style? : any
    size? : 'sm' | 'md' | 'lg'
    bgColor? : string
    hoverBgColor? : string
    textColor? : string
    hoverTextColor? : string
    onClick? : () => void
    link? : string
    disabled? : boolean
    isLoading?: boolean
    icon?: any
    form?: string
    type?: "button" | "submit" | "reset"
}
export default function Button({isLoading, form, type, icon="", children,link, disabled, className = '', style, bgColor = 'primary', hoverBgColor = 'primary-deep', textColor = 'white', hoverTextColor = 'white', onClick} : props){
    return link ? (
        <Link to={link} className={`px-7 py-3 bg-primary text-white hover:bg-primary-deep rounded-[.25rem]  ${className}`} style={style}>
            {children}
        </Link>
    ) : (
        <button
            form={form} 
            className={twMerge("px-7 py-3 bg-primary text-white hover:bg-primary-deep rounded-[.25rem]  disabled:pointer-events-none disabled:bg-opacity-80", className)} style={style}
            onClick={onClick}
            disabled={disabled || isLoading}
            type={type}
        >
            {children}
            { isLoading && <span className="animate-spin"><BiLoaderAlt /></span> }
        </button>
    )
}