import React from 'react';

const ExploreStatus = ({max, current}:{max: number, current:number}) => {
  let descriptor = ""
  if (current === max) {
    descriptor = "Unexplored"
  }
  if (current < max) {
    descriptor = "Explored"
  }
  if (current < max/2) {
    descriptor = "Nearly Explored"
  }
  if (current < 1){
    descriptor = "Depleted"
  }
  if (descriptor) return (
    <span >{descriptor}</span>
  );
  return null
}

export default ExploreStatus;