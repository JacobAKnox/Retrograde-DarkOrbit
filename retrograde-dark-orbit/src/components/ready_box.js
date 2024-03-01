"use client"

import ReadyStatus from "./ready_status"
import ReadyButton from "./ready_button"

export default function ReadyBox() {
  return (
    <div className="bg-gray-700 rounded-xl w-full p-4 overflow-y-auto">
      <div className="flex justify-center pb-4">
        <ReadyStatus/>
      </div>
      <div className="flex justify-center">
        <ReadyButton/>
      </div>
    </div>
  )
}
