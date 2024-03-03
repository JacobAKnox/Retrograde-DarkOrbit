import { fetch_roles } from "../database/database.js";

let games = {};

export let roles = {"test1": {name: "test_role1", id: "test1"}, "test2": {name: "test_role2", id: "test2"}};
export const roles_by_player_count = ["test1", "test2", "test1", "test1", "test1", "test1", "test1", "test2","test1", "test1", "test1", "test2","test1", "test1", "test1", "test2"];

export async function setup() {
    roles = await fetch_roles();
}

export function start_game(lobby, lobby_code, game_list=games) {
    if (lobby_code in game_list) {
        return {status: 400, message: `Game with code '${lobby_code}' already exists`};
    }

    game_list[lobby_code] = {};
    game_list[lobby_code].players = JSON.parse(JSON.stringify(lobby)); // deep coppy lobby object;

    return {status: 200};
}

export function get_game(game_code) {
    return games[game_code];
}

export function assign_roles(game, role_list = roles, role_players = roles_by_player_count) {
    const player_count =  Object.keys(game.players).length;
    let roles_in_game = role_players.slice(0, player_count);
    roles_in_game = shuffle(roles_in_game);

    Object.keys(game.players).forEach((p, i) => {
        game.players[p].role = role_list[roles_in_game[i]];
    });
}

export function get_role_info(game, userID) {
    try {
        return game.players[userID].role.name;
    } catch (error) {
        return "error could not get role";
    }
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }