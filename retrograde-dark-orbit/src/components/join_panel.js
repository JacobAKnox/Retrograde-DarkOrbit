'use client'

import { useState } from "react";

export default function JoinPanel({try_join_lobby}) {
    const [usernameInput, setUsernameInput] = useState("");
    const [codeInput, setCodeInput] = useState("");

    async function clickHandler() {
        await try_join_lobby(usernameInput, codeInput);
    }

    return (
        <div className="bg-inherit p-4 m-4 flex flex-col">
            <input className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-600 disabled:bg-slate-900 placeholder:disabled:text-gray-700" 
            value={usernameInput}
            onChange={e => {setUsernameInput(e.target.value)}}
            placeholder={"Username"}
            aria-label="Username"/>
            <input className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-600 disabled:bg-slate-900 placeholder:disabled:text-gray-700" 
            value={codeInput}
            onChange={e => {setCodeInput(e.target.value)}}
            placeholder={"Code"}
            aria-label="Code"/>
            <button className="bg-slate-900 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-800 disabled:bg-slate-950 disabled:text-gray-700"
            onClick={clickHandler}
            disabled={usernameInput === "" || codeInput === ""}
            >
                Join
            </button>
        </div>
    );
}