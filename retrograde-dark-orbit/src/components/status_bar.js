import { use, useState } from "react";

function clamp(value) {
    return Math.min(Math.max(value, 0), 99);
}

export default function StatusBar({value=0, low=20, high=60, show_percent=false}) {
    return (
    <div className="bg-slate-200 relative rounded-xl text-black text-center border-slate-600 border-solid border-2 h-6 content-center overflow-clip">
        <div style={{left: `${low}%`, width: `${(high-low)}%`}} className="bg-green-700 h-5 absolute bottom-0"></div>
        <div style={{left: `${(clamp(value))}%`}} className="bg-slate-700 h-5 w-1 absolute bottom-0"></div>
        { show_percent &&
        <div className="text-black text-center z-50 relative">
            {`${value}%`}
        </div>
        }
    </div>
    );
}