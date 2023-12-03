import { FastifyReply, FastifyRequest } from "fastify"
import { ActionType } from "../types"
import { validate } from "../auth/validate"

export const checkValidation = (resource: string, action: ActionType) => {
    return async (_req: FastifyRequest, res: FastifyReply) => {
        const isAllowed = await validate(resource, action)


        if (!isAllowed) {
            return res.status(403).send({ "message": "Forbidden", "status": "error" })
        }
    }
}