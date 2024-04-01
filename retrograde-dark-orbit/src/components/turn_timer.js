"use client"

import { useState, useEffect } from "react";
import { set_turn_timer, toggle_turn_timer_countdown } from "./../server/socket.js";

export default function TurnTimer() {
  let time = new Date();
  let pause = true;
  
  function configureTimer(phase) {
    const setup_time = new Date();
    setup_time.setMilliseconds(phase.length);
    setPhaseText(phase.name);
    time = setup_time;
  }

  function toggleCountdown() {
    pause = !pause;
  }

  const [displayTime, setDisplayTime] = useState("");
  const [phaseText, setPhaseText] = useState("");

  useEffect(() => {
    set_turn_timer(configureTimer);
    toggle_turn_timer_countdown(toggleCountdown);
    const interval = setInterval(() => {
      if (pause === false) {
        if (current_time.getMilliseconds() == 0) {
          toggleCountdown();
        }
        const secs = current_time.getSeconds()-1;
        current_time.setSeconds(secs);
        let display_string = "";
        if (secs < 10) {
        display_string = 
            `${time.getMinutes()}:0${time.getSeconds()}`;
        } else {
        display_string = 
            `${time.getMinutes()}:${time.getSeconds()}`;
        }

        setDisplayTime(display_string);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
    
  return (
    <div>
      {displayTime}
      {phaseText}
    </div>
  )
};
