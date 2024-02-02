import React from 'react';

const HungerStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,.65)"
  if (current > max - max/8) {
    descriptor = "Gorged"
    color = "darkorange"
  }
  if (current < max * .6) {
    descriptor = "Slightly Hungry"
  }
  if (current < max * .5) {
    color = "black"
    descriptor = "Hungry"
  }
  if (current < max * .25) {
    descriptor = "Very Hungry"
    color = "darkorange"
  }
  if (current < max/8) {
    descriptor = "Starving"
    color = "red"
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
