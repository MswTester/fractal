import { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import App from "~/components/engine";
import { checkName, checkPassword, sha256 } from "~/utils/auth";
import { useOnce } from "~/utils/hooks";

export const meta: MetaFunction = () => {
    return [
        { title: "Engine Page" },
        { name: "description", content: "Engine Page" },
    ];
};

export default function Engine() {
    const [user, setUser] = useState<IUser|null>(null)
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const Login = async () => {
        if(!checkName(username)) return setError('Invalid Username')
        if(!checkPassword(password)) return setError('Invalid Password')
        setIsFetching(true)
        const res = await fetch('/controller/col/users/type/get', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username, password:sha256(password)})
        })
        const json:IUser = await res.json()
        setIsFetching(false)
        if(json.id){
            setUser(json)
        } else {
            setError('Invalid Username or Password')
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            {user?.admin ? <App map="f" user={user} />:
            <div className="flex flex-col justify-center items-center gap-3 w-48">
                <input disabled={isFetching} className="p-2 w-full" type="text" name="" id="" placeholder="Username" value={username} onChange={e => {setUsername(e.target.value);setError('');}}/>
                <input disabled={isFetching} className="p-2 w-full" type="password" name="" id="" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value);setError('');}}/>
                <button disabled={isFetching} className="p-2 w-full" onClick={Login}>Login</button>
                <div className="w-full text-center text-red-500">{error}</div>
            </div>
            }
        </div>
    );
}

function Editor() {

    useOnce(() => {
    })

    return (
        <div>
            Engine
        </div>
    );
}
