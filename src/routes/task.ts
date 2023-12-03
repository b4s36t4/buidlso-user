import { FastifyPluginAsync } from "fastify";
import { ActionType } from "../types"
import { checkValidation } from "../utils/checkValidation";
import { Task } from "../models/task";
import { Types } from "mongoose";
import { CreateTask, GetTaskParams, ICreateTask, TaskID, UpdateTask } from "../dto/task";

const TaskPlugin: FastifyPluginAsync = async (app) => {
    app.post("/tasks", { preHandler: checkValidation("tasks", ActionType.MANAGE), schema: { body: CreateTask } }, async (req, res) => {
        const { title, endDate, description } = req.body as ICreateTask

        const newTask = await Task.create({ title, deadline: new Date(endDate), description: description, status: "OPEN" })

        return res.status(201).send({ "message": "success", data: newTask })

    })

    app.get("/tasks", { preHandler: checkValidation("tasks", ActionType.READ), schema: { params: GetTaskParams } }, async (req, res) => {
        const { page, page_size } = (req.params ?? {}) as { page: number, page_size: number }
        const tasks = await Task.find().limit(page_size).skip(page_size * page)
        return tasks
    })

    app.delete("/tasks/:taskId", { preHandler: checkValidation("tasks", ActionType.DELETE), schema: { params: TaskID } }, async (req, res) => {

        const { taskId } = (req.params ?? {}) as { taskId: string }
        if (!taskId || !Types.ObjectId.isValid(taskId)) {
            return res.status(400).send({ message: "Invalid taskID provided", status: "error" })
        }

        const task = await Task.findByIdAndDelete(taskId)
        if (!task) {
            return res.status(404).send({ message: "No task found with the provided ID", status: "error" })
        }

        return res.send({ "message": "Task deleted", "status": "error" })
    })


    app.patch("/task/:taskId", { preHandler: checkValidation("tasks", ActionType.MANAGE), schema: { body: UpdateTask, params: TaskID } }, async (req, res) => {
        const { taskId } = (req.params ?? {}) as { taskId: string }

        const { description } = (req.body ?? {}) as { description: string }

        if (!taskId || !Types.ObjectId.isValid(taskId)) {
            return res.status(400).send({ message: "Invalid taskID provided", status: "error" })
        }
        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).send({ message: "No task found with the provided ID", status: "error" })
        }

        task.description = description
        await task.save()
        return res.send({ "message": "Task details updated", "status": "error" })
    })
}

export { TaskPlugin }