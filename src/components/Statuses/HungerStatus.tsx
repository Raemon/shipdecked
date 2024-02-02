import React from 'react';

const HungerStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,1)"
  if (current > max - max/8) {
    descriptor = "Gorged"
    color = "darkorange"
  }
  if (current < max/1.5) {
    descriptor = "Slightly Hungry"
  }
  if (current < max/2) {
    descriptor = "Hungry"
  }
  if (current < max/4) {
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
