import { useSelector } from "react-redux"
import { useCompset } from "~/utils/compset"

export default function Navbar(){
    const {patch, lng} = useCompset()
    const homeState:string = useSelector((state:any) => state.homeState)

    return <nav className='nav'>
        <div onClick={e => patch('homeState', 'rank')} className={homeState === 'rank' ? "sel" : ""}>{lng('rank')}</div>
        <div onClick={e => patch('homeState', 'clan')} className={homeState === 'clan' ? "sel" : ""}>{lng('clan')}</div>
        <div onClick={e => patch('homeState', 'lobby')} className={homeState === 'lobby' ? "sel" : ""}>{lng('play')}</div>
        <div onClick={e => patch('homeState', 'profile')} className={homeState === 'profile' ? "sel" : ""}>{lng('profile')}</div>
        <div onClick={e => patch('homeState', 'shop')} className={homeState === 'shop' ? "sel" : ""}>{lng('shop')}</div>
    </nav>
}