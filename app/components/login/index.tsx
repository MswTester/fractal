import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { checkName, checkPassword, generateUUID, sha256 } from "~/utils/auth";
import { useCompset } from "~/utils/compset";

export default function Login() {
    const {patch, useOnce, isFetching, addAlert, addError, lng} = useCompset()

    const [state, setState] = useState<string>('login')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')

    const tryLogin = async (name:string, pass:string) => {
        if(!checkName(name)) return addError(lng('invalid username'))
        if(!checkPassword(pass)) return addError(lng('invalid password'))
        patch('isFetching', true)
        const res = await fetch('/controller/col/users/type/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:name, password:sha256(pass)})
        })
        const data = await res.json()
        if(data.failed){
            addError(lng('invalid username or password'))
        } else {
            patch('user', data)
            patch('state', 'home')
        }
        patch('isFetching', false)
    }

    const tryRegister = async (name:string, pass:string, conf:string) => {
        if(!checkName(name)) return addError(lng('invalid username'))
        if(!checkPassword(pass)) return addError(lng('invalid password'))
        if(pass !== conf) return addError(lng('passwords do not match'))
        patch('isFetching', true)
        const newUser:IUser = {
            id: generateUUID(),
            username:name, password:sha256(pass),
            avatar: '',
            admin: false,
            banned: false,

            lvl: 1,
            exp: 0,
            gem: 0,
            coin: 0,
            lastLogin: Date.now(),
            lastLogout: Date.now(),
            items: [],
            skills: [],
            equipments: [],

            totalClear: 0,
            totalFail: 0,
            totalPlay: 0,
            totalMobKill: 0,
            totalBossKill: 0,
            totalDeath: 0,
            totalWin: 0,
            totalLose: 0,
            totalDraw: 0,
            totalPvpKill: 0,
            totalPvpDeath: 0
        }
        const res = await fetch('/controller/col/users/type/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        const data = await res.json()
        if(data.failed){
            addError(lng('username already exists'))
        } else if(data.success){
            patch('user', newUser)
            patch('state', 'home')
        } else {
            addError(lng('failed to register'))
        }
        patch('isFetching', false)
    }

    return <main className="w-full h-full flex flex-col justify-center items-center sm:gap-0.5 gap-1 md:gap-1.5 lg:gap-2">
        <input disabled={isFetching} className="sm:w-48 md:w-56 lg:w-64 text-center p" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={lng('username')} />
        <input disabled={isFetching} className="sm:w-48 md:w-56 lg:w-64 text-center p" type={state === 'login' ? "password" : "text"} value={password} onChange={e => setPassword(e.target.value)} placeholder={lng('password')} />
        {state === 'register' && <input disabled={isFetching} className="sm:w-48 md:w-56 lg:w-64 text-center p" type="text" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={lng('confirm password')} />}
        <button disabled={isFetching} className="sm:w-48 md:w-56 lg:w-64 text-center p"
            onClick={e => {
                e.preventDefault()
                if(state === 'login'){
                    tryLogin(username, password)
                } else {
                    tryRegister(username, password, confirm)
                }
            }}
        >{lng(state === 'login' ? 'login' : 'register')}</button>
        <div className="md:text-sm lg:text-base underline cursor-pointer select-none"
            onClick={() => setState(state === 'login' ? 'register' : 'login')}
        >{lng(state === 'login' ? 'goto register' : 'goto login')}</div>
    </main>
}