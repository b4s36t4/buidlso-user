import { Schema, Types, model } from "mongoose";

const schema = new Schema({
    title: String,
    deadline: Date,
    status: { type: String, enum: ["CLOSED", "COMPLETED", "OPEN", "ASSIGNED"] },
    description: String
})

export const Task = model("Task", schema)