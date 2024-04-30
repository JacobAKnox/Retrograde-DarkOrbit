export default function WinnerPanel({team="Team", names=["name1", "name2"]}) {

    return (
        <div className="text-center bg-slate-900 p-3 rounded-xl w-full m-1">
            <h1 className="text-2xl text-red-300">
                <b>
                    {team} Wins!
                </b>
            </h1>
            <br/>
            <div className="text-xl text-red-100">
                Players:
                <br/>
                <div className="grid grid-cols-5 text-lg text-white">
                {
                    names.map((name) => {
                        return <div className="p-2" key={name}> {name} </div>;
                    })
                }
                </div>
            </div>
        </div>
    );
}