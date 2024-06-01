import PointsSet from "./points_set"
import { useState } from "react";

export default function PoiBox({ displayText = "Description of POI", explaination = "", update_callback, id, points}) {
  return (
    <div className="rounded-xl p-2 m-2 bg-slate-700">
      <div className="flex justify-center p-2 text-xl">
        <p className="text-center text-wrap break-words">{displayText}</p>
      </div>
      <div className="flex justify-center p-2">
        <PointsSet update_callback={update_callback} id={id} points={points}/>
      </div>
      <div className="flex justify-center p-1 text-md">
        <p className="text-center text-wrap break-words">{explaination}</p>
      </div>
    </div>
  )
}
