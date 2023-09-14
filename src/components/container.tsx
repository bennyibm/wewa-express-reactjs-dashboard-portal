type props = {
    children? : any
    className? : string
    style? : any
}
export default function Container({className, style, children} : props){

    return(
        <div className={`mx-2 md:mx-10 lg:mx-20 ${className}`} style={style}>
            {children}
        </div>
    )
}