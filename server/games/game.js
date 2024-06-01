import { fetch_roles, fetch_pois } from "../database/database.js";
import { get_num_players, reset_ready_players } from "../lobbies/lobbies.js";
import { PER_PLAYER_POWER_INCREASE, PHASE_STATES, PLAYER_INITIAL_POIS, default_role_info, get_new_status_bars, LIFE_SUPPORT_DECREASE_MULTIPLIER, CREW_DECREASE_RATE} from "./game_globals.js";


export let games = {};

export let roles = default_role_info;
export let pois = PLAYER_INITIAL_POIS;
export const roles_by_player_count = ["good", "e_leader", "good", "good", "good", "good", "good", "e_minion", "good", "good", "good", "e_minion", "good", "good", "good", "e_minion"];

export async function setup() {
    roles = await fetch_roles() || default_role_info;
    pois = await fetch_pois() || PLAYER_INITIAL_POIS;
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
    game_list[lobby_code].pois = PLAYER_INITIAL_POIS;

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
  // copy roles, split by tag
  const good = Object.keys(role_list).filter((r) => {return role_list[r].type === "good"});
  const evil_leaders = Object.keys(role_list).filter((r) => {return role_list[r].type === "e_leader"});
  const evil_minions = Object.keys(role_list).filter((r) => {return role_list[r].type === "e_minion"});
  // pick tags in play
  let roles_in_game = role_players.slice(0, player_count);
  // shuffle tags
  roles_in_game = shuffle(roles_in_game);
  // assign each role, keep track of minions
  let minions = [];
  let leader;
  Object.keys(game.players).forEach((p, i) => {
    let roles;
    switch (roles_in_game[i]) {
      case "good":
        roles = good;
        break;
      case "e_leader":
        // when leader shows up, note the player
        roles = evil_leaders;
        leader = game.players[p];
        break;
      case "e_minion":
        // note the minions
        roles = evil_minions;
        minions.push(game.players[p]);
        break;
    }
    const role = roles.splice(Math.floor(Math.random() * roles.length), 1)[0]
    game.players[p].role = role_list[role];
    set_player_POIs(game, p, PLAYER_INITIAL_POIS);
  });

  // at the end give minions group name and stuff
  minions.forEach((m) => {
    m.role.win_text = leader.role.win_text;
    m.role.group_name = leader.role.group_name;
    m.role.win_condition = leader.role.win_condition;
  });
}

export function set_new_pois(game, pois) 
{
  game.pois = pois;
  Object.keys(game.players).forEach((p) => {
    set_player_POIs(game, p, pois);
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
  
    const game_pois = game.pois || PLAYER_INITIAL_POIS;
    
    for(const [key, value] of Object.entries(POIs)) {
        if(value.allocated < 0) {
            return false; 
        }
        else {
            pointTotal += value.allocated;
        }
        if (!(key in Object.keys(game_pois))) {
          return false;
        }
    }

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
    else { return game.pois; }
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

  export function shuffle_pois(){

    const data = Object.values(pois);
    
    //Grab by ID
    const requiredPOIs = [6, 7, 8];
    const filteredPOIs = data.filter(item => requiredPOIs.includes(item.id));

    const remainingPOIs = data.filter(item => !requiredPOIs.includes(item.id));

    // Randomly select 3 additional POIs from the remaining ones
    const randomPOIs = [];
    while (randomPOIs.length < 3 && remainingPOIs.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingPOIs.length);
      randomPOIs.push(remainingPOIs.splice(randomIndex, 1)[0]);
    }

    // Combine required POIs with randomly selected POIs
    const selectedPOIs = [...filteredPOIs, ...randomPOIs];

    return selectedPOIs;
    
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
        status_bars.crew.value = Math.max(0, status_bars.crew.value - CREW_DECREASE_RATE);
    }

    // life support decreases each turn proportionally to the number of crew
    if(status_bars.life_support && status_bars.crew && status_bars.life_support.value > 0 && status_bars.crew.value > 0) {
      status_bars.life_support.value -= Math.ceil(status_bars.crew.value * LIFE_SUPPORT_DECREASE_MULTIPLIER);
    }
}

export function process_turn(lobbyCode, game_list=games) {
  // Get status bars
  // Get game and players
  const game = get_game(lobbyCode, game_list) || {};
  const pois = game.pois || PLAYER_INITIAL_POIS;
  if (!game) {
    return {status: 400, message: `error: game not found`};
  }
  const players = game.players; 

  // For each player in the game
  for (let player_id in players) {
      // Get name and points allocated
      const player_pois = players[player_id].pois;
    for (let poi_id in player_pois) {
      let statusBars = get_status_bars(lobbyCode, game_list);
      const poi_points_allocated = player_pois[poi_id].allocated;
      // Update status bars according to point allocations
      let val = get_status_bar_value(lobbyCode, "crew", game_list);
      let mult = pois[poi_id].crew;
      let new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "crew", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "crew", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "crew", new_val, game_list);
      }
      
      val = get_status_bar_value(lobbyCode, "ship_health", game_list);
      mult = pois[poi_id].ship_health;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "ship_health", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "ship_health", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "ship_health", new_val, game_list);
      }

      val = get_status_bar_value(lobbyCode, "fuel", game_list);
      mult = pois[poi_id].fuel;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "fuel", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "fuel", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "fuel", new_val, game_list);
      }

      val = get_status_bar_value(lobbyCode, "life_support", game_list);
      mult = pois[poi_id].life_support;
      new_val = val+(poi_points_allocated*mult);
      if (new_val > 100) {
        set_status_bar_value(lobbyCode, "life_support", 100, game_list);
      } else if (new_val < 0) {
        set_status_bar_value(lobbyCode, "life_support", 0, game_list);
      } else {
        set_status_bar_value(lobbyCode, "life_support", new_val, game_list);
      }

      val = get_status_bar_value(lobbyCode, "power", game_list);
      mult = pois[poi_id].power;
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


export function takeStatusBarSnapshot(game_code, game_list = games) {
  const game = get_game(game_code, game_list);
  if (game) {
      game.statusBarSnapshot = structuredClone(game.statusBars);
  }
}

export function queueStatusBarChanges(game_code, game_list = games) {
  const game = get_game(game_code, game_list);
  if (game && game.statusBarSnapshot) {
      const messages = [];
      if (!game.messageQueue) {
          game.messageQueue = [];
      }
      for (const [key, value] of Object.entries(game.statusBars)) {
          const initial = game.statusBarSnapshot[key].value;
          const current = value.value;
          let percentageChange;
          if (initial === 0) {
              percentageChange = current === 0 ? 0 : 100; // Handle division by zero
          } else {
              percentageChange = ((current - initial) / initial) * 100;
          }
          const message = `${key} changed by ${percentageChange.toFixed(2)}%`;
          messages.push(message);
      }
      game.messageQueue.push(...messages);
  }
}

// Add a message (string) to the message queue on the game object.
// The message queue is an array.
export function addMessageToQueue(game_code, message, game_list = games) {
  const game = get_game(game_code, game_list);
  if(game) {
    if(!game.messageQueue) {
      game.messageQueue = [];
    }
    game.messageQueue.push(message);
  }
}

// Clear the message queue on the game object.
export function clearMessageQueue(game_code, game_list = games) {
  let game = get_game(game_code, game_list);
  if(game && game.messageQueue) {
    game.messageQueue = [];
  }
}