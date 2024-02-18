import React from 'react'
import { createUseStyles } from "react-jss";
import { CardPosition } from "../../collections/types";
import HungerStatus from './HungerStatus';
import DecayStatus from './DecayStatus';
import ExploredStatus from './ExploredStatus';
import FuelStatus from './FuelStatus';
import HealthStatus from './HealthStatus';
import PregnancyStatus from './PregnancyStatus';
import { StaminaStatus } from './StaminaStatus';
import TemperatureStatus from './TemperatureStatus';
import { allCards } from '../../collections/cards';

const useStyles = createUseStyles({
  statuses: {
    fontSize: 10,
    color: "rgba(0,0,0,.75)",
    fontStyle: "italic",
    fontFamily: "Palatino",
    '& span:not(:last-child):after': {
      content: '", "',
    }
  }
})

export const Statuses = ({cardPosition}: {cardPosition: CardPosition}) => {
  const classes = useStyles();
  const { 
    maxHunger, 
    maxDecay, 
    maxHealth, currentHealth, currentDecay,currentHunger, maxTemp, currentTemp, currentFuel, maxFuel, maxStamina, currentStamina, maxPregnancy, currentPregnancy 
  } = cardPosition;
  
  const card = allCards[cardPosition.slug]

  return <div className={classes.statuses}>
    {!!(maxHunger && currentHunger) && <HungerStatus
      max={maxHunger} 
      current={currentHunger}
      />}
    {!!(maxHealth && currentHealth) && <HealthStatus
      max={maxHealth} 
      current={currentHealth}
      />}
    {!!(maxFuel && currentFuel) && <FuelStatus
      max={maxFuel} 
      current={currentFuel}
      />}
    {!!(maxStamina && currentStamina) && <StaminaStatus
      max={maxStamina} 
      current={currentStamina}
      />}
    {!!(maxDecay && currentDecay) && <DecayStatus
      max={maxDecay} 
      current={currentDecay}
      />}
    {!!(maxTemp && currentTemp) && <TemperatureStatus max={maxTemp} current={currentTemp}/>}
    {<PregnancyStatus max={maxPregnancy} current={currentPregnancy}/>}
    <ExploredStatus card={card} cardPosition={cardPosition}/>
  </div>
}

