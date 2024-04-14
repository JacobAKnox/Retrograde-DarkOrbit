import React from 'react';

const InformationBar = ({ gameState }) => {
    return (
      <div>
        <label>Crew: <progress value={gameState.crew} max="100" aria-label="Crew"></progress></label>
        <label>Ship Health: <progress value={gameState.health} max="100" aria-label="Ship Health"></progress></label>
        <label>Fuel: <progress value={gameState.fuel} max="100" aria-label="Fuel"></progress></label>
        <label>Life Support: <progress value={gameState.experience} max="100" aria-label="Life Support"></progress></label>
        <label>Power: <progress value={gameState.power} max="100" aria-label="Power"></progress></label>
      </div>
    );
  };
  

export default InformationBar;
