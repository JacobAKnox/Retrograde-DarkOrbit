import React, { useEffect, useState } from 'react';
import { update_progress_bar_info }  from "../server/socket"; 

export default function InformationBar() {
    const [gameStatus, setGameStatus] = useState({
        crew: 0,
        health: 100,
        fuel: 100,
        lifeSupport: 100,
        power: 100
    });

    useEffect(() => {
        update_progress_bar_info(setGameStatus);
    }, []);

    return (
        <>
            <style>
                {`
                .information-bar {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    background: #151B30; 
                    padding: 15px;
                    border-radius: 8px;
                    color: #fff; 
                    margin: 10px 0;
                }

                .information-bar label {
                    font-size: 0.9rem;
                    color: #FFFFFF;
                }

                .information-bar progress {
                    width: 100%;
                    height: 20px;
                    border-radius: 10px;
                    color: #4caf50;
                    background-color: #4ade80;
                }
               
                .information-bar progress::-webkit-progress-value {
                    background-color: #4caf50;
                    border-radius: 10px;
                }
     
                .information-bar progress::-webkit-progress-bar {
                    background-color: #333;
                    border-radius: 10px;
                }
                `}
            </style>
            <div className="information-bar">
                <label>Crew: <progress value={gameStatus.crew} max="100" aria-label="Crew"></progress></label>
                <label>Ship Health: <progress value={gameStatus.health} max="100" aria-label="Ship Health"></progress></label>
                <label>Fuel: <progress value={gameStatus.fuel} max="100" aria-label="Fuel"></progress></label>
                <label>Life Support: <progress value={gameStatus.lifeSupport} max="100" aria-label="Life Support"></progress></label>
                <label>Power: <progress value={gameStatus.power} max="100" aria-label="Power"></progress></label>
            </div>
        </>
    );
}
