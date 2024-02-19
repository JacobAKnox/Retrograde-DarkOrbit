"use client"

import { navigate } from "./navigation";

export default function Header() {
    return (
        <header>
          <h1 className="text-3xl p-5 text-red-300 text-center"
          onClick={() => {navigate("/")}}>
            <b>Retrograde Dark Orbit</b>
          </h1>
        </header> 
    );
}