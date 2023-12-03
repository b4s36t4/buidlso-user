import fastify from "fastify";
import { config } from "dotenv"
import { connect } from "./db/connect";
import { axiosUpdate } from "./utils/axios";
import axios, { AxiosError } from "axios";
import { TaskPlugin } from "./routes/task";
import { ZodSchema } from "zod";

config()

const port = process.env.PORT || 3002
const host = process.env.HOST || "0.0.0.0"

const app = fastify({ logger: { file: "log.txt" } })


declare module "fastify" {
    interface FastifyRequest {
        // you must reference the interface and not the type
        user: any
    }
}

app.setValidatorCompiler<ZodSchema>(({ schema }) => {
    return (data) => {
        if (!schema) {
            return { value: data };
        }
        return schema.parse(data);
    };
});



app.addHook("preHandler", async (fastifyRequest, res) => {
    const path = fastifyRequest.routeOptions.url
    if (path === "/") return;
    const token = fastifyRequest.headers.authorization
    if (!token) {
        return res.status(403).send({ "message": "Forbidden", "status": "error" })
    }
    axiosUpdate(axios, token)
    try {
        const req = await axios.get("/me")
        fastifyRequest.user = req.data.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response, "res")
            if (error.response?.status === 401) {
                return res.status(401).send({ message: "Unauthorized", "status": "error" })
            }

            if (error.response?.status === 403) {
                return res.status(401).send({ message: "Invalid auth", "status": "error" })
            }
        }
        return error
    }
})

app.get("/", async (req, res) => res.send({ "message": "success", "version": "1.0.0" }))

app.register(TaskPlugin)

const main = async () => {
    console.log("Starting Server")
    await connect()
    console.log("Connected to DB")
    const address = await app.listen({ port: Number(port), host })
    console.log(`Server Started at => ${address}`)
}

main()