
import React from 'react';
import { light, dark, warning, danger } from '../../collections/styles';

export const StaminaStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = light
  if (current < max * .65) {
    descriptor = "Slightly Tired"
  }
  if (current < max * .5) {
    color = dark
    descriptor = "Tired"
  }
  if (current < max * .25) {
    descriptor = "Exhausted"
    color = warning
  }
  if (current < max * .125) {
    descriptor = "Delirious"
    color = danger
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