import React from 'react';
import { createUseStyles } from 'react-jss';
import { Tooltip } from './Tooltip';

const useStyles = createUseStyles({
  root: {
    fontSize: 10,
    fontStyle: "italic",
    fontFamily: "Palatino"
  }
});

const HungerBar = ({maxHunger, currentHunger}:{maxHunger: number, currentHunger:number}) => {
  const classes = useStyles();
  let hungerDescriptor = ""
  let color = "rgba(0,0,0,.65)"
  if (currentHunger > maxHunger - maxHunger/8) {
    hungerDescriptor = "Gorged"
    color = "orange"
  }
  if (currentHunger < maxHunger/1.5) {
    hungerDescriptor = "Slightly Hungry"
  }
  if (currentHunger < maxHunger/2) {
    hungerDescriptor = "Hungry"
  }
  if (currentHunger < maxHunger/4) {
    hungerDescriptor = "Very Hungry"
    color = "orange"
  }
  if (currentHunger < maxHunger/8) {
    hungerDescriptor = "Starving"
    color = "red"
  }
  if (currentHunger < 1){
    hungerDescriptor = "Dead"
  }
  if (hungerDescriptor) return (
    <Tooltip tooltip={`${currentHunger}/${maxHunger} hunger`}>
      <div className={classes.root} style={{color}}>{hungerDescriptor}</div>
    </Tooltip>
  );
  return null
}

export default HungerBar;
