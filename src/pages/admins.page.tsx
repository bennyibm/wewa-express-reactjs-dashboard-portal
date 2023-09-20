import { useEffect, useMemo, useState } from "react"
import { useApiCrud } from "../hooks"
import { Driver, User } from "../models"
import { FiUserPlus } from "react-icons/fi"
import DataTable from "../components/data-table.component"
import AddAdmin from '../components/add-user';

type props={
    setHeading: (title: string, description: string) => void
}

export default function Administrators({setHeading}: props){
    const [showAddUser, setShowAddUser] = useState(false)
    const {findAll} = useApiCrud<User>("auth/admins")
    const headers= useMemo( () => {
        return ([
            {render: (admin: User) => `${admin.first} ${admin.last}`, label: "Nom", key: "first" as keyof User},
            {label: "Email", key: "username" as keyof User},
            {label: "Téléphone", key: "phone" as keyof User},
            {label: "Status", key: "status" as keyof User},
        ])
    }, [])

    const RenderList = useMemo( () => () => (
        <div className="flex flex-col gap-y-2 shadow bg-white rounded-lg overflow-hidden">
            <DataTable<Partial<User>> title="" fetchData={findAll} actionButton={{ label:"détails", link:"" }} headers={headers} headbutton={{ label: "Ajouter", onClick: () => setShowAddUser(true), icon: <FiUserPlus /> }} />
        </div>
    ), [findAll, headers])
    
    useEffect( () => {
        setHeading("Administrateurs","")
    }, [setHeading])

    return(
        <>
            {showAddUser && <AddAdmin onClose={() => setShowAddUser(false) } />}
            <RenderList />
        </>
    )
}