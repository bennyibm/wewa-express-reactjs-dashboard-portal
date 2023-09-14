import Container from "./container"

type props = {
    className? : string
    container? : boolean
    containerClassName? : string
    containerStyle? : any
    style? : any
    children? : any
    id? : string
}
export default function Section( { className = '', id, style = {}, children, container = true, containerStyle = {}, containerClassName = ''} : props ){
    return (
        <section className={`bg-cover ${className}`} id={id}>
            {
                container ? (
                    <Container className={`${containerClassName} h-full `} style={containerStyle}>
                        {children}
                    </Container>
                ) : (
                    <>
                        {children}
                    </>
                )
            }
        </section>
    )
}