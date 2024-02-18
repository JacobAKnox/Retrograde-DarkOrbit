let lobbies = {"ABCD": {}, "WXYZ": {}};

export function join_lobby(lobby_code, username, lobby_list=lobbies) {
    if (!(lobby_code in lobby_list)) {
        return{status: 400, message: `No lobby with code ${lobby_code}`};
    }

    if (Object.values(lobby_list[lobby_code]).includes(username)) {
        return{status: 400, message: `User named ${username} already in lobby ${lobby_code}`};
    }

    const user_id = crypto.randomUUID()
    lobby_list[lobby_code][user_id] = username;

    return {status: 200, uuid: user_id};
}