export default function JoinPanel() {
    return (
        <div className="bg-inherit p-4 m-4 flex flex-col">
            <input className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl" placeholder={"Username"}/>
            <input className="bg-slate-700 text-white m-1 py-2 px-10 rounded-xl" placeholder={"Code"}/>
            <button className="bg-slate-900 text-white m-1 py-2 px-10 rounded-xl">
                Join
            </button>
        </div>
    )
}