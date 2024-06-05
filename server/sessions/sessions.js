import { get_game } from "../games/game.js";
import { get_lobby_by_player, get_username, leave_lobby } from "../lobbies/lobbies.js";

let sessionStore = {}
let connected = {};

let updatePlayerListCallback = (code) => {};
export function set_update_player_list_callback(cb) {
  updatePlayerListCallback = cb;
}

export function find_or_create_session(sessionId, sessions=sessionStore) {
    if (sessionId) {
      const session = sessions[sessionId];
      if (session) {
        const code = get_lobby_by_player(session.userId);
        if (code) {
          session.code = code;
          session.username = get_username(session.userId);
        }
        return session;
      }
    }
    sessionId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    sessions[sessionId] = {sessionId, userId, code: "", username: ""};
    connected[sessionId] = sessions[sessionId];
    return sessions[sessionId];
}

export function queue_leave(sessionId, sessions=sessionStore) {
  const session = sessions[sessionId];
  delete connected[sessionId];
  setTimeout(() => {
    if (sessionId in connected) {
      return;
    }
    console.log(session);
    const code = get_lobby_by_player(session.userId);
    if (get_game(code)) {
      return;
    }
    leave_lobby(session.userId);
    updatePlayerListCallback(code);
  }, 5000);
}