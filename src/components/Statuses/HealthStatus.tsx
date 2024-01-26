import React from 'react';

const HealthStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(0,0,0,.65)"
  if (current < max) {
    descriptor = "Wounded"
    color = "red"
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
