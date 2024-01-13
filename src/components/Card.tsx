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
import { findNonoverlappingDirection, getNewCardPosition, getOverlappingNonattachedCards, isOverlapping, moveTowardsDestination, STACK_OFFSET_X, STACK_OFFSET_Y } from '../collections/useCardPositions';
import { StaminaStatus } from './Statuses/StaminaStatus';
import DecayStatus from './Statuses/DecayStatus';

export const LARGE_CARD_WIDTH = 132
export const LARGE_CARD_HEIGHT = 220
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
    border: "solid 1px #aaa",
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
    fontFamily: "Palatino",
    lineHeight: "1.3em",
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
  onDrag: (event: DraggableEvent, data: DraggableData, id: string) => void;
  onStop: (id: string) => void;
  paused: boolean;
  isDragging: boolean;
};


const Card = ({onDrag, onStop, cardPositionInfo, paused, isDragging}:CardProps) => {
  const classes = useStyles();
  const {cardPositions, id, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[id];
  const numberOverlappingCards = getOverlappingNonattachedCards(cardPositions, id).length
  
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

  function updateAttribute (attribute: keyof AttributeInfo, interval=3000) {
    setTimeout(() => {
      if (!cardPosition) return
      if (cardPosition[attribute] === 0) {
        setCardPositions((cardPositions: Record<string, CardPosition>,) => {
          const newCardPositions = {...cardPositions}
          delete newCardPositions[id]
          return newCardPositions
        })
      }
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        try {
          const current = cardPosition[attribute]
          if (!paused && current && current > 0) {
            return { ...cardPosition, [attribute]: current - 1 };
          } else {
            return {
              ...cardPosition,
              name: cardPosition.name
            }
          }
        } catch (err) {
          console.log(err)
          console.log({cardPosition, attribute})
        }
        return cardPosition;
      });
    }, interval);
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

  const updateDecaying = useCallback(() => {
    updateAttribute('currentDecay')
  }, [cardPositionInfo, cardPosition])

  const updateFading = useCallback(() => {
    updateAttribute('currentFading', 10)
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
      if (!trackedCardId) return
      const trackedCard = cardPositions[trackedCardId]
      if (!trackedCard) return
      updateCardPosition(cardPositionInfo, (cardPosition: CardPosition): CardPosition => {
        let newX = cardPosition.x
        let newY = cardPosition.y
        if (!isOverlapping(cardPositions, trackedCard.id, cardPosition.id)) {
          if (trackedCard.x > cardPosition.x) {
            newX = Math.round(cardPosition.x + (Math.random()*10+5))
          } else if (trackedCard.x < cardPosition.x) {
            newX = Math.round(cardPosition.x - (Math.random()*10+5))
          }
          if (trackedCard.y > cardPosition.y) {
            newY = Math.round(cardPosition.y + (Math.random()*10+5))
          } else if (trackedCard.y < cardPosition.y) {
            newY = Math.round(cardPosition.y - (Math.random()*10+5))
          }
        }
        return {
          ...getNewCardPosition(cardPositions, cardPosition.id),
          x: newX,
          y: newY,
        }
      });
    }, 1000);
  }, [trackedCardId, cardPosition.tracks, cardPosition.x, cardPosition.y])

  // const loot = cardPosition.loot && Object.values(cardPosition.loot).flatMap((item) => item)

  const offsetStackSize = getAttachedCardsWithHigherZIndex(cardPositions, id).length
  const progressBarOffsetX = offsetStackSize * STACK_OFFSET_X
  const progressBarOffsetY = offsetStackSize * STACK_OFFSET_Y

  if (!cardPosition) return null

  const { slug, timerEnd, timerStart, name, imageUrl, currentSpawnDescriptor, maxHunger, maxDecay,    
    currentDecay,currentHunger, cardText, currentFuel, maxFuel, maxStamina, currentStamina, spawningStack } = cardPosition;
  const card = units[slug]
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
                </div>
                <div className={classes.meta} style={{right: 5, top: 5}}>
                  {cardPosition.destinationX}, {cardPosition.destinationY}
                </div> */}

                {/* <div className={classes.meta} style={{left: 5, top: 5}}>
                  {id}
                </div>
                <div className={classes.meta} style={{left: 5, bottom: 5}}>
                  {cardPosition.attached.length > 0 && <span>
                    {cardPosition.attached.map((index) => `${index}`).join(",")}
                  </span>}
                </div>
                <div className={classes.meta} style={{right: 5, top: 5}}>
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
          </div>

          {cardText && <div className={classes.cardText}>
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
