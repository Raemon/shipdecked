
import React from 'react';

export const StaminaStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,.65)"
  if (current < max * .65) {
    descriptor = "Slightly Tired"
  }
  if (current < max * .5) {
    color = "black"
    descriptor = "Tired"
  }
  if (current < max * .25) {
    descriptor = "Exhausted"
    color = "darkorange"
  }
  if (current < max * .125) {
    descriptor = "Delirious"
    color = "red"
  }
  if (current < 1){
    descriptor = "Dead"
  }
  if (descriptor) return (
    // <Tooltip tooltip={`${current}/${max} stamina`} display="inline">
      <span className="status" style={{color}}>
        {descriptor}
      </span>
    // </Tooltip>
  );
  return null
}