import React from 'react';
import { danger } from '../../collections/styles';

const HealthStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,1)"
  if (current < max) {
    descriptor = "Wounded"
    color = danger
  }
  if (current < 1){
    descriptor = "Dead"
  }
  if (descriptor) return (
    // <Tooltip tooltip={`${current}/${max} hunger`} display="inline">
      <span style={{color}}>
        {descriptor}
      </span>
    // </Tooltip>
  );
  return null
}

export default HealthStatus;
