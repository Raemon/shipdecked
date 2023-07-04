import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    fontSize: 10,
    color: "rgba(0,0,0,.8)",
    width: "100%",
    height: 14,
    border: "solid 1px rgba(0,0,0,.2)",
    borderRadius: 3,
    position: "relative"
  },
  timer: {
    background: "rgba(0,0,0,.2)",
    height: 14
  },
  descriptor: {
    position: "absolute",
    top: 7,
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
});

const CardTimer = ({timerStart, timerEnd, descriptor}:{timerStart: Date, timerEnd:Date, descriptor?: string}) => {
  const classes = useStyles();
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now()));
  
  // Compute the total and elapsed durations
  const totalDuration = timerEnd.getTime() - timerStart.getTime();
  const elapsedDuration = currentTime - timerStart.getTime();

  // Ensure the elapsed duration doesn't exceed the total duration
  const safeElapsedDuration = Math.min(elapsedDuration, totalDuration);
  
  // Compute the width of the progress bar
  const progressWidth = 100 - (safeElapsedDuration / totalDuration) * 100;

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(Math.floor(Date.now()));
    }, 10);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.descriptor}>{descriptor}</div>
      <div className={classes.timer} style={{ width: `${progressWidth}%`}} />
    </div>
  );
}

export default CardTimer;
