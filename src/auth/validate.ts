import axios from "axios"
import { ActionType } from "../types"

export const validate = async (resource: string, action: ActionType) => {
    try {
        await axios.post("/validate", { resource, action })
        return true
    } catch (error) {
        
    }
}