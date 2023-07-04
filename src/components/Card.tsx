import React from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { createUseStyles } from 'react-jss';
import { CardPosition } from '../collections/types';
import { units } from '../collections/units';
import { handleStart } from './Game';

export const CARD_HEIGHT = 200;
export const CARD_WIDTH = 120;

const useStyles = createUseStyles({
  root: {
    display: "inline-block",
    position: "absolute",
  },
  styling: {
    padding: 16,
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    cursor: "pointer",
    border: "solid 1px rgba(0,0,0,.15)",
    outline: "solid 1px rgba(0,0,0,1)",
    borderRadius: 4,
    boxShadow: '0 4px 0 0 rgba(0,0,0,0)',
    backgroundSize: "cover !important",
    transition: 'all .1s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',
      filter: 'saturate(1)',
    },
    filter: 'saturate(.8)',
    transform: 'scale(1)',
    '& h2': {
      margin: 0,
      fontSize: 14,
      fontWeight: 400,
      color: 'rgba(0,0,0,.6)',
      fontFamily: "Papyrus"
    }
  },
  image: {
    height: 130,
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
});

type DraggableItemProps = {
  cardPositions: CardPosition[];
  onDrag: (event: DraggableEvent, data: DraggableData, i: number) => void;
  onStop: (i: number) => void;
  i: number;
  setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>
};


const Card = ({cardPositions, onDrag, onStop, i, setCardPositions}:DraggableItemProps) => {
  const classes = useStyles();
  const cardPosition = cardPositions[i];
  const { slug } = cardPosition;
  const card = units[slug]
  if (!card) throw Error
  const {name, imageUrl, whileAttached} = card

  function handleDrag (event: DraggableEvent, data: DraggableData){
    onDrag(event, data, i)
  }
  function handleStop () {
    onStop(i)
  }

  whileAttached && whileAttached(cardPositions, i, setCardPositions)
  const debugging = true

  return (
    <DraggableCore onStart={handleStart} onDrag={handleDrag} onStop={handleStop}>
      <div className={classes.root} style={{
        left: cardPosition.x, 
        top: cardPosition.y, 
        zIndex: cardPosition.zIndex,
      }}>
        <div className={classes.styling} style={{
          outlineWidth: cardPosition.maybeAttached.length ? 3 : 0,
          background: card.backgroundImage ? `url(${card.backgroundImage})` : 'white',
        }}>
          <h2>{name}</h2>
          {debugging && <div>
            <div className={classes.meta} style={{left: 5, top: 5}}>
              {i}
            </div>
            <div className={classes.meta} style={{left: 5, bottom: 5}}>
              {cardPosition.attached.length > 0 && <span>{cardPosition.attached.map((index) => `${index}`).join(",")} attached</span>}
            </div>
            <div className={classes.meta} style={{right: 5, top: 5}}>
              {cardPosition.zIndex}
            </div>
          </div>}
          {imageUrl && <img src={imageUrl} className={classes.image}/>}
        </div>
      </div>
    </DraggableCore>
  );
}

export default Card;
