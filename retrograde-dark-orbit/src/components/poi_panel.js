import { useState, useEffect } from "react"
import PoiBox from "./poi_box"
import { update_role_info, send_poi_update, server_sent_poi_listener, set_turn_timer } from "../server/socket";
import { getItem, storeItem } from "./../server/storage";

let poi_list = {};

const default_poi = {
    "1": {name: "name", allocated: 0},
    "2": {name: "name1", allocated: 0},
    "3": {name: "name2", allocated: 0}
}

export default function POIPanel() {
    const [POIs, setPOIs] = useState(default_poi);

    const [availablePoints, setAvailablePoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    let timerId = 0;

    server_sent_poi_listener(update_POIs_from_server);

    function timerUpdate(phase) {
        if (phase.name === "Discussion phase" || phase.name === "Action phase") {
            start_poi_updates();
        } else {
            stop_poi_updates();
        }
    }

    function stop_poi_updates() {
        if (timerId == 0) {
            return;
        }
        clearInterval(timerId);
        timerId = 0;
    }

    function start_poi_updates() {
        // The block of code below needs to run only during the action phase.
        // Use the function "clearInterval(timerId)" when you need to stop the interval from running.
        clearInterval(timerId);
        timerId = setInterval(() => {
            send_poi_update(poi_list).then((res) => {
                if(res.status === 200) {
                    // ok
                }
                else {
                    console.log("ERROR " + res.status + ": " + res.message);
                }
            })
        }, 1000);
    }

    useEffect(() => {
        const old_info = update_role_info(on_role_update);
        if (old_info) {
            setTotalPoints(old_info.points);
        }
        const loaded_pois = loadPOIs();
        setPOIs(loaded_pois);
        update_available(loaded_pois);

        const old_timer = getItem("timer");
        if (old_timer) {
            timerUpdate(old_timer);
        }
        set_turn_timer(timerUpdate);
    }, []);

    function update_POIs_from_server(new_pois) {
        setPOIs(new_pois);
        storePOIs(new_pois);
        poi_list = new_pois;
        update_available(new_pois);
    }

    function on_role_update(role) {
        setTotalPoints(role.points);
    }

    function can_increase(amount = 1) {
        return availablePoints + amount <= totalPoints;
    }

    function update_available(pois=POIs) {
        const total = Object.keys(pois).reduce((acc, poi_id) => {
            return acc + pois[poi_id].allocated;
        }, 0);
        setAvailablePoints(total);
    }

    function point_update(POI_id, new_value, old_value) {
        if (!(POI_id in POIs)) {
            return old_value;
        }
        if (!can_increase(new_value - old_value)) {
            return old_value;
        }
        let pois = structuredClone(POIs);
        pois[POI_id].allocated = new_value;
        setPOIs(pois);
        storePOIs(pois);
        update_available();
        poi_list = pois;
        update_available(pois);
        return new_value;
    }

    function storePOIs(pois) {
        storeItem("POIs", pois);
    }

    function loadPOIs() {
        const data = getItem("POIs");
        return data ? data : default_poi;
    }

    return (
        <div className="text-xl text-white text-center items-center rounded-xl m-1 flex-grow">
            <div className="bg-slate-900 rounded-xl m-1 p-2">
                Action Points: 
                <br/>
                {availablePoints}/{totalPoints}
            </div>
            <div className="grid grid-cols-3 bg-slate-900 rounded-xl m-1 p-2">
                {
                    Object.keys(POIs).map((p) => {
                        return (<PoiBox key={p} displayText={POIs[p].name} update_callback={point_update} id={p} points={POIs[p].allocated}/>)
                    })
                }
            </div>
        </div>
    )
}
