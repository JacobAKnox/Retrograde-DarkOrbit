"use client"

import { navigate } from "./navigation";

export default function ExitLobbyButton() {
    return(
        <button className="bg-slate-900 text-grey-100 m-3 px-4 py-2 rounded-xl hover:bg-slate-800 disabled:bg-slate-950"
        onClick={() => {navigate("/");}}>
                X
        </button>
    );
}