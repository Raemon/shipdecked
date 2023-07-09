import { useState, useCallback } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { CARD_HEIGHT, CARD_WIDTH, LARGE_CARD_HEIGHT, LARGE_CARD_WIDTH } from '../components/Card';
import { CardPosition } from './types';

export const STACK_OFFSET_X = 10;
export const STACK_OFFSET_Y = 30;

// function addIfNotInArray (array: number[], value: number): number[] {
//   if (array.indexOf(value) === -1) {
//     return [...array, value];
//   } else {
//     return array;
//   }
// }

// Create the custom hook for card positions
export function useCardPositions(initialPositions: CardPosition[]) {
  const [cardPositions, setCardPositions] = useState(() => {
    // Try to load from local storage
    const savedState = localStorage.getItem('cardPositions');
    const jsonParsedState = savedState !== null ? JSON.parse(savedState) : initialPositions;
    const validState = jsonParsedState.map((cardPosition: CardPosition) => cardPosition) as CardPosition[]

    return initialPositions;
  });

  function getZIndex(cardPosition: CardPosition, attachedCardIndices: number[]): number {
    const greatestAttachedZIndex = attachedCardIndices.reduce((acc, i) => {
      return Math.max(acc, cardPositions[i].zIndex);
    }, 0);
    const zIndex = 1
    if (greatestAttachedZIndex === 0) {
      return zIndex;
    } else {
      return zIndex + greatestAttachedZIndex + 1;
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
    clearTimeout(cardPosition.timerId);
    const newCardData = { ...cardPosition,
      zIndex: getZIndex(cardPosition, attachedCardIndices),
      maybeAttached: [],
      timerEnd: undefined,
      timerStart: undefined,
      timerId: undefined,
      attached: attachedCardIndices,
    }
    const attachedCardIndex = getIndexOfHighestAttachedZIndex(attachedCardIndices);
    if (attachedCardIndex !== undefined) {
      console.log(cardPositions[attachedCardIndex])
      newCardData.x = cardPositions[attachedCardIndex].x + STACK_OFFSET_X;
      newCardData.y = cardPositions[attachedCardIndex].y + STACK_OFFSET_Y;
    }
    return newCardData;
  }

  // find an overlapping card wiht
  const isAttached = useCallback((i: number) => {
    let attachedCardIndex: number|undefined = undefined
    for (let j = 0; j < cardPositions.length; j++) {
      const cardsAreDifferent = i !== j;
      const width = cardPositions[j].large ? LARGE_CARD_WIDTH : CARD_WIDTH;
      const height = cardPositions[j].large ? LARGE_CARD_HEIGHT : CARD_HEIGHT;
      
      const cardsOverlapHorizontally = Math.abs(cardPositions[i].x - cardPositions[j].x) < width;
      const cardsOverlapVertically = Math.abs(cardPositions[i].y - cardPositions[j].y) < height;
      const cardsOverlap = cardsOverlapHorizontally && cardsOverlapVertically;

      if (cardsAreDifferent && cardsOverlap) {
        if (!attachedCardIndex) {
          attachedCardIndex = j;
        } else if (cardPositions[j].zIndex > cardPositions[attachedCardIndex].zIndex) {
          attachedCardIndex = j;
        }
      }
    }
    if (attachedCardIndex !== undefined) {
      return [attachedCardIndex, ...cardPositions[attachedCardIndex].attached];
    } else {
      return []
    }
  }, [cardPositions]);

  const onDrag = useCallback((event: DraggableEvent, data: DraggableData, i: number) => {
    const newPositions = [...cardPositions];
    const cardPosition = cardPositions[i];
    newPositions[i] = { ...cardPosition, 
      x: cardPosition.x + data.deltaX,
      y: cardPosition.y + data.deltaY,
      maybeAttached: isAttached(i),
      zIndex: 1000000
    };
    
    setCardPositions(newPositions);
  }, [cardPositions, isAttached]);

  const onStop = useCallback((index: number) => {
    const newPositions = [...cardPositions];
    // const oldCardPosition = cardPositions[index];
    const newCardPosition = getNewCardPosition(index);
    newPositions[index] = newCardPosition;

    // disabled till I figured out all edge cases
    // newCardPosition.attached.forEach((i) => {
    //   newPositions[i] = {
    //     ...getNewCardPosition(i),
    //     attached: addIfNotInArray(newPositions[i].attached, index)
    //   }
    // })

    setCardPositions(newPositions);
  }, [cardPositions, isAttached]);

  return { cardPositions, setCardPositions, onDrag, onStop };
}