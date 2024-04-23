import { useState } from 'react';

export default function PointsSet({update_callback, id, points = 0}) {
  function update_point_value(amount) {
    if (amount + points < 0) { return; }
    update_callback(id, amount + points, points);
  }

  return (
    <div className="flex rounded-xl m-1">
      <div className="flex p-1 rounded-l-xl bg-slate-900 min-w-8 justify-center hover:bg-slate-800 hover:cursor-pointer select-none text-2xl" onClick={() => update_point_value(-1)}>
        -
      </div>
      <div className="flex bg-slate-900 p-1 min-w-12 justify-center select-none text-2xl">
        { points }
      </div>
      <div className="flex p-1 rounded-r-xl bg-slate-900 min-w-8 justify-center hover:bg-slate-800 hover:cursor-pointer select-none text-2xl" onClick={() => update_point_value(1)}>
        +
      </div>
    </div>
  )
}
