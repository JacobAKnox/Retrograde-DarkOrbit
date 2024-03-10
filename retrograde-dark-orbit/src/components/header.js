"use client"

import { leave_lobby } from "./../server/socket";
import { navigate } from "./navigation";

export default function Header() {
    return (
        <header className="flex justify-center items-center min-w-full">
          <h1 className="text-3xl p-5 text-red-300 text-center"
          onClick={() => {navigate("/"); leave_lobby();}}>
            <b>Retrograde Dark Orbit</b>
          </h1>
        </header> 
    );
}