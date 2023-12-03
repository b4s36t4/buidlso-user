import mongoose from "mongoose"

export const connect = async () => {
    const DB_URI = process.env.DB_URI
    if (!DB_URI) {
        throw new Error("No DB config found")
    }
    await mongoose.connect(DB_URI)
}