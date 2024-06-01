import React, { useEffect, useState } from 'react';
import { listen_status_bar_update, update_role_info } from '../server/socket';
import StatusBar from './status_bar';

export default function InformationBar() {
    const [gameStatus, setGameStatus] = useState({
      "crew": {name: "Crew", value: 50, max_value: 100},
      "ship_health": {name: "Ship Health", value: 50, max_value: 100},
      "fuel": {name: "Fuel", value: 50, max_value: 100},
      "life_support": {name: "Life Support", value: 50, max_value: 100},
      "power": {name: "Power", value: 50, max_value: 100}
    });

    const [winCon, setWinCon] = useState({
            "crew": {
              "min": 5,
              "max": 100
            },
            "ship_health": {
              "min": 20,
              "max": 100
            },
            "fuel": {
              "min": 80,
              "max": 100
            },
            "life_support": {
              "min": 50,
              "max": 100
            },
            "power": {
              "min": 30,
              "max": 100
            }
          });

    useEffect(() => {
       const old_status = listen_status_bar_update(setGameStatus);
       if (old_status) {
            setGameStatus(old_status);
       }
       on_role_update(update_role_info(on_role_update));
    }, []);

    function on_role_update(role) {
        if (!role || !role.win_condition) {return;}
        console.log(role);
        setWinCon(role.win_condition);
    }

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
                <label>Crew: <StatusBar value={gameStatus.crew.value} low={winCon.crew.min} high={winCon.crew.max} aria-label="Crew"/> </label>
                <label>Ship Health: <StatusBar value={gameStatus.ship_health.value} low={winCon.ship_health.min} high={winCon.ship_health.max} aria-label="Ship Health"/></label>
                <label>Fuel: <StatusBar value={gameStatus.fuel.value} low={winCon.fuel.min} high={winCon.fuel.max} aria-label="Fuel"/></label>
                <label>Life Support: <StatusBar value={gameStatus.life_support.value} low={winCon.life_support.min} high={winCon.life_support.max} aria-label="Life Support"/></label>
                <label>Power: <StatusBar value={gameStatus.power.value} low={winCon.power.min} high={winCon.power.max} aria-label="Power"/></label>
            </div>
        </>
    );
}
