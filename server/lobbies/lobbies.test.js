import { create_lobby, get_lobby, get_lobby_by_player, get_num_players,get_num_ready_players, get_username, reset_ready_players, set_player_ready } from "./lobbies";
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

    // remove skip when you fix this test
    test("successful create", () => {
        let lobbies = {"ABCD": {}, "WXYZ": {}};
        const result = create_lobby("test", 123, lobbies);
        expect(result.status).toBe(200);
        expect(Object.keys(lobbies).length).toBe(3)
        expect(result.uuid).toBeDefined();
        expect(lobbies[result.code][result.uuid].username).toBe("test");
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

    test("successful find lobby", () => {
        let lobbies = {"ABCD": {data: "test_data"}, "WXYZ": {}};
        const result = get_lobby("ABCD", lobbies);

        expect(result.data).toBe("test_data");
    });

    test("failed to find a lobby", () => {
        let lobbies = {"ABCD": {}, "WXYZ": {}};
        const result = get_lobby("NOTHERE", lobbies);

        expect(result).toBe(false);
    });

    test("get number of players in a lobby", () => {
        let lobbies = {
            "ABCD": {
                    "player1": { ready_state: false },
                    "player2": { ready_state: true }
            }
        };
        const numPlayers = get_num_players("ABCD", lobbies);
        expect(numPlayers).toBe(2);

        //check for non exisiting lobby that should have no players
        const numPlayersNonExisting = get_num_players("EFGH", lobbies);
        expect(numPlayersNonExisting).toBe(0); 

      });
   
      test("get number of ready players in a lobby", () => {
        let lobbies = {
          "ABCD": {
            "player1": { ready_state: false },
            "player2": { ready_state: true }
          }
        };
      
        const numReadyPlayers = get_num_ready_players("ABCD", lobbies);
        expect(numReadyPlayers).toBe(1);
        //check for non exisiting lobby that should have no players
        const numPlayersNonExisting = get_num_players("EFGH", lobbies);
        expect(numPlayersNonExisting).toBe(0); 
      });
      

      test("toggle ready state", () => {
        let lobbies = {
            "ABCD": {
              "player1": { ready_state: false },
              "player2": { ready_state: true }
            }
          };
          //setting player 1 to ready
          let result =  set_player_ready("player1", lobbies);
          expect(result.status).toBe(200);
          expect(result.message).toBe("Ready state toggled");

          expect(lobbies["ABCD"]["player1"].ready_state).toBe(true);

          //setting player back to false(toggle)
          result =  set_player_ready("player1", lobbies);
          expect(result.status).toBe(200);
          expect(result.message).toBe("Ready state toggled");

          expect(lobbies["ABCD"]["player1"].ready_state).toBe(false);
      });

      test("set ready no lobby", () => {
        let lobbies = {
            "ABCD": {
              "player1": { ready_state: false },
              "player2": { ready_state: true }
            }
        };
        //setting player 1 to ready
        let result = set_player_ready("not here", lobbies);
        expect(result.status).toBe(400);
        expect(result.message).toBe("Player not found in any lobby");
      });

      test("get lobby by player", () => {
        let lobbies = {
            "ABCD": {
              "player1": { ready_state: false },
              "player2": { ready_state: true }
            },
            "WXYZ": {
                "player3": { ready_state: false },
                "player4": { ready_state: true }
            }
        };

        let result = get_lobby_by_player("player3", lobbies);
        expect(result).toBe("WXYZ");
      });

      test("get lobby by player not found", () => {
        let lobbies = {
            "ABCD": {
              "player1": { ready_state: false },
              "player2": { ready_state: true }
            },
            "WXYZ": {
                "player3": { ready_state: false },
                "player4": { ready_state: true }
            }
        };

        let result = get_lobby_by_player("player5", lobbies);
        expect(result).toBeUndefined();
      });

      test("get username", () => {
        let lobbies = {
          "ABCD": {
            "player1": { username: "p1", ready_state: false },
            "player2": { ready_state: true }
          },
          "WXYZ": {
              "player3": { ready_state: false },
              "player4": { ready_state: true }
          }
        };

        let result = get_username("player1", lobbies);
        expect(result).toBe("p1");
      });

      test("get username player not found", () => {
        let lobbies = {
          "ABCD": {
            "player1": { username: "p1", ready_state: false },
            "player2": { ready_state: true }
          },
          "WXYZ": {
              "player3": { ready_state: false },
              "player4": { ready_state: true }
          }
        };

        let result = get_username("player5", lobbies);
        expect(result).toBeUndefined();
      });

      test("lobby closes when last user leaves", () => {
        let lobbies = {
          "ABCD": {
            "player1": { username: "p1", ready_state: false },
          }
        };

        let result = leave_lobby("player1", lobbies);
        expect(result.status).toBe(200);

        expect(lobbies["ABCD"]).toBeUndefined();
      });

      test("lobby does not close when there are users", () => {
        let lobbies = {
          "ABCD": {
            "player1": { username: "p1", ready_state: false },
            "player2": { ready_state: true }
          }
        };

        let result = leave_lobby("player1", lobbies);
        expect(result.status).toBe(200);

        expect(lobbies["ABCD"]).toBeDefined();
      });

      test("reset ready players", () => {
        let lobbies = {
            "ABCD": {
              "player1": { ready_state: false },
              "player2": { ready_state: true }
            }
          };
          
          reset_ready_players("ABCD", lobbies);

          expect(lobbies["ABCD"]["player2"].ready_state).toBe(false);
          expect(lobbies["ABCD"]["player1"].ready_state).toBe(false);
      });
});
