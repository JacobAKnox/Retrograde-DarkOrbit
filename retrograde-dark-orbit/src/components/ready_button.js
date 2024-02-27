"use client"

import { useState } from "react"

export default function ReadyButton() {
  const [buttonText, setButtonText] = useState("Ready");

  function updateReadyState() {
    // Server update (mocking the server response at the moment)
    const response = {
      status: 200
    };

    // UI update
    if (response.status == 200) {
      toggle();
    }
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
    <button className="bg-slate-900 min-w-[175px] text-xl text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-800 disabled:bg-slate-950 disabled:text-gray-700" onClick={() => toggle()} role="button">
      {buttonText}
    </button>
  )
}
