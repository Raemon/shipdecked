import React from 'react';
import { light, dark, warning } from '../../collections/styles';

const PregnancyStatus = ({max, current}:{max?: number, current?:number}) => {
  let descriptor = ""
  let color = light
  if (current === undefined) return null
  if (!max) return null
  if (current > 5) {
    descriptor = "Morning Sickness"
  }
  if (current > max * .8) {
    color = dark
    descriptor = "Pregnant"
  }
  if (current < 1){
    color = warning
    descriptor = "Water Broke"
  }
  if (descriptor) return (
      <span style={{color, whiteSpace: "pre"}}>
        {descriptor} 
        {/* {current} */}
      </span>
  );
  return null
}

export default PregnancyStatus;
