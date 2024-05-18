export const PHASE_STATES = Object.freeze({
    GAME_SETUP_PHASE: "Game setup",
    SERVER_PROCESSING_PHASE: "Server processing",
    INFORMATION_PHASE: "Information phase",
    DISCUSSION_PHASE: "Discussion phase",
    ACTION_PHASE: "Action phase",
    GAME_OVER_PHASE: "Game Over"
})

// time in milliseconds
export const PHASE_TIMINGS = Object.freeze({
    INFORMATION_PHASE_LENGTH: 20000,
    DISCUSSION_PHASE_LENGTH: 60000,
    ACTION_PHASE_LENGTH: 20000,
    GAME_OVER_PHASE_LENGTH: 150000
})

// access should probably be wrapped in a function call
// given to each player at beginning of every action phase
export const PLAYER_INITIAL_POIS = Object.freeze({
    '1': { name: 'Crew', allocated: 0, crew: 2, ship_health: 0, fuel: 0, life_support: 0, power: 0 },
    '2': { name: 'Health', allocated: 0, crew: 0, ship_health: 2, fuel: 0, life_support: 0, power: 0 },
    '3': { name: 'Fuel', allocated: 0, crew: 0, ship_health: 0, fuel: 2, life_support: 0, power: 0 },
    "4": {  name: "Life", allocated: 0, crew: 0, ship_health: 0, fuel: 0, life_support: 2, power: 0 },
    "5": {  name: "Power", allocated: 0, crew: 0, ship_health: 0, fuel: 0, life_support: 0, power: 2 }
})

export function get_new_status_bars() {
    return structuredClone(STATUS_BAR_TEMPLATE);
}

const STATUS_BAR_TEMPLATE = Object.freeze({
    "crew": {name: "Crew", value: 50, max_value: 100},
    "ship_health": {name: "Ship Health", value: 50, max_value: 100},
    "fuel": {name: "Fuel", value: 50, max_value: 100},
    "life_support": {name: "Life Support", value: 50, max_value: 100},
    "power": {name: "Power", value: 50, max_value: 100}
});

export const default_role_info = Object.freeze({
    crew: {
        "name": "Crew Member",
        "id": "crew",
        "points": 10,
        "win_group": "good",
        "group_name": "Ship Crew",
        "win_text": "Temp Text",
        "win_condition": {
            "crew": {"min": 5, "max": 100},
            "ship_health": {"min": 20, "max": 100},
            "fuel": {"min": 80, "max": 100},
            "life_support": {"min": 50, "max": 100},
            "power": {"min": 30, "max": 100}
        }
    },
    rebel:  {
        "name": "Rebel Leader",
        "id": "rebel",
        "points": 10,
        "win_group": "evil",
        "group_name": "Rebels",
        "win_text": "Get Fuel above 90%",
        "win_condition": {
            "crew": {"min": 0, "max": 100},
            "ship_health": {"min": 0, "max": 100},
            "fuel": {"min": 90, "max": 100},
            "life_support": {"min": 0, "max": 100},
            "power": {"min": 0, "max": 100}
        }
    }
});

export const PER_PLAYER_POWER_INCREASE = 5;

// this can be a float and won't break anything
export const LIFE_SUPPORT_DECREASE_MULTIPLIER = 1;

export const CREW_DECREASE_RATE = 1;