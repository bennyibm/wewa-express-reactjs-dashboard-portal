import { useCallback } from "react"

type props = {
    className? : string
    rate? : number
}
export default function Rating({className = '', rate = 4.5} : props){
    const Stars = useCallback( () => {
        if(rate === 0){
            return (
                <>
                    <i className="fas fa-star text-slate-300" />
                    <i className="fas fa-star text-slate-300" />
                    <i className="fas fa-star text-slate-300" />
                    <i className="fas fa-star text-slate-300" />
                </>
            )
        }else{
            let stars = []
            for(let i = 1; i <= Math.trunc(rate); i++){
                stars.push(0)
            }
            stars = stars.map( () => <i className="fas fa-star text-primary" /> )
            if( rate.toString().includes(".") && rate.toString().split(".")[1] ){
                stars.push( <i className="fas fa-star-half text-primary" /> )
            }

            return (
                <>{stars.map( str => str)}</>
            )
        }
    }, [rate])
    return(
        <div className={`flex py-1 gap-2 ${className}`}>
            {/* <i className="fas fa-star text-primary" />
            <i className="fas fa-star text-primary" />
            <i className="fas fa-star text-primary" />
            <i className="fas fa-star-half text-primary" /> */}
            <Stars />
        </div>
    )
}