import { connect } from "mongoose"
import { Logger } from "../class"

export const MongConnect = async() => {
    connect(`mongodb://${process.env.MONG_IP}:${process.env.MONG_PORT}/${process.env.MONG_DB}`, {
        user: process.env.MONG_USER,
        pass: process.env.MONG_PASSWD,
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 
    }).catch(err => Logger.error(err, "MONG CONNECTION"))
}