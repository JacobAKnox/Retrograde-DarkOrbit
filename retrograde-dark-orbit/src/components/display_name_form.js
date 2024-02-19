//to finish
"use client"
import React, { useState } from 'react';

export default function DisplayNameForm({ onJoin, existingUsernames }) {
    const [username, setUsername] = useState('');
    const [isUnique, setIsUnique] = useState(true);

    const handleJoin = () => {
        if (existingUsernames.includes(username)) {
            setIsUnique(false);
        } else {
            setIsUnique(true);
            onJoin(username);
        }
    };

    return (
        <div className="bg-inherit p-4 m-4 flex flex-col">
            <input
                className={`bg-slate-700 text-white m-1 py-2 px-10 rounded-xl ${!isUnique && 'border-red-500 border-2'}`}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-label="Username"
            />
            {!isUnique && <p className="text-red-500 text-xs italic">Username is already taken, please choose another.</p>}
            <button
                className="bg-slate-900 text-white m-1 py-2 px-10 rounded-xl"
                onClick={handleJoin}
            >
                Join
            </button>
        </div>
    );
}