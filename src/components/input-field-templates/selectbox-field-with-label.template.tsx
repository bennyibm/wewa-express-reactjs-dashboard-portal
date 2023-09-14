import CustomSelectBox from "../custom-select-box";
import { Field, FieldValidity } from "../my-form";

export default function SelectBoxFieldWithLabelTemplate( {options = [], ...props} : Field & {name : string, validity? : FieldValidity, hasError? : boolean, options? : {label : string, value? : string}[]} ){
    return (
        <div className="w-full sm:w-[49%] mt-4">
            <div className="flex flex-wrap w-full gap-2">
                <label className="text-gray-500" htmlFor="category">Catégorie</label>
                { props.hasError && (
                    <p className='text-red-500 text-xs mt-1'> { props.validity === FieldValidity.EMPTY ? props.onEmptyErrorMessage : props.onInvalidErrorMessage } </p>
                )}
            </div>
            <CustomSelectBox
                className="bg-white"
                name={props.name}
                placeholder="placer dans catégorie"
                defaultValue={props.initialValue}
                options={options}
                search
                sort
                onChange={ option => props.onChange && props.onChange({name : props.name, value : option.value!} ) }
            />
        </div>
    )
}