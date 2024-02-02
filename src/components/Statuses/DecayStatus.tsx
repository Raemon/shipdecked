import React from 'react';

const DecayStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = "Fresh"
  let color = "rgba(0,0,0,.65)"
  if (current < max * 0.9) {
    color = "black"
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