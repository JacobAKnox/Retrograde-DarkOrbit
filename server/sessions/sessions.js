import { get_lobby_by_player, get_username } from "../lobbies/lobbies.js";

let sessionStore = {}

export function find_or_create_session(sessionId, sessions=sessionStore) {
    if (sessionId) {
      // find existing session
      const session = sessions[sessionId];
      console.log("session send")
      if (session) {
        console.log("session found")
        const code = get_lobby_by_player(session.userId);
        if (code) {
          session.code = code;
          session.username = get_username(session.userId);
        }
        return session;
      }
    }
    // create new session
    console.log("new session")
    sessionId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    sessions[sessionId] = {sessionId, userId, code: "", username: ""};
    return sessions[sessionId];
}