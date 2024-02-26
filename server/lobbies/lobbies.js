let lobbies = {"ABCD": {}, "WXYZ": {}};

export function join_lobby(lobby_code, username, user_id, lobby_list=lobbies) {
    if (!(lobby_code in lobby_list)) {
        return{status: 400, message: `No lobby with code ${lobby_code}`};
    }

    if (lobby_list[lobby_code][user_id] !== undefined) {
        return {status: 200, uuid: user_id, username: lobby_list[lobby_code][user_id].username};
    }

    if (Object.values(lobby_list[lobby_code]).map((usr) => {
        return usr.username;
    }).includes(username)) {
        return {status: 400, message: `User named ${username} already in lobby ${lobby_code}`};
    }

    lobby_list[lobby_code][user_id] = {username: username};

    console.log(`UserID[${user_id}] joined room ${lobby_code} with username ${username}`);

    return {status: 200, uuid: user_id, username};
}

export function leave_lobby(user_id, lobby_list=lobbies) {
    const lobby_id = Object.keys(lobby_list).filter((key) => lobby_list[key][user_id] !== undefined);
    if (lobby_id.length === 0) {
        return {status: 400, message: `You are not in a lobby`};
    }

    lobby_list[lobby_id[0]][user_id] = undefined;
    return {status: 200};
}