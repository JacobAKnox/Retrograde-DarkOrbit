"use client"

import { useState, useEffect } from "react";
import { set_turn_timer, toggle_turn_timer_countdown } from "./../server/socket.js";

export default function TurnTimer() {
  const [displayTime, setDisplayTime] = useState("");
  const [phaseText, setPhaseText] = useState("");
  let ms = 0;
  let pause = false;

  function configureTimer(phase) {
    ms = phase.length;
    setDisplayTime(formatDisplayTime());
    setPhaseText(phase.name);
  }

  function toggleCountdown() {
    pause = !pause;
  }

  function formatDisplayTime() {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    if (secs < 10) {
      return `${mins}:0${secs}`;
    }

    return `${mins}:${secs}`;
  }

  useEffect(() => {
    set_turn_timer(configureTimer);
    toggle_turn_timer_countdown(toggleCountdown);
    const interval = setInterval(() => {
      if (pause == false) {
        if (ms <= 0) {
          console.log("time in ms = " + ms);
          toggleCountdown();
        }
        else {
          ms -= 1000;
          let display_string = formatDisplayTime(ms);
          console.log('updated time to ' + ms + ' ms');
          setDisplayTime(display_string);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
    
  return (
    <div>
      {displayTime} 
      <br/>
      <p>{phaseText}</p>
    </div>
  )
};
