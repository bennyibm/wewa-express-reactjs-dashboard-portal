export default function raiseCustomEvent(eventName: string, props?: any){
    document.dispatchEvent( new CustomEvent(eventName, { detail: { ...props } }) )
}