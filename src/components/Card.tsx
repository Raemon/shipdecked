import React, { useCallback, useEffect } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { createUseStyles } from 'react-jss';
import { CardPosition, CardPositionInfo, CurrentCardAttriutes, MaxCardAttributes } from '../collections/types';
import { allCards } from '../collections/cards';
import { createCardPosition, getAttachedCardsWithHigherZIndex, updateCardPosition, whileAttached } from '../collections/spawningUtils';
import CardTimer from './CardTimer';
import { handleStart } from './Game';
import HungerStatus from './Statuses/HungerStatus';
import FuelStatus from './Statuses/FuelStatus';
import { getNewCardPosition, isOverlapping, moveTowardsDestination, STACK_OFFSET_X, STACK_OFFSET_Y } from '../collections/useCardPositions';
import { StaminaStatus } from './Statuses/StaminaStatus';
import DecayStatus from './Statuses/DecayStatus';
import ExploredStatus from './Statuses/ExploredStatus';
import HealthStatus from './Statuses/HealthStatus';
import TemperatureStatus from './Statuses/TemperatureStatus';
import { isNight } from './SunDial';

export const LARGE_CARD_WIDTH = 132
export const LARGE_CARD_HEIGHT = 218
export const CARD_HEIGHT = 180;
export const CARD_WIDTH = 110;
export const IDEA_CARD_WIDTH = 120;
export const IDEA_CARD_HEIGHT = 190;

export const getCardDimensions = (card: CardPosition) => {
  if (card.large) {
    return {
      width: LARGE_CARD_WIDTH,
      height: LARGE_CARD_HEIGHT
    }
  } else if (card.idea) {
    return {
      width: IDEA_CARD_WIDTH,
      height: IDEA_CARD_HEIGHT
    }
  } else {
    return {
      width: CARD_WIDTH,
      height: CARD_HEIGHT
    }
  }
}

export const getCardBackground = (cardPosition: CardPosition) => {
  if (cardPosition.backgroundImage) {
    return `url(${cardPosition.backgroundImage})`
  } else if (cardPosition.maybeAttached.length) {
    return 'rgba(255,255,255,.8)'
  } else if (cardPosition.attached.length) {
    return 'rgba(255,255,255,.8)'
  } else if (cardPosition.idea) {
    return 'rgba(255,255,255,.6)'
  } else if (cardPosition.enemy) {
    return 'rgba(255,240,240,1)'
  }
  return 'white'
}

export const getCardBorder = (cardPosition: CardPosition) => {
  if (cardPosition.idea) {
    return "dashed 2px rgba(0,0,0,.2)"
  } else if (cardPosition.enemy) {
    return "solid 3px rgba(200,0,0,1)"
  }
  return ""
}

const useStyles = createUseStyles({
  '@keyframes fadeOutOutline': {
    from: { outline: '4px solid rgba(0, 0, 0, .5)' }, // Full opacity
    to: { outline: '4px solid rgba(0, 0, 0, 0)' } // Zero opacity
  },
  root: {
    display: "inline-block",
    position: "absolute",
    transition: 'filter 2s ease-in-out',
  },
  styling: {
    padding: 9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: "solid 1px #aaa",
    outline: "solid 1px rgba(0,0,0,.5)",
    borderRadius: 4,
    boxShadow: '0 4px 0 0 rgba(0,0,0,0)',
    backgroundSize: "cover !important",
    transition: 'all .1s ease-in-out',
    animation: '$fadeOutOutline 2s forwards', // Apply the animation
    cursor: "grab", 
    '&:hover': {
      transform: 'scale(1.01)',
      filter: 'saturate(1)',
    },
    filter: 'saturate(.8)',
    transform: 'scale(1)',
    '& h2': {
      margin: 0,
      fontSize: 12,
      fontWeight: 500,
      color: 'rgba(0,0,0,.9)',
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
    fontFamily: "Palatino",
    lineHeight: "1.3em",
  },
  statuses: {
    fontSize: 10,
    color: "rgba(0,0,0,.75)",
    fontStyle: "italic",
    fontFamily: "Palatino",
    '& span:not(:last-child):after': {
      content: '", "',
    }
  }
});

type CardProps = {
  cardPositionInfo: CardPositionInfo,
  onDrag: (event: DraggableEvent, data: DraggableData, id: string) => void;
  onStop: (id: string) => void;
  paused: boolean;
  isDragging: boolean;
  soundEnabled: boolean;
  dayCount: number;
};


const Card = ({onDrag, onStop, cardPositionInfo, paused, isDragging, dayCount}:CardProps) => {
  const classes = useStyles();
  const {cardPositions, id, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[id];
  // const numberOverlappingCards = getOverlappingNonattachedCards(cardPositions, id).length
  
  const trackedCardId = Object.values(cardPositions).find((c: CardPosition) => {
    return cardPosition.tracks?.includes(c.slug)
  })?.id

  function handleDrag (event: DraggableEvent, data: DraggableData){
    onDrag(event, data, id)
  }
  function handleStop () {
    onStop(id)
  }

  const whileAttachedCallback = useCallback((cardPositionInfo: CardPositionInfo) => {
    whileAttached(cardPositionInfo)
  }, [cardPositionInfo]);

  useEffect(() => {
    whileAttachedCallback(cardPositionInfo)
  }, [cardPositionInfo]);

  function updateAttribute ({currentAttribute, interval=3000, adjust= -1, maxAttribute}:{currentAttribute: keyof CurrentCardAttriutes, interval?:number, adjust?: number, maxAttribute?: keyof MaxCardAttributes} ) {
    setTimeout(() => {
      if (!cardPosition) return
      if (cardPosition[currentAttribute] === 0) {
        setCardPositions((cardPositions: Record<string, CardPosition>) => {
          const newCardPositions = {...cardPositions}
          delete newCardPositions[id]
          const corpseCard = cardPosition.corpse && createCardPosition(cardPositions, cardPosition.corpse, cardPosition.x, cardPosition.y, undefined, false)
          if (corpseCard) newCardPositions[corpseCard.id] = corpseCard
          return newCardPositions
        })
      }
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        try {
          const current = cardPosition[currentAttribute]
          const max = maxAttribute && cardPosition[maxAttribute]
          if (!paused && current) {
            if (adjust > 0 && max && current < max) {
              return { ...cardPosition, [currentAttribute]: current + adjust };
            } else if (adjust < 0 && current > 0) {
              return { ...cardPosition, [currentAttribute]: current + adjust };
            }
          } else {
            return {
              ...cardPosition,
              name: cardPosition.name
            }
          }
        } catch (err) {
          console.log(err)
          console.log({cardPosition, currentAttribute})
        }
        return cardPosition;
      });
    }, interval);
  }

  const updateHunger = useCallback(() => {
    updateAttribute({currentAttribute: 'currentHunger'})
  }, [cardPositionInfo, cardPosition])

  const updateFuel = useCallback(() => {
    updateAttribute({currentAttribute: 'currentFuel'})
  }, [cardPositionInfo, cardPosition])

  const updateStamina = useCallback(() => {
    updateAttribute({currentAttribute: 'currentStamina'})
  }, [cardPositionInfo, cardPosition])

  const updateDecaying = useCallback(() => {
    updateAttribute({currentAttribute: 'currentDecay'})
  }, [cardPositionInfo, cardPosition])

  const updateTemperature = useCallback(() => {
    if (isNight(dayCount)) {
      updateAttribute({currentAttribute: 'currentTemp', maxAttribute: 'maxTemp', adjust: -1})
    } else {
      updateAttribute({currentAttribute: 'currentTemp', maxAttribute: 'maxTemp', adjust: 2})
    }
  }, [cardPositionInfo, cardPosition])

  const updateFading = useCallback(() => {
    updateAttribute({currentAttribute: 'currentFading', interval:10})
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

  useEffect(() => {
    updateFading()
  }, [cardPosition.currentFading])

  useEffect(() => {
    updateDecaying()
  }, [cardPosition.currentDecay])

  useEffect(() => {
    updateTemperature()
  }, [cardPosition.currentTemp, dayCount])

  // set new destination based on nonoverlap
  // useEffect(() => {
  //   if (!numberOverlappingCards) return
  //   if (isDragging) return
  //   const timeoutId = setTimeout(() => {
  //     updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
  //       return {
  //         ...cardPosition,
  //         ...findNonoverlappingDirection(cardPositions, id)
  //       }
  //     })
  //   }, 1);
  //   return () => clearTimeout(timeoutId);
  // }, [numberOverlappingCards])

  // move towards destination
  useEffect(() => {
    if (isDragging) return
    const timeoutId = setTimeout(() => {
      const { x, y, destinationX, destinationY } = moveTowardsDestination(cardPositions, id)
      updateCardPosition(cardPositionInfo, (cardPosition) => {
        if (cardPosition.x === cardPosition.destinationX) return {
          ...cardPosition,
          destinationX: undefined,
          destinationY: undefined,
        }
        return {
          ...cardPosition,
          destinationX,
          destinationY,
          x,
          y,
        }
      })
    }, 1);
  
    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [cardPosition.x, cardPosition.y, cardPosition.destinationX, cardPosition.destinationY])

  // Tracking
  useEffect(() => {
    setTimeout(() => {
      if (!cardPosition) return
      if (!cardPosition.tracks?.length) return
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        let newX = cardPosition.x
        let newY = cardPosition.y
        const trackedCard = trackedCardId ? cardPositions[trackedCardId] : undefined
        if (trackedCard && !isOverlapping(cardPositions, trackedCard.id, cardPosition.id)) {
          if (trackedCard.x > cardPosition.x) {
            newX = Math.round(cardPosition.x + (Math.random()*20+10))
          } else if (trackedCard.x < cardPosition.x) {
            newX = Math.round(cardPosition.x - (Math.random()*20+10))
          }
          if (trackedCard.y > cardPosition.y) {
            newY = Math.round(cardPosition.y + (Math.random()*20+10))
          } else if (trackedCard.y < cardPosition.y) {
            newY = Math.round(cardPosition.y - (Math.random()*20+10))
          }
        } else {
          newX = Math.round(cardPosition.x + (Math.random()*40 - 20))
          newY = Math.round(cardPosition.y + (Math.random()*40 - 20))
        }
        return {
          ...getNewCardPosition(cardPositions, cardPosition.id),
          x: newX,
          y: newY,
        }
      });
    }, 3000);
  }, [trackedCardId, cardPosition.tracks, cardPosition.x, cardPosition.y])

  // const loot = cardPosition.loot && Object.values(cardPosition.loot).flatMap((item) => item)

  const offsetStackSize = getAttachedCardsWithHigherZIndex(cardPositions, id).length
  const progressBarOffsetX = offsetStackSize * STACK_OFFSET_X
  const progressBarOffsetY = offsetStackSize * STACK_OFFSET_Y

  if (!cardPosition) return null

  const { slug, timerEnd, timerStart, name, imageUrl, currentSpawnDescriptor, maxHunger, maxDecay,  maxHealth, currentHealth, currentDecay,currentHunger, maxTemp, currentTemp, cardText, currentFuel, maxFuel, maxStamina, currentStamina, spawningStack, Widget } = cardPosition;
  const card = allCards[slug]
  if (!card) throw Error

  if (cardPosition.hide) return null

  const renderTimer = 
    timerStart && 
    timerEnd && 
    timerEnd.getTime() > Date.now() && 
    // TODO rewrite this to check slugs
    spawningStack?.length === cardPosition.attached.length

  return (
    <DraggableCore onStart={handleStart} onDrag={handleDrag} onStop={handleStop}>
      <div className={classes.root} style={{
        left: cardPosition.x, 
        top: cardPosition.y, 
        zIndex: cardPosition.zIndex,
        filter: isNight(dayCount) ? 'brightness(80%)' : 'brightness(100%)',
      }}>
        <div className={classes.styling} style={{
          ...getCardDimensions(cardPosition),
          border: getCardBorder(cardPosition),
          outlineWidth: cardPosition.maybeAttached.length ? 3 : 0,
          background: getCardBackground(cardPosition),
          borderRadius: card.idea ? 20 : 4,
          // transition: cardPosition.transition ? 'all .1s ease-in-out' : 'none',
        }}>
          <h2>{name}</h2>
          {
            // debugging && 
              <div>
                {/* <div className={classes.meta} style={{left: 5, top: 5}}>
                  {cardPosition.x}, {cardPosition.y}
                </div> */}
                {/* <div className={classes.meta} style={{right: 5, top: 5}}>
                  {cardPosition.destinationX}, {cardPosition.destinationY}
                </div> */}
{/*                 
                <div className={classes.meta} style={{left: 5, top: 5}}>
                  {id}
                </div> */}
                {/* <div className={classes.meta} style={{left: 5, bottom: 5}}>
                  {cardPosition.attached.length > 0 && <span>
                    {cardPosition.attached.map((index) => `${index}`).join(",")}
                  </span>}
                </div> */}
                {/* <div className={classes.meta} style={{right: 5, top: 5}}>
                  {cardPosition.zIndex}
                </div> */}
                {/* <div className={classes.meta} style={{right: 5, bottom: 5}}>
                  {cardPosition.loot?.join(", ")}
                </div> */}
              </div>
            }
          {imageUrl && <div className={classes.image} style={{background:`url(${imageUrl})`}}/>}
          <div className={classes.statuses}>
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
            <ExploredStatus card={card} cardPosition={cardPosition}/>
          </div>
          {cardText && <div className={classes.cardText}>
            {Widget && <Widget dayCount={dayCount}/>}
            {cardText}
          </div>}
          {renderTimer && <CardTimer 
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
