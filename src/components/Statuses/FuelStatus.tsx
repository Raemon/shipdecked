import React from 'react';
import { danger, warning } from '../../collections/styles';

const FuelStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = "Burning"
  let color = "rgba(0,0,0,.65)"
  if (current > max - max/8) {
    descriptor = "Blazing"
    color = warning
  }
  if (current < max/1.5) {
    descriptor = "Roaring"
  }
  if (current < max/2) {
    descriptor = "Burning"
  }
  if (current < max/4) {
    descriptor = "Dying"
    color = warning
  }
  if (current < max/8) {
    descriptor = "Embers"
    color = danger
  }
  if (current < 2){
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