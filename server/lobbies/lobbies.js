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

    console.log(`Joined room ${lobby_code} with username ${username}`);

    return {status: 200, uuid: user_id};
}

export default function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const keyLength = 6;
  
    let randomKey = '';
    for (let i = 0; i < keyLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomKey += characters.charAt(randomIndex);
    }
  
    return randomKey;
  }

export function create_lobby(username, lobby_list=lobbies) {
    const key = generateRandomKey()
    lobbies[key] = {}
    console.log("create lobby : lobbies.js")
    return join_lobby(key, username)

}