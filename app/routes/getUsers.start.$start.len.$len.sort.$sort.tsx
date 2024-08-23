import { json, LoaderFunction } from "@remix-run/node";
import { connectToMongoDB, getMongoDB } from "~/db/db";

export const loader: LoaderFunction = async ({ params }) => {
    const {start, len, sort} = params;
    connectToMongoDB();
    const db = getMongoDB();
    const collection = db.collection("users");
    const users = await collection.find({}).sort({[sort as string]:-1}).skip(+(start as string)).limit(+(len as string)).toArray();
    return json(users);
}