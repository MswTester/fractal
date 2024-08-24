import { useEffect, useState } from "react";

export const useOnce = (callback:Function) => {
    const [once, setOnce] = useState<boolean>(false)
    useEffect(() => setOnce(true), [])
    useEffect(() => {
        if(!once) return;
        callback()
    }, [once])
}