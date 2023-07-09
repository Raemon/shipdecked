import React, { useCallback, useEffect } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { createUseStyles } from 'react-jss';
import { AttributeInfo, CardPosition, CardPositionInfo } from '../collections/types';
import { units } from '../collections/cards';
import { getAttachedCardsWithHigherZIndex, updateCardPosition, whileAttached } from '../collections/spawningUtils';
import CardTimer from './CardTimer';
import { debugging, handleStart } from './Game';
import HungerStatus from './Statuses/HungerStatus';
import FuelStatus from './Statuses/FuelStatus';
import { STACK_OFFSET_X, STACK_OFFSET_Y } from '../collections/useCardPositions';
import { StaminaStatus } from './Statuses/StaminaStatus';

export const LARGE_CARD_WIDTH = 132
export const LARGE_CARD_HEIGHT = 220
export const CARD_HEIGHT = 180;
export const CARD_WIDTH = 110;

const useStyles = createUseStyles({
  root: {
    display: "inline-block",
    position: "absolute",
  },
  styling: {
    padding: 9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: "solid 1px rgba(0,0,0,.15)",
    outline: "solid 1px rgba(0,0,0,1)",
    borderRadius: 4,
    boxShadow: '0 4px 0 0 rgba(0,0,0,0)',
    backgroundSize: "cover !important",
    transition: 'all .1s ease-in-out',
    cursor: "grab", 
    '&:hover': {
      transform: 'scale(1.01)',
      filter: 'saturate(1)',
    },
    filter: 'saturate(.8)',
    transform: 'scale(1)',
    '& h2': {
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      color: 'rgba(0,0,0,.75)',
      fontFamily: "Papyrus"
    }
  },
  image: {
    height: 150,
    width: 120,
    backgroundSize: "contain !important",
    backgroundPositionX: "center !important",
    backgroundPositionY: "center !important",
    backgroundRepeat: "no-repeat !important",
    marginTop: "auto",
    marginBottom:"auto",
    pointerEvents: 'none',
    userSelect: 'none',
  },
  meta: {
    position: 'absolute',
    fontSize: 10,
    color: 'rgba(0,0,0,.4)',
    fontFamily: "Helvetica"
  },
  cardText: {
    fontSize: 11,
    color: 'rgba(0,0,0,.8)',
    fontFamily: "Palatino"
  },
  statuses: {
    fontSize: 10,
    color: "rgba(0,0,0,.65)",
    fontStyle: "italic",
    fontFamily: "Palatino",
    '& span:not(:last-child):after': {
      content: '", "',
    }
  }
});

type CardProps = {
  cardPositionInfo: CardPositionInfo,
  onDrag: (event: DraggableEvent, data: DraggableData, i: number) => void;
  onStop: (i: number) => void;
  paused: boolean;
};


const Card = ({onDrag, onStop, cardPositionInfo, paused}:CardProps) => {
  const classes = useStyles();
  const {cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i];
  const { slug, timerEnd, timerStart, name, imageUrl, currentSpawnDescriptor, maxHunger, 
    currentHunger, cardText, currentFuel, maxFuel, maxStamina, currentStamina } = cardPosition;
  const card = units[slug]
  if (!card) throw Error

  function handleDrag (event: DraggableEvent, data: DraggableData){
    onDrag(event, data, i)
  }
  function handleStop () {
    onStop(i)
  }

  const whileAttachedCallback = useCallback((cardPositionInfo: CardPositionInfo) => {
    whileAttached(cardPositionInfo)
  }, [cardPositionInfo]);

  useEffect(() => {
    whileAttachedCallback(cardPositionInfo)
  }, [cardPositionInfo]);

  function updateAttribute (attribute: keyof AttributeInfo) {
    setTimeout(() => {
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        try {
          const current = cardPosition[attribute]
          if (!paused && current && current > 0) {
            return { ...cardPosition, [attribute]: current - 1 };
          }
        } catch (err) {
          console.log(err)
          console.log({cardPosition, attribute})
        }
        return cardPosition;
      });
    }, 1000);
  }

  const updateHunger = useCallback(() => {
    updateAttribute('currentHunger')
  }, [cardPositionInfo, cardPosition])

  const updateFuel = useCallback(() => {
    updateAttribute('currentFuel')
  }, [cardPositionInfo, cardPosition])

  const updateStamina = useCallback(() => {
    updateAttribute('currentStamina')
  }, [cardPositionInfo, cardPosition])

  useEffect(() => {
    updateHunger()
  }, [cardPosition.currentHunger])

  useEffect(() => {
    updateFuel()
  }, [cardPosition.currentFuel])

  useEffect(() => {
    updateStamina()
  }, [cardPosition.currentStamina])

  // const loot = cardPosition.loot && Object.values(cardPosition.loot).flatMap((item) => item)

  const backgroundColor = (cardPosition.maybeAttached.length || cardPosition.attached.length || cardPosition.idea) ? 'rgba(255,255,255,.8)' : 'white'

  const offsetStackSize = getAttachedCardsWithHigherZIndex(cardPositions, i).length
  const progressBarOffsetX = offsetStackSize * STACK_OFFSET_X
  const progressBarOffsetY = offsetStackSize * STACK_OFFSET_Y

  return (
    <DraggableCore onStart={handleStart} onDrag={handleDrag} onStop={handleStop}>
      <div className={classes.root} style={{
        left: cardPosition.x, 
        top: cardPosition.y, 
        zIndex: cardPosition.zIndex,
      }}>
        <div className={classes.styling} style={{
          width: card.large ? LARGE_CARD_WIDTH : CARD_WIDTH,
          height: card.large ? LARGE_CARD_HEIGHT : CARD_HEIGHT,
          border: card.idea ? "dashed 2px rgba(0,0,0,.2)" : "",
          outlineWidth: cardPosition.maybeAttached.length ? 3 : 0,
          background: card.backgroundImage ? `url(${card.backgroundImage})` : backgroundColor
        }}>
          <h2>{name}</h2>
          {
            debugging && 
              <div>
                <div className={classes.meta} style={{left: 5, top: 5}}>
                  {i}
                </div>
                <div className={classes.meta} style={{left: 5, bottom: 5}}>
                  {cardPosition.attached.length > 0 && <span>
                    {cardPosition.attached.map((index) => `${index}`).join(",")} attached
                  </span>}
                </div>
                <div className={classes.meta} style={{right: 5, top: 5}}>
                  {cardPosition.zIndex}
                </div>
                <div className={classes.meta} style={{right: 5, bottom: 5}}>
                  {cardPosition.loot?.join(", ")}
                </div>
              </div>
            }
          {imageUrl && <div className={classes.image} style={{background:`url(${imageUrl})`}}/>}
          <div className={classes.statuses}>
            {!!(maxHunger && currentHunger) && <HungerStatus
              max={maxHunger} 
              current={currentHunger}
              />}
            {!!(maxFuel && currentFuel) && <FuelStatus
              max={maxFuel} 
              current={currentFuel}
              />}
            {!!(maxStamina && currentStamina) && <StaminaStatus
              max={maxStamina} 
              current={currentStamina}
              />}
          </div>

          {cardText && <div className={classes.cardText}>
            {cardText}
          </div>}
          {timerStart && timerEnd && <CardTimer 
            offsetX={progressBarOffsetX}
            offsetY={progressBarOffsetY}
            descriptor={currentSpawnDescriptor}
            timerStart={timerStart} 
            timerEnd={timerEnd}
          />}
        </div>
      </div>
    </DraggableCore>
  );
}

export default Card;
