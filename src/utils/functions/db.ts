import mysql from "mysql"
import { database } from "../JSON/config.json"

let db = mysql.createConnection(database)

db.connect()

export const query = (query: any, fonction?: Function) => {
    return db.query(query, fonction)
}