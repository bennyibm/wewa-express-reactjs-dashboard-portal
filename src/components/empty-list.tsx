import { Link } from "react-router-dom";

type props = {
    /**
     * default to edit of current path
     */
    to? : string
    showAddButton? : boolean
    text? : string
}
export default function EmptyList({to = "edit", text, showAddButton} : props){
    return(
        <div className="text-xs flex flex-col items-center gap-4 py-8">
            <p className="">{text}</p>
            <img src="/images/empty-list.png" className="w-36" alt="" />
            { showAddButton && <Link to={to} className="fas fa-add w-8 h-8 bg-primary hover:bg-primary-deep text-white rounded-full flex justify-center items-center" /> }
        </div>
    )
}