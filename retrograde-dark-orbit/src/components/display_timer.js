import TurnTimer from "./turn_timer"
export default function DisplayTimer(){

    return(
        <div className="bg-slate-900 text-xl text-white m-1 py-2 px-10 rounded-xl disabled:bg-slate-950 disabled:text-gray-700">
            <TurnTimer/>
        </div>
    )
}