import { Driver } from "../models"
import Modal from "./modal"

type props = {
    driver: Driver
    onClose: () => void
}
export default function DriverDetailsComponent({driver, onClose} : props){

    return (
        <Modal onClose={onClose}>
            <div>
                {/* display all driver details here */}
            </div>
        </Modal>
    )
}