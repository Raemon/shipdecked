import React, { useState } from 'react';
import Card from './Card';
import { createUseStyles } from 'react-jss';
import SunDial from './SunDial';
import ScalingField from './ScalingField';
import Draggable, { DraggableEvent } from 'react-draggable';
import { startingCards } from '../collections/cards';
import { createCardPosition } from '../collections/spawning';
import { useCardPositions } from '../collections/useCardPositions';

export const debugging = false

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
    background: "rgba(220,210,200,.7)",
  }
});

function Game() {
  const classes = useStyles();
  const [dayCount, setDayCount] = useState(0);

  const initialCardPositions = startingCards.map((slug, i) => createCardPosition(slug, i*160+260+Math.random()*100, 200+Math.random()*100));

  const { cardPositions, setCardPositions, onDrag, onStop } = useCardPositions(initialCardPositions);

  return (
    <div className={classes.root}>
      <div className={classes.style}>
        <ScalingField>
          <Draggable onStart={handleStart}>
            <div className={classes.map}>
              {cardPositions.map((cardPosition, i) => {
                return <Card key={i} 
                  cardPositionInfo={{cardPositions, i, setCardPositions}} 
                  onDrag={onDrag} 
                  onStop={onStop}
                />
              })}
            </div>
          </Draggable>
        </ScalingField>
      </div>
      <SunDial dayCount={dayCount} setDayCount={setDayCount} />
    </div>
  );
}

export default Game;
