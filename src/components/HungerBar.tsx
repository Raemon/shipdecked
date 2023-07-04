import React from 'react';
import { createUseStyles } from 'react-jss';
import { Tooltip } from './Tooltip';

const useStyles = createUseStyles({
  root: {
    fontSize: 10,
    color: "rgba(0,0,0,.5)",
    position: "absolute",
    bottom: 6,
    left: "50%",
    transform: "translate(-50%, 0)",
    fontStyle: "italic",
    fontFamily: "Palatino"
  }
});

const HungerBar = ({maxHunger, currentHunger}:{maxHunger: number, currentHunger:number}) => {
  const classes = useStyles();
  let hungerDescriptor = ""
  if (currentHunger > maxHunger - maxHunger/8) hungerDescriptor = "Full"
  if (currentHunger < maxHunger/2) hungerDescriptor = "Hungry"
  if (currentHunger < maxHunger/4) hungerDescriptor = "Very Hungry"
  if (currentHunger < maxHunger/8) hungerDescriptor = "Starving"

  if (hungerDescriptor) return (
    <Tooltip tooltip={`${currentHunger}/${maxHunger} hunger`}>
      <div className={classes.root}>{hungerDescriptor}</div>
    </Tooltip>
  );
  return null
}

export default HungerBar;
