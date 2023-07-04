import React, { useState } from 'react';
import Card, { CARD_HEIGHT, CARD_WIDTH } from './Card';
import { createUseStyles } from 'react-jss';
import SunDial from './SunDial';
import ScalingField from './ScalingField';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { units } from '../collections/units';
import { CardPosition } from '../collections/types';
import { createCardPosition } from '../collections/utils';

export function handleStart(event: DraggableEvent) {
  event.stopPropagation();
}

const useStyles = createUseStyles({
  root: {
    backgroundSize: "cover",
    background: "Url('map2.jpg')",
    height: '100vh',
    width: '100vw',
  },
  map: {
    textAlign: 'center',
    // backgroundColor: 'white',
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    height: '100%',
    width: '100%'
  },
  style: {
    border: 'solid 1px rgba(0,0,0,.2)',
    boxShadow: '0 40px 40px 0 rgba(0,0,0,0)',
    width: '95%',
    height: '95vh',
    position: "relative",
    top: '2.5vh',
    left: '2.5%',
    borderRadius: 6,
    overflow: "hidden",
    background: "rgba(255,255,255,.5)"
  }
});

function Game() {
  const classes = useStyles();
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([
    'villager2',
    'path1',
  ].map((slug, i) => createCardPosition(slug, i*160+250+Math.random()*200, 200+Math.random()*100)));

  const isAttached = (i: number) => {
    const attachedCards = []
    for (let j = 0; j < cardPositions.length; j++) {
      if (i !== j && Math.abs(cardPositions[i].x - cardPositions[j].x) < CARD_WIDTH && Math.abs(cardPositions[i].y - cardPositions[j].y) < CARD_HEIGHT) {
        attachedCards.push(j);
      }
    }
    return attachedCards;
  };

  const onDrag = (event: DraggableEvent, data: DraggableData, i: number) => {
    const newPositions = [...cardPositions];
    const cardPosition = cardPositions[i];
    newPositions[i] = { ...cardPosition, 
      x: cardPosition.x + data.deltaX,
      y: cardPosition.y + data.deltaY,
      maybeAttached: isAttached(i)
    };
    setCardPositions(newPositions);
  };

  function getZIndex(cardPosition: CardPosition, attachedCardIndices: number[]): number {
    const greatestAttachedZIndex = attachedCardIndices.reduce((acc, i) => {
      return Math.max(acc, cardPositions[i].zIndex);
    }, 0);
    const defaultZIndex = units[cardPosition.slug].defaultZindex;
    if (greatestAttachedZIndex === 0) {
      return defaultZIndex;
    } else {
      return defaultZIndex + greatestAttachedZIndex + 1;
    }
  }

  function getIndexOfHighestAttachedZIndex (attachedCardIndices: number[]): number|undefined {
    let highestAttachedZIndex = 0;
    let highestAttachedIndex = undefined;
    attachedCardIndices.forEach((i) => {
      const zIndex = cardPositions[i].zIndex;
      if (zIndex > highestAttachedZIndex) {
        highestAttachedZIndex = zIndex;
        highestAttachedIndex = i;
      }
    });
    return highestAttachedIndex;
  }

  function getNewCardPosition (index: number): CardPosition {
    const cardPosition = cardPositions[index];  
    const attachedCardIndices = isAttached(index);
    const newCardData = { ...cardPosition,
      zIndex: getZIndex(cardPosition, attachedCardIndices),
      maybeAttached: [],
      attached: attachedCardIndices,
    }
    const attachedCardIndex = getIndexOfHighestAttachedZIndex(attachedCardIndices);
    if (attachedCardIndex !== undefined) {
      newCardData.x = cardPositions[attachedCardIndex].x + 15
      newCardData.y = cardPositions[attachedCardIndex].y + 30
    }
    return newCardData;
  }

  function onStop (index: number) {
    const newPositions = [...cardPositions];
    const newCardPosition = getNewCardPosition(index);
    newPositions[index] = newCardPosition;
    setCardPositions(newPositions);
  }
  
  return (
    <div className={classes.root}>
      <div className={classes.style}>
        <ScalingField>
          <Draggable onStart={handleStart}>
            <div className={classes.map}>
              {cardPositions.map((cardPosition, i) => {
                return <Card cardPositions={cardPositions} key={i} onDrag={onDrag} onStop={onStop} i={i} setCardPositions={setCardPositions}/>
              })}
            </div>
          </Draggable>
        </ScalingField>
      </div>
      <SunDial />
    </div>
  );
}

export default Game;
