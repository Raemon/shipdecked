import React from 'react';
import { light, dark, warning, danger } from '../../collections/styles';

const DecayStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = "Fresh"
  let color = light
  if (current < max * 0.9) {
    color = dark
    descriptor = "Bloated"
  }
  if (current < max * .5) {
    color = "darkgreen"
    descriptor = "Decaying"
  }
  if (current < 2){
    color = "darkgreen"
    descriptor = "Rotted"
  }
  if (descriptor) return (
    <span style={{color}}>
      {descriptor}
    </span>
  );
  return null
}

export default DecayStatus;