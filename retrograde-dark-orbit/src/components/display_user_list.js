import React, { useEffect, useState } from 'react';
import { listen_update_player_list, request_current_player_list } from '../server/socket'; 

export default function Display_user_list({ showStatus = true, showNamesOnly = false }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handlePlayerListUpdate = (playerList) => {
      console.log('Updated player list received:', playerList);
      if (Array.isArray(playerList)) { 
        setUsers(playerList);
      }
    };


    request_current_player_list();
    
    listen_update_player_list(handlePlayerListUpdate);
  }, []);

  return (
    <div className="user-list bg-gray-800 p-2 rounded-lg shadow-lg" style={{ minHeight: '550px', minWidth: '220px' }}>
      <ul className="list-none space-y-1">
        {users.map(user => (
          <li key={user.id} className="flex items-center justify-between p-2 
              rounded transition-colors duration-300 text-sm
              bg-gray-700 hover:bg-gray-600 shadow">
            <span className="text-white truncate">{user.name}</span>
            {!showNamesOnly && showStatus && (
              <span>
                {user.ready ? '✅' : '❌'}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
