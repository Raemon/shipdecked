import React from 'react';
import { danger, dark, warning } from '../../collections/styles';

const HungerStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,.65)"
  if (current > max - max/8) {
    descriptor = "Gorged"
    color = warning
  }
  if (current < max * .6) {
    descriptor = "Slightly Hungry"
  }
  if (current < max * .5) {
    color = dark
    descriptor = "Hungry"
  }
  if (current < max * .25) {
    descriptor = "Very Hungry"
    color = warning
  }
  if (current < max/8) {
    descriptor = "Starving"
    color = danger
  }
  if (current < 1){
    descriptor = "Dead"
  }
  if (descriptor) return (
      <span style={{color}}>
        {descriptor} 
        {/* {current} */}
      </span>
  );
  return null
}

export default HungerStatus;
