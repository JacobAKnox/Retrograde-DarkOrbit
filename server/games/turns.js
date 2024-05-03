import { PHASE_STATES, PHASE_TIMINGS, PLAYER_INITIAL_POIS } from "./game_globals.js"
import { get_game, 
        get_status_bars,
        set_status_bar_value,
        get_status_bar_value,
        get_player_POIs, 
        set_player_POIs,
        games } from "./game.js";

let timer_update_callback = () => {};
let ids_and_names_callback = (IDSANDNAMES, lobbyCode) => {};

export function set_timer_update_callback(cb) {
    timer_update_callback = cb;
}

export function set_ids_and_names_callback(cb) {
    ids_and_names_callback = cb;
}

let status_bar_update_callback = (lobbyCode, status_bars) => {};

export function set_status_bar_update(cb) {
    status_bar_update_callback = cb;
}

let winners_update_callback = (lobbyCode, winners) => {};

export function winners_update(cb) {
  winners_update_callback = cb;
}

// used as a timer that does not block other code execution from happening
export const sleep_function = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


export async function execute_turn(game, lobby_code, sleep=sleep_function) {
    switch(game.currentState) {

        case PHASE_STATES.GAME_SETUP_PHASE:
            // call setupNewGame function?
            game.currentState = PHASE_STATES.INFORMATION_PHASE;
            await sleep(1000); // give clients a chance to load the page
            break;

        case PHASE_STATES.INFORMATION_PHASE:

            updateClientsPhase(PHASE_STATES.INFORMATION_PHASE, PHASE_TIMINGS.INFORMATION_PHASE_LENGTH, lobby_code);
            //Send Ids and Names here
            ids_and_names_callback(PLAYER_INITIAL_POIS, lobby_code)
            status_bar_update_callback(lobby_code, get_status_bars(lobby_code));
        
            // add function to send client the data for information phase here
            await sleep(PHASE_TIMINGS.INFORMATION_PHASE_LENGTH);
            game.currentState = PHASE_STATES.DISCUSSION_PHASE;
            break;

        case PHASE_STATES.DISCUSSION_PHASE:
            updateClientsPhase(PHASE_STATES.DISCUSSION_PHASE, PHASE_TIMINGS.DISCUSSION_PHASE_LENGTH, lobby_code);
            // add function to enable client chat here
            await sleep(PHASE_TIMINGS.DISCUSSION_PHASE_LENGTH);
            game.currentState = PHASE_STATES.ACTION_PHASE;
            break;

        case PHASE_STATES.ACTION_PHASE:
            updateClientsPhase(PHASE_STATES.ACTION_PHASE, PHASE_TIMINGS.ACTION_PHASE_LENGTH, lobby_code);
            // add function to disable client chat here
            await sleep(PHASE_TIMINGS.ACTION_PHASE_LENGTH);
            game.currentState = PHASE_STATES.SERVER_PROCESSING_PHASE;
            break;

        case PHASE_STATES.SERVER_PROCESSING_PHASE:
            process_turns(lobby_code);
            const winners = get_winners(game);
            if(Object.keys(winners).length > 0) {
              game.currentState = PHASE_STATES.GAME_OVER_PHASE;
              // send winners to client
              winners_update_callback(lobby_code, winners);
            }
            else {
              game.currentState = PHASE_STATES.INFORMATION_PHASE;
            }
            break;
          
        case PHASE_STATES.GAME_OVER_PHASE:
          //handle a win
          updateClientsPhase(PHASE_STATES.GAME_OVER_PHASE, PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH, lobby_code);
          // get winners and conditions
          // send winners and conditions to client
          await sleep(PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH);
          break;
    }
}

export function updateClientsPhase(phase, time, lobbyCode) {
    // send phase to client
    // call Update Timer 
    timer_update_callback(phase, time, lobbyCode);
    return phase;
}

export async function gameLoop(lobbyCode){
    //Gameloop - execute turns
    //define game
    let game = get_game(lobbyCode);
    //Run game loop and pass in game object
    while (true){
        await execute_turn(game, lobbyCode);
    }
}

export function process_turns(lobbyCode) {
  // Get status bars
  const statusBars = get_status_bars(lobbyCode);
  // Get game and players
  const game = get_game(lobbyCode);
  const players = game.players; 
  // For each player in the game
  for (let player_id in players) {
    // Get their POIs
    const pois = get_player_POIs(game, player_id);
    // For each POI
    for (let poi_id in pois) {
      // Get name and points allocated
      const poi_name = pois[poi_id].name;
      const poi_points_allocated = pois[poi_id].allocated;
      const delta = poi_points_allocated*2;
      // Update status bars according to point allocations
      if (poi_name == "name") {
        const val = get_status_bar_value(lobbyCode, "crew");
        set_status_bar_value(lobbyCode, "crew", val+delta);
      }
      else if (poi_name == "name1") {
        const val = get_status_bar_value(lobbyCode, "ship_health");
        set_status_bar_value(lobbyCode, "ship_health", val+delta);
      }
      else if (poi_name == "name2") {
        const val = get_status_bar_value(lobbyCode, "fuel");
        set_status_bar_value(lobbyCode, "fuel", val+delta);
      }
    }
  }
}

// Get winning players.
// Returns a bag of players with usernames whose win conditions have been met.
// Returns empty bag if no winners.
export function get_winners(game) {
  const status_bars = game.statusBars;
  const players = game.players;
  let winners = {};
  // for each player...
  for(const [key, player] of Object.entries(players)) {
    let all_win_conditions_met = true;
    // for each win condition within the "win condition" object for that player...
    for(let win_condition in player.role.win_condition) {
      let bar_id = win_condition;
      // check each status bar win condition against the current game status bar values
      if(!(status_bars[bar_id].value >= player.role.win_condition[bar_id].min &&
          status_bars[bar_id].value <= player.role.win_condition[bar_id].max)) {
            all_win_conditions_met = false;
            break;
      }
    }
    if(all_win_conditions_met) {
      winners[key] = player.username;
    }
  }
  return winners;
}