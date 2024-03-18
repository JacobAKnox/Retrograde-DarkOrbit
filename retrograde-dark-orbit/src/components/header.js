"use client"

import { leave_lobby } from "./../server/socket";
import { navigate } from "./navigation";
import Image from 'next/image'

export default function Header() {
    return (
        <header className="flex justify-center items-center min-w-full">
          <Image src={require("./../images/logo.png")} width={64} height={64} 
          alt="Retrograde Dark Orbit Logo"
          onClick={() => {navigate("/"); leave_lobby();}}/>
          <h1 className="text-3xl p-5 text-red-300 text-center"
          onClick={() => {navigate("/"); leave_lobby();}}>
            <b>Retrograde Dark Orbit</b>
          </h1>
        </header> 
    );
}