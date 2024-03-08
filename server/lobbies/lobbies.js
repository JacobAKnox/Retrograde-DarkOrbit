let lobbies = {"ABCD": {}, "WXYZ": {}};

export function join_lobby(lobby_code, username, user_id, lobby_list=lobbies) {

    if (!(lobby_code in lobby_list)) {
        return{status: 400, message: `No lobby with code ${lobby_code}`};
    }

    if (lobby_list[lobby_code][user_id] !== undefined) {
        return {status: 200, uuid: user_id, username: lobby_list[lobby_code][user_id].username, code: lobby_code};
    }

    if (Object.values(lobby_list[lobby_code]).map((usr) => {
        return usr.username;
    }).includes(username)) {
        return {status: 400, message: `User named ${username} already in lobby ${lobby_code}`};
    }

    lobby_list[lobby_code][user_id]= {username: username, ready_state:false};
    console.log(`UserID[${user_id}] joined room ${lobby_code} with username ${username}`);

    return {status: 200, uuid: user_id, username, code: lobby_code};
}

export default function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const keyLength = 6;
  
    let randomKey = '';
    for (let i = 0; i < keyLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomKey += characters.charAt(randomIndex);
    }
  
    return randomKey;
  }

export function create_lobby(username, user_id) {
    const key = generateRandomKey();
    lobbies[key] = {}


    return join_lobby(key, username, user_id);
}

export function leave_lobby(user_id, lobby_list=lobbies) {
    const lobby_id = Object.keys(lobby_list).filter((key) => lobby_list[key][user_id] !== undefined);
    if (lobby_id.length === 0) {
        return {status: 400, message: `You are not in a lobby`};
    }

    lobby_list[lobby_id[0]][user_id] = undefined;
    return {status: 200};
}

export function get_lobby(lobby_code, lobby_list=lobbies) {
    if (!(lobby_code in lobby_list)) {
        return false;
    }

    return lobby_list[lobby_code];
}

export function set_player_ready(user_id, lobby_list = lobbies) {
    const lobby_id = Object.keys(lobby_list).find((key) => lobby_list[key][user_id] !== undefined);

    if (lobby_id) {
        const lobby = lobby_list[lobby_id];
        const player = lobby[user_id];
        player.ready_state = !player.ready_state;

        if (player.ready_state) {
            lobby.readyCount += 1;
        } else {
            lobby.readyCount -= 1;
        }
        // do this in index.js
        //io.to(lobby_id).emit("ready_count_updated", { readyCount: lobby.readyCount, totalPlayers: Object.keys(lobby.players).length });

        return { status: 200, message: "Ready state toggled" };
    }

    return { status: 400, message: "Player not found in any lobby" };
}

export function get_num_players(lobby_id,lobby_list){
    const lobby = lobby_list[lobby_id];
    const players_in_lobby = Object.keys(lobby).length;

    return players_in_lobby;

}

export function get_num_ready_players(lobby_id, lobby_list){
    const lobby = lobby_list[lobby_id];
    const num_ready_players = Object.values(lobby).reduce((count, player) => {
        return count + (player.ready_state ? 1 : 0);}, 0);

    return num_ready_players;

}