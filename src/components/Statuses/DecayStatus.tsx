import React from 'react';

const DecayStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = "Fresh"
  if (current < max * 0.9) {
    descriptor = "Bloated"
  }
  if (current < max * .5) {
    descriptor = "Decaying"
  }
  if (current < 1){
    descriptor = "Rotted"
  }
  if (descriptor) return (
    <span >{descriptor} {current}</span>
  );
  return null
}

export default DecayStatus;