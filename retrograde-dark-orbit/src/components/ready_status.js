"use client"

import { useEffect, useState } from "react"
import { update_ready_status } from "./../server/socket"

export default function ReadyStatus() {
  const [numPlayersReady, setNumPlayersReady] = useState(0);
  const [numPlayersTotal, setNumPlayersTotal] = useState(0);

  useEffect(() => {
    update_ready_status(updateReadyStatus);
  }, []);

  function updateReadyStatus(data) {
    setNumPlayersReady(data.num_ready);
    setNumPlayersTotal(data.num_total);
  }
 
  return (
    <div className="flex justify-center">
      {numPlayersReady}/{numPlayersTotal} players ready
    </div>
  )
}
