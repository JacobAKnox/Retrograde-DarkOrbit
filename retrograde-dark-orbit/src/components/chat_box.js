"use client"

import { useState } from "react";
import { chat_message } from '@/server/socket';
import { getRecMessage } from "@/server/socket";

export default function ChatBox() {
    const [messageInput, setMessage] = useState("");
    const [messageReceived, setRecMessage] = useState("");

    async function clickSendHandler() {
        chat_message(messageInput).then();
    }

    function update_message(message) {
        setMessage(message);
    }

    function update_recMessage(message) {
        setRecMessage(message);
    }

    return (
        <div className="border-4 border-blue-400 w-1/2 h-[60rem] bg-gray-800 m-20 rounded-xl">
            <div className="bg-gray-700 m-4 p-4 w-[full-5rem] h-[52rem] rounded-xl">
                
            </div>
            <div className="bg-inherit items-center justify-start w-[full-5rem] h-[4rem]">
                <input className="bg-slate-700 text-white m-4 py-2 px-[14rem] rounded-xl hover:bg-slate-600 disabled:bg-slate-900 placeholder:disabled:text-gray-700" 
                value={messageInput}
                onChange={e => {update_message(e.target.value)}}
                placeholder={"message"}
                aria-label="message"/>
                <button className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-600 disabled:bg-slate-950 disabled:text-gray-700"
                onClick={clickSendHandler}>
                    Send
                </button>
                <p className="text-white">
                    MESSAGE HERE
                </p>
            </div>
        </div>
    );
}