import { json, LoaderFunction } from "@remix-run/node";
import { ObjectId } from "mongodb";
import { connectToMongoDB, getMongoDB } from "~/db/db";

export const action: LoaderFunction = async ({ params, request }) => {
    const {col, type} = params;
    const res = await request.json() as any;
    connectToMongoDB();
    const db = getMongoDB();
    const collection = db.collection(col as string);
    if(res['_id']) res['_id'] = new ObjectId(res['_id']);
    switch(type){
        case 'get':{
            const user = await collection.findOne(res);
            return json(user || {failed:true});
        }
        case 'getAll':{
            const users = await collection.find({}).toArray();
            return json(users.length ? users : {failed:true});
        }
        case 'create':{
            if(col === 'users'){
                const user = await collection.findOne({username:{$regex:new RegExp(`^${res.username}$`, 'i')}});
                if(user) return json({failed:true, error:'username already exists'});
            } else if(col === 'clans'){
                const clan = await collection.findOne({name:{$regex:new RegExp(`^${res.name}$`, 'i')}});
                if(clan) return json({failed:true, error:'clan name already exists'});
            }
            const ins = await collection.insertOne(res);
            return json({success:ins.insertedId});
        }
        case 'update':{
            if(res.filter['_id']) res.filter['_id'] = new ObjectId(res.filter['_id']);
            const upd = await collection.updateOne(res.filter, {$set:res.update});
            return json({success:upd.modifiedCount});
        }
        case 'updateAll':{
            if(res.filter['_id']) res.filter['_id'] = new ObjectId(res.filter['_id']);
            const upd = await collection.updateOne(res.filter, {$set:res.update});
            return json({success:upd.modifiedCount});
        }
        case 'delete':{
            const del = await collection.deleteMany(res);
            return json({success:del.deletedCount});
        }
        case 'deleteAll':{
            const del = await collection.deleteMany({});
            return json({success:del.deletedCount});
        }
        case 'deleteKeys':{
            const obj:{[key:string]:''} = {}
            for(let key of res) obj[key] = '';
            const del = await collection.updateMany({}, {$unset:obj});
            return json({success:del.modifiedCount});
        }
        default:{
            return json({error:'Invalid type'});
        }
    }
}