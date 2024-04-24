import { useState, useEffect } from "react"
import PoiBox from "./poi_box"
import { update_role_info, send_poi_update, server_sent_poi_listener } from "../server/socket";

export default function POIPanel() {
    const [POIs, setPOIs] = useState({
      "1": {name: "name", allocated: 0},
      "2": {name: "name1", allocated: 0},
      "3": {name: "name2", allocated: 0}
    });

    const [availablePoints, setAvailablePoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    let timerId = 0;

    server_sent_poi_listener(update_POIs_from_server);

    useEffect(() => {
        update_role_info(on_role_update);
        update_available();

        // The block of code below needs to run only during the action phase.
        // Use the function "clearInterval(timerId)" when you need to stop the interval from running.
        clearInterval(timerId);
        timerId = setInterval(() => {
            send_poi_update(POIs).then((res) => {
                if(res.status === 200) {
                    // ok
                }
                else {
                    console.log("ERROR " + res.status + ": " + res.message);
                }
            })
        }, 1000);
    }, []);

    function update_POIs_from_server(new_pois) {
        setPOIs(new_pois);
        update_available();
    }

    function on_role_update(role) {
        setTotalPoints(role.points);
    }

    function can_increase(amount = 1) {
        return availablePoints + amount <= totalPoints;
    }

    function update_available() {
        const total = Object.keys(POIs).reduce((acc, poi_id) => {
            return acc + POIs[poi_id].allocated;
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
        let pois = POIs;
        pois[POI_id].allocated = new_value;
        setPOIs(pois);
        update_available();
        return new_value;
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
