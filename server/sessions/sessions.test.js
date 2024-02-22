import { find_or_create_session } from "./sessions";

describe("session store", () => {

    test("existing session", () => {
        let sessions = {"sesid": {userId: "userid", sessionId: "sesid"}};
        const result = find_or_create_session("sesid", sessions);

        expect(result).toEqual({userId: "userid", sessionId: "sesid"});
    });

    test("sent session but not found", () => {
        let sessions = {};
        const result = find_or_create_session("sesid", sessions);

        expect(result.userId).toBeDefined();
        expect(result.sessionId).toBeDefined();
    });
    
    test("no session sent", () => {
        let sessions = {};
        const result = find_or_create_session(undefined, sessions);

        expect(result.userId).toBeDefined();
        expect(result.sessionId).toBeDefined();
    });
});