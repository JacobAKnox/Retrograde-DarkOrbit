import { MongoClient } from "mongodb";
import 'dotenv/config'

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const db_name = process.env.DATABASE || "RetrogradeDarkOrbit";

const client = new MongoClient(uri);
const database = client.db(db_name);

export async function fetch_roles() {
    const roles = database.collection("roles");
    return (await roles.find({}).toArray()).reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
}
