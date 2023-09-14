export const executeAfter = ({callback, delay = 4000, repeat = false} : {callback : Function , delay? : number, repeat? : boolean}) => repeat ? setInterval(callback, delay) : setTimeout(callback, delay)

export const cancelExecution = (processId : number) => {
    clearTimeout(processId)
    clearInterval(processId)
}