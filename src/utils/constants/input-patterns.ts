enum InputPatterns{
    EMAIL = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
    PASSWORD = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}",
    MIN_HEIGHT_8 = "(?=.*).{8,}",
    URL = "https?://.+",
    ALPHABETS_AND_SPACES = '[a-zA-Z.\\D]+'
}
export default InputPatterns

export function PATTERN_MIN_LENGTH_PATTERN(minLength : number){
    return `(?=.*)*.{${minLength},}`
}

export function ConcatPattern(pattern1 : string, pattern2 : string){

}