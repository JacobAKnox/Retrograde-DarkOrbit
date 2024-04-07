import PointsSet from "./points_set"
import { useState } from "react";

export default function PoiBox({ displayText = "Description of POI" }) {
  const [text, setText] = useState(displayText);

  return (
    <div className="rounded-xl p-2 m-2 bg-slate-700 min-w-[250px] max-w-[250px] min-h-[125px]">
      <div className="flex justify-center p-2 text-xl max-w-[225px]">
        <p className="text-center text-wrap break-words min-h-[28px] max-w-[200px]">{displayText}</p>
      </div>
      <div className="flex justify-center p-2">
        <PointsSet/>
      </div>
    </div>
  )
}
