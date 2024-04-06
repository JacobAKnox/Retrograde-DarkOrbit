import { useState } from 'react';

export default function PointsToggle() {
  const [pointsVal, setPointsVal] = useState(0);

  return (
    <div className="flex rounded-xl m-1">
      <div className="p-1 rounded-l-xl bg-slate-900 hover:bg-slate-800 hover:cursor-pointer select-none" onClick={() => setPointsVal(pointsVal-1)}>
        -
      </div>
      <div className="flex rounded-r-xl bg-slate-900 hover:bg-slate-800 hover:cursor-pointer p-1 min-w-8 justify-center select-none" onClick={() => setPointsVal(pointsVal+1)}>
        { pointsVal }
      </div>
    </div>
  )
}
