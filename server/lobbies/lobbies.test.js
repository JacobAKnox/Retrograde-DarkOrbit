import { join_lobby } from "./lobbies";

describe("lobby system", () => {

    test("try to join a non-existant lobby", () => {
        let lobbies = {};
        const result = join_lobby("ABCD", "test", lobbies);

        expect(result.status).toBe(400);
        expect(result.uuid).toBeUndefined();
        expect(result.message).toBe("No lobby with code ABCD");
        expect(lobbies).toStrictEqual({});
    });

    test("try to join with a duplicate username", () => {
        let lobbies = {"ABCD": {"123": "test"}};
        const copy = {...lobbies};
        const result = join_lobby("ABCD", "test", lobbies);

        expect(result.status).toBe(400);
        expect(result.uuid).toBeUndefined();
        expect(result.message).toBe("User named test already in lobby ABCD");
        expect(lobbies).toStrictEqual(copy);
    });

    test("successful join", () => {
        let lobbies = {"ABCD": {}, "WXYZ": {}};
        const result = join_lobby("ABCD", "test", lobbies);

        expect(result.status).toBe(200);
        expect(result.uuid).toBeDefined();
        expect(lobbies.ABCD[result.uuid]).toBe("test");
    });

});