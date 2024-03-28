"use client"

import { useState } from "react"
import { update_player_ready } from "./../server/socket.js"

export default function ReadyButton() {
  const [buttonText, setButtonText] = useState("Ready");

  function updateReadyState() {
    update_player_ready();

    toggle();
  }

  function toggle() {
    if (buttonText == "Ready") {
      setButtonText("Unready");
    }
    else {
      setButtonText("Ready");
    }
  }

  return (
    <button className="bg-slate-900 min-w-[250px] text-xl text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-800 disabled:bg-slate-950 disabled:text-gray-700" onClick={() => updateReadyState()} role="button">
      {buttonText}
    </button>
  )
}
