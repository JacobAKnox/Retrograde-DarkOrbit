import { fetch_roles } from "../database/database.js";
import { PHASE_STATES, PLAYER_INITIAL_POIS, get_new_status_bars } from "./game_globals.js";

let games = {};

export let roles = {"test1": {name: "test_role1", id: "test1", points: 10}, "test2": {name: "test_role2", id: "test2", points: 10}};
export const roles_by_player_count = ["test1", "test2", "test1", "test1", "test1", "test1", "test1", "test2","test1", "test1", "test1", "test2","test1", "test1", "test1", "test2"];

export async function setup() {
    roles = await fetch_roles() || roles;
}

export function start_game(lobby, lobby_code, game_list=games) {
    if (lobby_code in game_list) {
        return {status: 400, message: `Game with code '${lobby_code}' already exists`};
    }

    game_list[lobby_code] = {};
    game_list[lobby_code].players = JSON.parse(JSON.stringify(lobby)); // deep coppy lobby object;
    game_list[lobby_code].currentState = PHASE_STATES.GAME_SETUP_PHASE;
    game_list[lobby_code].lobbyCode = lobby_code;
    game_list[lobby_code].statusBars = get_new_status_bars();

    return {status: 200};
}

export function get_game(game_code, game_list=games) {
    return game_list[game_code];
}

export function get_status_bars(game_code, game_list=games) {
    try {
        return get_game(game_code, game_list).statusBars;
    } catch (e) {
        return undefined;
    }
}

export function get_status_bar_value(game_code, bar_id, game_list=games) {
  return game_list[game_code].statusBars[bar_id].value;
}

export function set_status_bar_value(game_code, bar_id, val, game_list=games) {
  game_list[game_code].statusBars[bar_id].value = val;
}

export function assign_roles(game, role_list = roles, role_players = roles_by_player_count) {
    const player_count =  Object.keys(game.players).length;
    let roles_in_game = role_players.slice(0, player_count);
    roles_in_game = shuffle(roles_in_game);

    Object.keys(game.players).forEach((p, i) => {
        game.players[p].role = role_list[roles_in_game[i]];
        set_player_POIs(game, p, PLAYER_INITIAL_POIS);
    });
}

export function get_role_info(game, userID) {
    try {
        const role = game.players[userID].role;
        return {name: role.name, max_points: role.points}
    } catch (error) {
        console.error(error);
        return {name: "Error Role", max_points: 0};
    }
}

export function validate_received_user_poi_values(game, userID, POIs) {
    const totalPossiblePoints = game.players[userID].role.points;
    let pointTotal = 0;

    console.log("Total possible points: " + totalPossiblePoints);
    console.log(POIs);
    
    for(const [key, value] of Object.entries(POIs)) {
        if(value.allocated < 0) {
            return false; 
        }
        else {
            pointTotal += value.allocated;
        }
    }

    console.log("Accumulated point total:" + pointTotal);

    if(pointTotal > totalPossiblePoints) {
        return false;
    }
    else {
        return true;
    }
}

// This function assumes POIs are valid
export function set_player_POIs(game, userID, POIs) {
    game.players[userID].pois = POIs;
}

export function get_player_POIs(game, userID) {
    if(game.players[userID].pois) {
        return game.players[userID].pois;
    }
    else { return PLAYER_INITIAL_POIS; };
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
