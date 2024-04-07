import { useState } from "react"
import PoiBox from "./poi_box"

export default function POIPanel() {
    let POIs = {
        "1": {name: "name", allocated: 0},
        "2": {name: "name1", allocated: 0},
        "3": {name: "name2", allocated: 0}
    }

    const [availablePoints, setAvailablePoints] = useState(5);
    const [totalPoints, setTotalPoints] = useState(10);

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
                        return (<PoiBox key={p} displayText={POIs[p].name}/>)
                    })
                }
            </div>
        </div>
    )
}