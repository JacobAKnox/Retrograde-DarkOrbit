let sessionStore = {}

export function find_or_create_session(sessionId, sessions=sessionStore) {
    if (sessionId) {
        // find existing session
        const session = sessions[sessionId];
        if (session) {
          return session;
        }
      }
      // create new session
      sessionId = crypto.randomUUID();
      const userId = crypto.randomUUID();
      sessions[sessionId] = {sessionId, userId};
      return sessions[sessionId];
}