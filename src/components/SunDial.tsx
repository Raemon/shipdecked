import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 200,
    width: 200,
  },
});

function SunDial() {
  const [countdown, setCountdown] = useState(100);
  const classes = useStyles();

  useEffect(() => {
    const endTime = Date.now() + 100000; // 100 seconds from now

    const intervalId = setInterval(() => {
      const timeLeft = Math.round((endTime - Date.now()) / 1000);
      
      if (timeLeft >= 0) {
        setCountdown(timeLeft);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // clear interval on component unmount
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = ((50 - countdown) / 50) * circumference;

  return (
    <svg className={classes.root}>
      <circle
        stroke="rgba(0,0,0,.2)"
        fill="transparent"
        strokeWidth="6"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset: offset }}
        r={radius}
        cx="50"
        cy="50"
      />
      <circle
        stroke="rgba(0,0,0,.1)"
        fill="transparent"
        strokeWidth="6"
        strokeDasharray={circumference + ' ' + circumference}
        r={radius}
        cx="50"
        cy="50"
      />
    </svg>
  );
}

export default SunDial;