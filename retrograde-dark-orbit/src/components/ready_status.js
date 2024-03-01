"use client"

import { useState } from "react"

export default function ReadyStatus() {
  const [numPlayersReady, setNumPlayersReady] = useState(0);
  const [numPlayersTotal, setNumPlayersTotal] = useState(0);

  return (
    <div className="flex justify-center">
      {numPlayersReady}/{numPlayersTotal} players ready
    </div>
  )
}
