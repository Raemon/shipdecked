import React, { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import { createUseStyles } from 'react-jss';
import SunDial, { isNight } from './SunDial';
import ScalingField from './ScalingField';
import Draggable, { DraggableEvent } from 'react-draggable';
import { startingCards } from '../collections/cards';
import { createCardPosition } from '../collections/spawningUtils';
import { useCardPositions } from '../collections/useCardPositions';
import { CardPosition } from '../collections/types';

export const debugging = false

export function handleStart(event: DraggableEvent) {
  event.stopPropagation();
}

const useStyles = createUseStyles({
  root: {
    backgroundSize: "cover !important", // TODO: figure out why this needs 'important'
    height: '100vh',
    width: '100vw',
    transition: 'background 3s ease-in-out',
  },
  map: {
    textAlign: 'center',
    // backgroundColor: 'white',
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    height: '400%',
    width: '400%',
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
    transition: '3s ease-in-out',
  },
  pauseScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    background: "rgba(0,0,0,.5)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 100,
    zIndex: 9999
  },
  reset: {
    position: "absolute",
    bottom: -1,
    fontFamily: "Papyrus",
    color: "white",
    right: 35,
    fontWeight: 600,
    cursor: "pointer",
    zIndex: 9999
  }
});

function Game() {
  const classes = useStyles();

  const initialCardPositions: Record<string, CardPosition> = {}

  startingCards.forEach((slug, i) => {
    const cardPosition = createCardPosition(initialCardPositions, slug, 
      Math.round(i*25+260+Math.random()*100), 
      Math.round(200+Math.random()*100))
    initialCardPositions[cardPosition.id] = cardPosition
  }); 

  // const [audio] = useState(new Audio('sounds/haunting1.mp3'));

  // useEffect(() => {
  //   const handleClick = () => {
  //     console.log("playing")
  //     if (!audio) return
  //     audio.play().catch(error => console.error("Audio play failed:", error));
  //   };

  //   document.addEventListener('click', handleClick);

  //   return () => {
  //     document.removeEventListener('click', handleClick);
  //   };
  // }, [audio]);

  const { cardPositions, setCardPositions, onDrag, onStop, isDragging } = useCardPositions(initialCardPositions);

  function removeUndefinedValues(obj: Record<string, CardPosition>): Record<string, CardPosition> {
    return Object.entries(obj).reduce((a, [k, v]) => (v === undefined ? a : {...a, [k]: v}), {});
  }
  const newCardPositions = removeUndefinedValues(cardPositions)

  useEffect(() => {
    localStorage.setItem('cardPositions', JSON.stringify(cardPositions));
  }, [cardPositions]); 

  const [dayCount, setDayCount] = useState(0);
  // const [lastMouseMoved, setLastMouseMoved] = useState(new Date().getTime());
  const [paused, setPaused] = useState(false);

  // function handleMouseMove() {
  //   setLastMouseMoved(new Date().getTime());
  // }

  // // useEffect(() => {
  // //   document.addEventListener('mousemove', handleMouseMove);
  // //   document.addEventListener('mousedown', handleMouseMove);
  // //   return () => {
  // //     document.removeEventListener('mousemove', handleMouseMove);
  // //     document.removeEventListener('mousedown', handleMouseMove);
  // //   };
  // // }, []);

  // // useEffect(() => {
  // //   function pauseCheckTimer () {
  // //     setTimeout(() => {
  // //       const mouseLastMoved = new Date().getTime() - lastMouseMoved;
  // //       if (mouseLastMoved > 10 * 1000) {
  // //         setPaused(true);
  // //       }
  // //       pauseCheckTimer()
  // //     }, 1000);
  // //   }
  // //   pauseCheckTimer()
  // // }, [lastMouseMoved]);

  // TODO: actually implement or give up on sound
  let soundEnabled = false;

  document.addEventListener('click', () => {
    soundEnabled = true;
  });

  return (
    <div className={classes.root} style={{background: isNight(dayCount) ? "Url('map2night.jpg')" : "Url('map2.jpg')"}}>
      {
        debugging &&
        <div style={{position: "absolute", top: 0, left: 0, zIndex: 9999}}>
        <button onClick={() => setPaused(!paused)}>Pause</button>
        {/* <div>Mouse moved {new Date().getTime() - lastMouseMoved}ms ago</div> */}
      </div>}
      {paused && <div className={classes.pauseScreen} onClick={() => setPaused(false)}>
        Paused
      </div>}
      <div className={classes.style} style={{
        background:isNight(dayCount) ? "rgba(200,210,220,.3)" : "rgba(220,210,200,.7)"
      }}>
        <ScalingField>
          <Draggable onStart={handleStart}>
            <div className={classes.map}>
              {Object.values(newCardPositions).map(cardPosition => {
                if (!cardPosition) return null
                return <Card key={cardPosition.id} 
                  soundEnabled={soundEnabled}
                  cardPositionInfo={{cardPositions, id:cardPosition.id, setCardPositions}} 
                  onDrag={onDrag} 
                  onStop={onStop}
                  paused={paused}
                  isDragging={isDragging}
                  dayCount={dayCount}
                />
              })}
            </div>
          </Draggable>
        </ScalingField>
      </div>
      <SunDial dayCount={dayCount} setDayCount={setDayCount} />
      <div className={classes.reset} onClick={() => setCardPositions(initialCardPositions)}>New Game</div>
    </div>
  );
}

export default Game;
