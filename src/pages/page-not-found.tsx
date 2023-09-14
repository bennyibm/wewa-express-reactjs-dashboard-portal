import { useNavigate } from "react-router-dom";
import { Section, Button } from "../components";

export default function PageNotFound() {

    const navigate = useNavigate()
    return(
        <Section
            className="h-[90vh]"
            containerClassName="h-full flex flex-col justify-center items-center"
        >

            <h1 className="flex items-center gap-2 font-semibold md:font-bold text-primary text-9xl">4<i className="fas fa-bomb mx-2 text-7xl" />4</h1>
            <h3 className="text-2xl text-primary my-4">Cette page n'existe pas!</h3>
            <Button onClick={() => navigate(-1)} >revenir en arriere</Button>
        </Section>
    )
};
