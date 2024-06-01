"use client"

import { useEffect, useState } from "react";
import { chat_message, chat_message_listener } from './../server/socket';

export default function ChatBox() {
    const [messageInput, setMessage] = useState("");

    useEffect(() => {
        chat_message_listener(displayMessage)}, [])

    async function clickSendHandler() {
      if (messageInput != "" ) {
        chat_message(messageInput).then();
        setMessage("");
      }
    }

    function displayMessage(message) {
        const div = document.createElement("div");
        div.textContent = message;
        const container = document.getElementById("message-container");
        container.append(div);
        container.scrollTop = container.scrollHeight;
    }

    return (
        <div className="min-h-[600px] bg-gray-800 p-4 rounded-xl flex-col">
            <div id="message-container" className="bg-gray-700 w-full h-[600px] p-2 rounded-xl overflow-y-auto"> 
            </div>
            <div className="bg-inherit items-center justify-start w-full h-10 mt-4 flex">
                <input className="bg-slate-700 text-white w-3/4 h-10 rounded-xl p-2 hover:bg-slate-600"
                value={messageInput}
                onChange={e => {setMessage(e.target.value)}}
                placeholder="message"
                aria-label="message"
                onKeyDown={(e) => { if (e.key === "Enter") {clickSendHandler(); }}}/>
                <button className="bg-slate-700 text-white w-1/4 h-10 rounded-xl hover:bg-slate-600 disabled:bg-slate-950 disabled:text-gray-700"
                onClick={clickSendHandler}>
                    Send
                </button>
            </div>
        </div>
    );
}
