import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { createUseStyles } from 'react-jss';
import { units } from '../collections/units';
import { CardPosition, handleStart } from './Game';

const useStyles = createUseStyles({
  root: {
  },
  styling: {
    margin: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 200,
    width: 120,
    cursor: "pointer",
    border: "solid 1px rgba(0,0,0,.1)",
    borderRadius: 4,
    boxShadow: '0 4px 0 0 rgba(0,0,0,0)',
    background: "white",
    transition: 'all .05s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      filter: 'saturate(1)',
    },
    filter: 'saturate(.8)',
    transform: 'scale(1)',
    '& h2': {
      margin: 0,
      fontSize: 16,
      fontWeight: 400,
      color: 'rgba(0,0,0,.6)',
      fontFamily: "Cardo"
    }
  },
  image: {
    height: 170,
    pointerEvents: 'none',
    userSelect: 'none',
  }
});

type DraggableItemProps = {
  cardPosition: CardPosition;
  onDrag: (event: DraggableEvent, data: DraggableData, i: number) => void;
  onStop: (index: number) => void;
  i: number;
};


const Card = ({cardPosition, onDrag, onStop, i}:DraggableItemProps) => {
  const classes = useStyles();
  const { slug } = cardPosition;
  const card = units[slug]
  if (!card) throw Error

  function handleDrag (event: DraggableEvent, data: DraggableData){
    onDrag(event, data, i)
  }

  return (
    <Draggable onStart={handleStart} onDrag={handleDrag} position={{x:cardPosition.x, y:cardPosition.y}}>
      <div className={classes.root}>
        <div className={classes.styling}>
          <img src={card.imageUrl} className={classes.image}/>
          <h2>{card.name}</h2>
        </div>
      </div>
    </Draggable>
  );
}

export default Card;
