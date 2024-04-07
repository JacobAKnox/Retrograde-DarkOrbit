import PointsSet from "./points_set"
import { useState } from "react";

export default function PoiBox({ displayText = "Description of POI" }) {
  const [text, setText] = useState(displayText);

  return (
    <div className="rounded-xl p-2 m-2 bg-slate-700">
      <div className="flex justify-center p-2 text-xl">
        <p className="text-center text-wrap break-words">{displayText}</p>
      </div>
      <div className="flex justify-center p-2">
        <PointsSet/>
      </div>
    </div>
  )
}
