import { useState, useEffect } from "react"
import PoiBox from "./poi_box"
import { update_role_info } from "../server/socket";

export default function POIPanel() {
    const [POIs, setPOIs] = useState({
        "1": {name: "name", allocated: 0},
        "2": {name: "name1", allocated: 0},
        "3": {name: "name2", allocated: 0}
    });

    const [availablePoints, setAvailablePoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        update_role_info(on_role_update);
    });

    function on_role_update(_name, max_points) {
        setTotalPoints(max_points);
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
                        return (<PoiBox key={p} displayText={POIs[p].name} update_callback={point_update} id={p}/>)
                    })
                }
            </div>
        </div>
    )
}