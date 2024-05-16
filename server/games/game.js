import { fetch_roles } from "../database/database.js";
import { get_num_players, reset_ready_players } from "../lobbies/lobbies.js";
import { PER_PLAYER_POWER_INCREASE, PHASE_STATES, PLAYER_INITIAL_POIS, GAME_GLOBALS ,default_role_info, get_new_status_bars, LIFE_SUPPORT_DECREASE_MULTIPLIER} from "./game_globals.js";

export let games = {};

export let roles = default_role_info;
export const roles_by_player_count = ["crew", "rebel", "crew", "crew", "crew", "crew", "crew", "rebel", "crew", "crew", "crew", "rebel", "crew", "crew", "crew", "rebel"];

export async function setup() {
    roles = await fetch_roles() || default_role_info;
}

export function start_game(lobby, lobby_code, game_list=games) {
    if (lobby_code in game_list) {
        return {status: 400, message: `Game with code '${lobby_code}' already exists`};
    }

    reset_ready_players(lobby_code);

    game_list[lobby_code] = {};
    game_list[lobby_code].players = JSON.parse(JSON.stringify(lobby)); // deep coppy lobby object;
    game_list[lobby_code].currentState = PHASE_STATES.GAME_SETUP_PHASE;
    game_list[lobby_code].lobbyCode = lobby_code;
    game_list[lobby_code].statusBars = get_new_status_bars();

    return {status: 200};
}

export function delete_game(game_code, game_list=games) {
    if (!game_list[game_code]) {
        return
    }

    delete game_list[game_code];
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
        let role = game.players[userID].role;
        if (role === undefined) {
            return {name: "Error Role", points: 0};
        }
        return role;
    } catch (error) {
        console.error(error);
        return {name: "Error Role", points: 0};
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

  export function automatic_status_bar_updates(lobbyCode, game_list=games) {
    const status_bars = get_status_bars(lobbyCode, game_list);
    if (!status_bars) {
        return;
    }

    if (status_bars.power) {
        const player_count = get_num_players(lobbyCode);
        status_bars.power.value += PER_PLAYER_POWER_INCREASE * player_count;
        status_bars.power.value = Math.min(status_bars.power.value, 100);
    }

    if (status_bars.life_support && status_bars.life_support.value === 0) {
        status_bars.crew.value = Math.max(0, status_bars.crew.value - GAME_GLOBALS.CREW_DECREASE_RATE);
    }

    // life support decreases each turn proportionally to the number of crew
    if(status_bars.life_support && status_bars.crew && status_bars.life_support.value > 0 && status_bars.crew.value > 0) {
      status_bars.life_support.value -= Math.ceil(status_bars.crew.value * LIFE_SUPPORT_DECREASE_MULTIPLIER);
    }
}



export function process_turn(lobbyCode, game_list=games) {
  // Get status bars
  // Get game and players
  const game = get_game(lobbyCode, game_list);
  if (!game) {
    return {status: 400, message: `error: game not found`};
  }
  const players = game.players; 
  // For each player in the game
  for (let player_id in players) {
      // Get name and points allocated
      const pois = players[player_id].pois;
    for (let poi_id in pois) {
      let statusBars = get_status_bars(lobbyCode, game_list);
      const poi_points_allocated = pois[poi_id].allocated;
      // Update status bars according to point allocations
      let val = get_status_bar_value(lobbyCode, "crew", game_list);
      let mult = PLAYER_INITIAL_POIS[poi_id].crew;
      let new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "crew", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "crew", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "crew", new_val, game_list);
      }
      
      val = get_status_bar_value(lobbyCode, "ship_health", game_list);
      mult = PLAYER_INITIAL_POIS[poi_id].ship_health;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "ship_health", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "ship_health", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "ship_health", new_val, game_list);
      }

      val = get_status_bar_value(lobbyCode, "fuel", game_list);
      mult = PLAYER_INITIAL_POIS[poi_id].fuel;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "fuel", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "fuel", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "fuel", new_val, game_list);
      }

      val = get_status_bar_value(lobbyCode, "life_support", game_list);
      mult = PLAYER_INITIAL_POIS[poi_id].life_support;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "life_support", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "life_support", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "life_support", new_val, game_list);
      }

      val = get_status_bar_value(lobbyCode, "power", game_list);
      mult = PLAYER_INITIAL_POIS[poi_id].power;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "power", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "power", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "power", new_val, game_list);
      }
    }
  }
}
