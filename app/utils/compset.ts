import { useDispatch, useSelector } from "react-redux";
import { langOf } from "./lang";
import { useEffect, useState } from "react";

export const useCompset = () => {
    const dispatch = useDispatch()
    const patch = (key:string, value:any) => dispatch({type:key, value})
    const [once, setOnce] = useState<boolean>(false)
    useEffect(() => setOnce(true), [])
    const useOnce = (callback:Function) => {
        useEffect(() => {
            if(!once) return;
            callback()
        }, [once])
    }
    const alerts:IMessage[] = useSelector((state:any) => state.alerts);
    const errors:IMessage[] = useSelector((state:any) => state.errors);
    const lang:string = useSelector((state:any) => state.lang);
    const isFetching:boolean = useSelector((state:any) => state.isFetching);
    const addAlert = (message:string) => patch('alerts', [...alerts, {message, time:Date.now()}])
    const addError = (message:string) => patch('errors', [...errors, {message, time:Date.now()}])
    const lng = (key:string) => langOf(lang, key)
    return {patch, useOnce, isFetching, addAlert, addError, lng}
}