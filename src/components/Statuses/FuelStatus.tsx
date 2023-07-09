import React from 'react';

const FuelStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = "Burning"
  let color = "rgba(0,0,0,.65)"
  if (current > max - max/8) {
    descriptor = "Blazing"
    color = "orange"
  }
  if (current < max/1.5) {
    descriptor = "Roading"
  }
  if (current < max/2) {
    descriptor = "Burning"
  }
  if (current < max/4) {
    descriptor = "Dying"
    color = "orange"
  }
  if (current < max/8) {
    descriptor = "Embers"
    color = "red"
  }
  if (current < 1){
    descriptor = "Ashes"
  }
  if (descriptor) return (
    // <Tooltip tooltip={`${current}/${max} fuel`} display="inline">
      <span style={{color}}>{descriptor}</span>
    // </Tooltip>
  );
  return null
}

export default FuelStatus;