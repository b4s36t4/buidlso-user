import { z } from "zod";

export const CreateTask = z.object({
    title: z.string(),
    description: z.string(),
    endDate: z.string()
})

export type ICreateTask = z.infer<typeof CreateTask>

export const GetTaskParams = z.object({
    page: z.number().optional(),
    page_size: z.number().optional()
})

export type IGetTaskParams = z.infer<typeof GetTaskParams>

export const UpdateTask = z.object({
    description: z.string()
})

export type IUpdateTask = z.infer<typeof UpdateTask>

export const TaskID = z.object({
    taskId: z.string()
})

export type ITaskIDParams = z.infer<typeof TaskID>