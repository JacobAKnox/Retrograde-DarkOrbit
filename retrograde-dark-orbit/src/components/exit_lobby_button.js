"use client"

import { leave_lobby } from "./../server/socket";
import { navigate } from "./navigation";

export default function ExitLobbyButton({navigator = navigate}) {
    return(
        <div className="flex flex-row w-2/3 md:justify-start items-center justify-center">
            <button className="bg-slate-900 text-grey-100 m-3 px-4 py-2 rounded-xl hover:1bg-slate-800 disabled:bg-slate-950"
            onClick={() => {navigator("/"); leave_lobby();}}>
                    X
            </button>
        </div>
    );
}