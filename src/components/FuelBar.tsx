import React from 'react';
import { createUseStyles } from 'react-jss';
import { Tooltip } from './Tooltip';

const useStyles = createUseStyles({
  root: {
    fontSize: 10,
    color: "rgba(0,0,0,.65)",
    fontStyle: "italic",
    fontFamily: "Palatino"
  }
});

const FuelBar = ({maxFuel, currentFuel}:{maxFuel: number, currentFuel:number}) => {
  const classes = useStyles();
  let fuelDescriptor = "Full"
  if (currentFuel > maxFuel - maxFuel/8) fuelDescriptor = "Blazing"
  if (currentFuel < maxFuel/1.5) fuelDescriptor = "Roaring"
  if (currentFuel < maxFuel/2) fuelDescriptor = "Burning"
  if (currentFuel < maxFuel/4) fuelDescriptor = "Dying"
  if (currentFuel < maxFuel/8) fuelDescriptor = "Embers"
  if (currentFuel < 1) fuelDescriptor = "Ashes"

  if (fuelDescriptor) return (
    <Tooltip tooltip={`${currentFuel}/${maxFuel} hunger`}>
      <div className={classes.root}>{fuelDescriptor}</div>
    </Tooltip>
  );
  return null
}

export default FuelBar;
