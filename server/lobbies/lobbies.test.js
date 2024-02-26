import { join_lobby, leave_lobby } from "./lobbies";

describe("lobby system", () => {

    test("try to join a non-existant lobby", () => {
        let lobbies = {};
        const result = join_lobby("ABCD", "test", "123", lobbies);

        expect(result.status).toBe(400);
        expect(result.uuid).toBeUndefined();
        expect(result.message).toBe("No lobby with code ABCD");
        expect(lobbies).toStrictEqual({});
    });

    test("try to join with a duplicate username", () => {
        let lobbies = {"ABCD": {"123": {username: "test"}}};
        const copy = JSON.parse(JSON.stringify(lobbies));
        const result = join_lobby("ABCD", "test", "456", lobbies);

        expect(result.status).toBe(400);
        expect(result.uuid).toBeUndefined();
        expect(result.message).toBe("User named test already in lobby ABCD");
        expect(lobbies).toStrictEqual(copy);
    });

    test("try to join a lobby you are already in", () => {
        let lobbies = {"ABCD": {"123": {username: "test"}}};
        const copy = JSON.parse(JSON.stringify(lobbies));
        const result = join_lobby("ABCD", "test2", "123", lobbies);
        
        // join but have the old username
        expect(result.status).toBe(200);
        expect(result.uuid).toBe("123");
        expect(result.username).toBe("test");
        expect(lobbies).toStrictEqual(copy);
    });

    test("successful join", () => {
        let lobbies = {"ABCD": {}, "WXYZ": {}};
        const result = join_lobby("ABCD", "test", "123", lobbies);

        expect(result.status).toBe(200);
        expect(result.uuid).toBeDefined();
        expect(result.username).toBe("test");
        expect(lobbies.ABCD[result.uuid].username).toBe("test");
    });

    test("try to leave a lobby when not in one", () => {
        let lobbies = {"ABCD": {}, "WXYZ": {}};
        const result = leave_lobby("123", lobbies);

        expect(result.status).toBe(400);
        expect(result.message).toBe("You are not in a lobby");
    });

    test("successfully leave a lobby", () => {
        let lobbies = {"ABCD": {"123" : {username: "test"}, "789": {username: "bar"}}, "WXYZ": {"456": {username: "foo"}}};
        const result = leave_lobby("123", lobbies);

        expect(result.status).toBe(200);
        expect(lobbies).toEqual({"ABCD" : {"789": {username: "bar"}}, "WXYZ": {"456": {username: "foo"}}});
    });
});