import React, { useState } from 'react';
import Card from './Card';
import { createUseStyles } from 'react-jss';
import SunDial from './SunDial';
import ScalingField from './ScalingField';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

export type CardPosition = {
  slug: string;
  x: number;
  y: number;
  attached: boolean;
};

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
    display: 'flex',
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
    { slug: 'villager1', x: 0, y: 0, attached: false }, 
    { slug: 'villager2', x: 200, y: 200, attached: false },
    { slug: 'tree', x: 300, y: 200, attached: false }
  ]);
  const [attached, setAttached] = useState<number[]>([]);
  const onDrag = (event: DraggableEvent, data: DraggableData, i: number) => {
    // console.log(data.x, data.y);
    const newPositions = [...cardPositions];
    newPositions[i] = { ...cardPositions[i], x: data.x, y: data.y };
    setCardPositions(newPositions);
  };

  const onStop = (index: number) => {
    // Check if the elements are close enough to be considered "attached"
    console.log(index)
    for (let i = 0; i < cardPositions.length; i++) {
      if (i !== index && Math.abs(cardPositions[i].x - cardPositions[index].x) < 50 && Math.abs(cardPositions[i].y - cardPositions[index].y) < 50) {
        setAttached([...attached, i]);
      }
    }
  };
  
  return (
    <div className={classes.root}>
      <div className={classes.style}>
        <ScalingField>
          <Draggable onStart={handleStart}>
            <div className={classes.map}>
              {cardPositions.map((cardPosition, i) => {
                return <Card cardPosition={cardPosition} key={i} onDrag={onDrag} onStop={onStop} i={i}/>
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
