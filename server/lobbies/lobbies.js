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

export function create_lobby(username, user_id, lobby_list=lobbies) {
    let key = generateRandomKey();
    while (key in Object.keys(lobby_list)) {key = generateRandomKey();}
    lobby_list[key] = {};

    return join_lobby(key, username, user_id, lobby_list);
}

export function leave_lobby(user_id, lobby_list=lobbies) {
    const lobby_id = Object.keys(lobby_list).filter((key) => lobby_list[key][user_id] !== undefined);
    if (lobby_id.length === 0) {
        return {status: 400, message: `You are not in a lobby`};
    }

    delete lobby_list[lobby_id[0]][user_id];
    if (Object.keys(lobby_list[lobby_id[0]]).length === 0) {
        delete lobby_list[lobby_id[0]];
    }
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
        
        return { status: 200, message: "Ready state toggled" };
    }

    return { status: 400, message: "Player not found in any lobby" };
}

export function get_num_players(lobby_id, lobby_list = lobbies) {
    const lobby = lobby_list[lobby_id];
    if (!lobby) {
        return 0;
    }
    const players_in_lobby = Object.keys(lobby).length;
    return players_in_lobby;
}


export function get_num_ready_players(lobby_id, lobby_list = lobbies){
    const lobby = lobby_list[lobby_id];
    if (!lobby) {
        return 0;
    }
    const num_ready_players = Object.values(lobby).reduce((count, player) => {
        return count + (player.ready_state ? 1 : 0);}, 0);

    return num_ready_players;
}

export function reset_ready_players(lobby_code, lobby_list=lobbies) {
    const lobby = lobby_list[lobby_code];
    if (!lobby) {
        return;
    }
    Object.keys(lobby).forEach((player_id) => {
        lobby[player_id].ready_state = false;
    });
}

export function get_lobby_by_player(user_id, lobby_list=lobbies) {
    const lobby_code = Object.keys(lobby_list).find((key) => Object.keys(lobby_list[key]).includes(user_id));
    if (!lobby_code) {
        return undefined;
    }

    return lobby_code;
}

export function get_username(user_id, lobby_list=lobbies) {
    const lobby_code = get_lobby_by_player(user_id, lobby_list);
    if (!lobby_code) {
        return undefined;
    }
    return get_lobby(lobby_code, lobby_list)[user_id].username;
}