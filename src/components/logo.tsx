import { Link } from "react-router-dom"

type props = {
    className? : string
}
export default function Logo({className} : props) {
    
    return(
        <Link to='/#header' className={`flex gap-1 justify-start items-center font-secondary ${className}`}>
            {/* <i className="fas fa-book text-4xl" />
            <span className="text-2xl">Reader</span> */}
            <img src="/images/wewaexpress.png" alt="logo wewaexpress" className="w-28" />
        </Link>
    )
};
