import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCompset } from "~/utils/compset";

export default function Home(props:{
    socket: Socket
}) {
    const {patch, useOnce, isFetching, addAlert, addError, lng} = useCompset()
    const user:IUser = useSelector((state:any) => state.user);

    useOnce(() => {
        props.socket.emit('logined', user.id)
    })
    return <main>
        <h1>Home</h1>
    </main>
}