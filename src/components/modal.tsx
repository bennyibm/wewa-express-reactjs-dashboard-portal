import { useCallback, useEffect } from 'react'
import { AiOutlineClose } from "react-icons/ai"
export type ModalProps = {
    onOutsideClick? : () => void
    onClose? : () => void
    showCloseButton? : boolean
    closeAfterLapse? : number
    children? : any
    className? : string
    contentClassName? : string
}

export default function Modal({className = '', contentClassName = '', showCloseButton = false,onClose, onOutsideClick, children} : ModalProps) {
    
    useEffect(() => {
        const onkeydown = (e: any) => {
            if (e.key?.toLowerCase() === 'escape' || e.key?.toLowerCase() === 'esc') {
                onClose && onClose()
            }
        }
        document.addEventListener('keydown', onkeydown)
        document.body.classList.add('overflow-hidden')
        return () => {
            document.removeEventListener('keydown', onkeydown)
            document.body.classList.remove('overflow-hidden')
        }
    }, [onClose])

  return (
    <section className='fixed z-[100] inset-0 w-full h-full bg-black/60 grid items-center justify-center backdrop-blur'>
        <div className={`relative bg-white md:min-h-[30rem] max-w-3xl rounded-md ${className}`}>
            <button onClick={onClose} type='button' className='absolute z-20 top-0 right-1/2 lg:right-0 -translate-y-1/2 translate-x-1/2 w-8 lg:w-12 h-8 lg:h-12 flex justify-center items-center text-white bg-primary shadow-2xl rounded-full' >
                <AiOutlineClose />
            </button>
            <div className='max-h-[calc(100vh-3rem)] overflow-y-auto'>
                {children}
            </div>
        </div>
    </section>
  )
}
