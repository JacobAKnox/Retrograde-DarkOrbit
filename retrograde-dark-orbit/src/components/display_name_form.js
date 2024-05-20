import React, { useState } from 'react';
import { create_lobby } from './../server/socket';
import { navigate } from './navigation';
import { storeItem } from '../server/storage.js';

export default function DisplayNameForm() {
    const [username, setUsername] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleJoin = async () => {
        try {
            // Attempt to join the lobby through the server
            const result = await create_lobby(username); 
            if (result.status === 200) {
                storeItem("code", result["code"])
                navigate(`/lobby?code=${result["code"]}`);
                setFeedback('Joined successfully!');
            } else {
                setFeedback(result.message);
            }
        } catch (error) {
            setFeedback('An error occurred while joining the lobby.');
        }
    };

    return (
        <div className="bg-inherit p-4 m-4 items-center flex flex-col">
            <input
                className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-600"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
            />
            <p className="text-red-500 text-xs italic">{feedback}</p>
            <button
                className="bg-slate-900 text-white m-1 py-2 px-10 rounded-xl hover:bg-slate-800 disabled:bg-slate-950 disabled:text-gray-700"
                onClick={handleJoin}
                disabled={username === "" || feedback !== ""}
            >
                Join
            </button>
        </div>
    );
}
