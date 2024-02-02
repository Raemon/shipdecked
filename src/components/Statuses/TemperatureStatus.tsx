import React from 'react';

const TemperatureStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  let color = "rgba(50,50,100,1)"
  if (current < max * .92) {
    descriptor = "Chilly"
  }
  if (current < max * .5) {
    color = "blue"
    descriptor = "Cold"
  }
  if (current < max * .1){
    color = "darkblue"
    descriptor = "Freezing"
  }
  if (descriptor) return (
      <span style={{color}}>
        {descriptor}
        {/* {current} */}
      </span>
  );
  return null
}

export default TemperatureStatus;