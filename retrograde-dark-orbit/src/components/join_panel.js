'use client'

import { useState } from "react";
import { navigate } from "./navigation";

export default function JoinPanel({try_join_lobby, navigation = navigate}) {
    const [usernameInput, setUsernameInput] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function clickHandler() {
        try_join_lobby(usernameInput, codeInput).then((res) => {
            if (res.status === 200) {
                navigation("/lobby");
            } else {
                setErrorMessage(res.message);
            }
        });
    }

    function update_username(name) {
        setErrorMessage("");
        setUsernameInput(name);
    }

    function update_code(code) {
        setErrorMessage("");
        setCodeInput(code.toUpperCase());
    }

    return (
        <div className="bg-inherit p-4 m-4 items-center flex flex-col">
            <input className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-600 disabled:bg-slate-900 placeholder:disabled:text-gray-700" 
            value={usernameInput}
            onChange={e => {update_username(e.target.value)}}
            placeholder={"Username"}
            aria-label="Username"/>
            <input className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-600 disabled:bg-slate-900 placeholder:disabled:text-gray-700" 
            value={codeInput}
            onChange={e => {update_code(e.target.value)}}
            placeholder={"Code"}
            aria-label="Code"/>
            <button className="bg-slate-900 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-800 disabled:bg-slate-950 disabled:text-gray-700"
            onClick={clickHandler}
            disabled={usernameInput === "" || codeInput === "" || errorMessage !== ""}
            >
                Join
            </button>
            <p className="bg-inherit text-red-500 m-1 py-1 px-2 text-center text-lg text-wrap">
                {errorMessage ==  "" ? "" : "Error: " + errorMessage}
            </p>
        </div>
    );
}