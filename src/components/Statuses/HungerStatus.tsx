import React from 'react';

const HungerStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,.65)"
  if (current > max - max/8) {
    descriptor = "Gorged"
    color = "orange"
  }
  if (current < max/1.5) {
    descriptor = "Slightly Hungry"
  }
  if (current < max/2) {
    descriptor = "Hungry"
  }
  if (current < max/4) {
    descriptor = "Very Hungry"
    color = "orange"
  }
  if (current < max/8) {
    descriptor = "Starving"
    color = "red"
  }
  if (current < 1){
    descriptor = "Dead"
  }
  if (descriptor) return (
    // <Tooltip tooltip={`${current}/${max} hunger`} display="inline">
      <span style={{color}}>
        {descriptor}
      </span>
    // </Tooltip>
  );
  return null
}

export default HungerStatus;
