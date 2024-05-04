import { listen_winner_info } from "../server/socket";
import { getItem, storeItem } from "../server/storage";
import { useEffect, useState } from "react";

export default function WinnerPanel({team="Team", names=["name1", "name2"]}) {
    const [teamName, setTeamName] = useState(team);
    const [namesList, setNamesList] = useState(names);

    useEffect(() => {
        listen_winner_info(handle_winner);
        const winner = getItem("winner");
        console.log(winner);
        if (winner) {
            setTeamName(winner.team);
            setNamesList(winner.names);
        }
    }, [])

    function handle_winner(data) {
        storeItem("winner", data);
        setTeamName(data.team);
        setNamesList(data.names);
    }

    return (
        <div className="text-center bg-slate-900 p-3 rounded-xl w-full m-1">
            <h1 className="text-2xl text-red-300">
                <b>
                    {teamName} Wins!
                </b>
            </h1>
            <br/>
            <div className="text-xl text-red-100">
                Players:
                <br/>
                <div className="grid grid-cols-5 text-lg text-white">
                {
                    namesList.map((name) => {
                        return <div className="p-2" key={name}> {name} </div>;
                    })
                }
                </div>
            </div>
        </div>
    );
}