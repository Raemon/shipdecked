import React, { useCallback, useEffect } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { createUseStyles } from 'react-jss';
import { CardPosition, CardPositionInfo } from '../collections/types';
import { units } from '../collections/cards';
import { updateCardPosition, whileAttached } from '../collections/utils';
import CardTimer from './CardTimer';
import { debugging, handleStart } from './Game';
import HungerBar from './HungerBar';
import FuelBar from './FuelBar';

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
  }
});

type DraggableItemProps = {
  cardPositionInfo: CardPositionInfo,
  onDrag: (event: DraggableEvent, data: DraggableData, i: number) => void;
  onStop: (i: number) => void;
};


const Card = ({onDrag, onStop, cardPositionInfo}:DraggableItemProps) => {
  const classes = useStyles();
  const {cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i];
  const { slug, timerEnd, timerStart, name, imageUrl, currentSpawnDescriptor, maxHunger, 
    currentHunger, cardText, currentFuel, maxFuel } = cardPosition;
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

  const updateHunger = useCallback(() => {
    // Inside updateHunger function
    setTimeout(() => {
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        const hunger = cardPosition.currentHunger
        if (hunger && hunger > 0) {
          return { ...cardPosition, currentHunger: hunger - 1 };
        }
        return cardPosition;
      });
    }, 1000);
  }, [cardPositionInfo, cardPosition])

  const updateFuel = useCallback(() => {
    // Inside updateHunger function
    setTimeout(() => {
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        const fuel = cardPosition.currentFuel
        if (fuel && fuel > 0) {
          return { ...cardPosition, currentFuel: fuel - 1 };
        }
        return cardPosition;
      });
    }, 1000);
  }, [cardPositionInfo, cardPosition])

  useEffect(() => {
    updateHunger()
  }, [cardPosition.currentHunger])

  useEffect(() => {
    updateFuel()
  }, [cardPosition.currentFuel])

  // const loot = cardPosition.loot && Object.values(cardPosition.loot).flatMap((item) => item)

  const backgroundColor = (cardPosition.maybeAttached.length || cardPosition.attached.length || cardPosition.idea) ? 'rgba(255,255,255,.8)' : 'white'

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
            // debugging && 
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
          {!!(maxHunger && currentHunger) && <HungerBar
             maxHunger={maxHunger} 
             currentHunger={currentHunger}
            />}
          {!!(maxFuel && currentFuel) && <FuelBar
             maxFuel={maxFuel} 
             currentFuel={currentFuel}
            />}
          {timerStart && timerEnd && <CardTimer 
            descriptor={currentSpawnDescriptor}
            timerStart={timerStart} 
            timerEnd={timerEnd}
          />}
          {cardText && <div className={classes.cardText}>
            {cardText}
          </div>}
          {/* {loot && <span style={{fontSize:10}}>{loot.join(", ")}</span>} */}
        </div>
      </div>
    </DraggableCore>
  );
}

export default Card;
