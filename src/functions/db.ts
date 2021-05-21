import mysql from "mysql"
import { database } from "../config.json"

let db = mysql.createConnection(database)

db.connect()

export const query = (query: any, fonction: Function) => {
    db.query(query, fonction)
}

export const create: any = async (where: string, value: Array<string>, info: Array<string>) => {
    db.query(`SELECT * FROM ${where} WHERE ${value[0]} = ${value[1]}`, (err, results) => {
        if (err) throw err
        if (results.length === 0) {
            db.query(`INSERT INTO ${where} (${value[0]}, ${info[0]}) VALUES (${value[1]}, ${info[1]})`)
            return true
        } else return false
    })
    
}