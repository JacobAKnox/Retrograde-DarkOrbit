import { useState } from 'react';

export default function PointsSet() {
  const [pointsVal, setPointsVal] = useState(0);

  return (
    <div className="flex rounded-xl m-1">
      <div className="flex p-1 rounded-l-xl bg-slate-900 min-w-8 justify-center hover:bg-slate-800 hover:cursor-pointer select-none text-2xl" onClick={() => setPointsVal(pointsVal-1)}>
        -
      </div>
      <div className="flex bg-slate-900 p-1 min-w-12 justify-center select-none text-2xl">
        { pointsVal }
      </div>
      <div className="flex p-1 rounded-r-xl bg-slate-900 min-w-8 justify-center hover:bg-slate-800 hover:cursor-pointer select-none text-2xl" onClick={() => setPointsVal(pointsVal+1)}>
        +
      </div>
    </div>
  )
}
