//to finish
import React, { useState } from 'react';
import { join_lobby } from "./../server/socket"

export default function DisplayNameForm() {
    const [username, setUsername] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleJoin = async () => {
        try {
            // Attempt to join the lobby through the server
            const result = await join_lobby(username, 'some-code'); // Replace 'some-code' with actual code if we need
            if (result.status === 'ok') {
                setFeedback('Joined successfully!');
            } else {
                setFeedback(result.message);
            }
        } catch (error) {
            
            setFeedback('An error occurred while joining the lobby.');
        }
    };

    return (
        <div className="bg-inherit p-4 m-4 flex flex-col">
            <input
                className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
            />
            <p className="text-red-500 text-xs italic">{feedback}</p>
            <button
                className="bg-slate-900 text-white m-1 py-2 px-10 rounded-xl"
                onClick={handleJoin}
            >
                Join
            </button>
        </div>
    );
}
