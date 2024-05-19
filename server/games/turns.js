import { PHASE_STATES, PHASE_TIMINGS, PLAYER_INITIAL_POIS } from "./game_globals.js"
import { get_game, get_status_bars, set_status_bar_value, get_status_bar_value, get_player_POIs, set_player_POIs, process_turn, delete_game, automatic_status_bar_updates, shuffle_pois, set_new_pois} from "./game.js";

let timer_update_callback = (phase, time, start, lobbyCode) => {};

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
            // Send POIs from here
            const SELECTED_POIs = shuffle_pois();
            ids_and_names_callback(SELECTED_POIs, lobby_code)
            set_new_pois(game, SELECTED_POIs);
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
            process_turn(lobby_code);
            automatic_status_bar_updates(lobby_code);

            // check for winners if any global win condition is met 
            const global_winners = get_winners_from_global_win_conditions(game);
            if(global_winners.team.length != 0) {
              game.currentState = PHASE_STATES.GAME_OVER_PHASE;
              winners_update_callback(lobby_code, global_winners);
            }
            else {
              // check for winners if any role specific win conditions have been met
              const role_winners = get_winners_from_role_win_conditions(game);
              if(role_winners.team.length != 0) {
                game.currentState = PHASE_STATES.GAME_OVER_PHASE;
                winners_update_callback(lobby_code, role_winners);
              }
              else {
                game.currentState = PHASE_STATES.INFORMATION_PHASE;
              }
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
    timer_update_callback(phase, time, Date.now(), lobbyCode);
    return phase;
}

export async function gameLoop(lobbyCode){
    //Gameloop - execute turns
    //define game
    let game = get_game(lobbyCode);
    let run = false;
    //Run game loop and pass in game object
    while (game.currentState !== PHASE_STATES.GAME_OVER_PHASE || !run){
        await execute_turn(game, lobbyCode);
        run = true;
    }
    //handle a win
    updateClientsPhase(PHASE_STATES.GAME_OVER_PHASE, PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH, lobbyCode);
    // get winners and conditions
    // send winners and conditions to client
    await sleep_function(PHASE_TIMINGS.GAME_OVER_PHASE_LENGTH);
    delete_game(lobbyCode);
}

// Get winning players based on if their role win conditions are met
// Returns a bag {team: str, names: [str]}
// NOTE: "team" will have the group_name of the first determined winning player.
export function get_winners_from_role_win_conditions(game) {
  const status_bars = game.statusBars;
  const players = game.players;
  let winners = {team: "", names: [] };
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
      if(winners.team === "") {
        winners.team = player.role.group_name;
      }
      winners.names.push(player.username);
    }
  }
  return winners;
}

// Get winning players based on if any global win conditions have been met.
// Global win conditions are checked in a specific order so if more than one global condition is met,
//   only the first checked condition and winning team are the resulting winners.
// Returns a bag {team: str, names: [str]}
export function get_winners_from_global_win_conditions(game) {
  let winners = {team: "", names: [] };

  // Check if crew status bar is 0
  if(game.statusBars.crew.value == 0) {
    for(const [key, player] of Object.entries(game.players)) {
      if(player.role.win_group == "evil") {
        if(winners.team == "") {
          winners.team = player.role.group_name;
        }
        winners.names.push(player.username);
      }
    }
  }

  //
  // ADD OTHER GLOBAL WIN CHECKS TO THIS FUNCTION
  //

  return winners;
}
