type props = {
    errorText? : string
    reloadText? : string
    callback? : () => void
}
export default function ErrorComponent({errorText, reloadText, callback} : props){

    return (
        <div className="text-xs flex-1 flex flex-col items-center gap-2 py-8 sm:-12">
            <i className="fas fa-bug text-xl sm:text-2xl md:text-6xl text-primary" />
            <p className=" max-w-sm text-center">{errorText}</p>
            <p className=" max-w-sm text-center">cliquez pour recharger</p>
            <button className="fas fa-refresh text-3xl hover:text-primary hover:scale-125 my-2" onClick={callback} />
        </div>
    )
}