import { useState, useCallback } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { CARD_HEIGHT, CARD_WIDTH, LARGE_CARD_HEIGHT, LARGE_CARD_WIDTH } from '../components/Card';
import { CardPosition } from './types';

export const STACK_OFFSET_X = 10;
export const STACK_OFFSET_Y = 30;

function addIfNotInArray (array: string[], value: string): string[] {
  if (array.indexOf(value) === -1) {
    return [...array, value];
  } else {
    return array;
  }
}

// Create the custom hook for card positions
export function useCardPositions(initialPositions: Record<string, CardPosition>) {
  const [cardPositions, setCardPositions] = useState<Record<string, CardPosition>>(() => {
    // Try to load from local storage
    // const savedState = localStorage.getItem('cardPositions');
    // const jsonParsedState = savedState !== null ? JSON.parse(savedState) : initialPositions;
    // const validState = jsonParsedState.map((cardPosition: CardPosition) => cardPosition) as CardPosition[]

    return initialPositions;
  });

  function getZIndex(cardPosition: CardPosition, attachedCardIndices: string[]): number {
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

  function getIndexOfHighestAttachedZIndex (attachedCardIndices: string[]): string|undefined {
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

function getNewCardPosition (index: string): CardPosition {
    const cardPosition = cardPositions[index];  
    const attachedCardIndexes = getAttachedIndexes(index);
    clearTimeout(cardPosition.timerId);
    const newCardData = { ...cardPosition,
      zIndex: getZIndex(cardPosition, attachedCardIndexes),
      maybeAttached: [],
      timerEnd: undefined,
      timerStart: undefined,
      timerId: undefined,
      attached: attachedCardIndexes,
    }
    const attachedCardIndex = getIndexOfHighestAttachedZIndex(attachedCardIndexes);
    if (attachedCardIndex !== undefined) {
      newCardData.x = cardPositions[attachedCardIndex].x + STACK_OFFSET_X;
      newCardData.y = cardPositions[attachedCardIndex].y + STACK_OFFSET_Y;
    }
    return newCardData;
  }

  const isAttached = (cardPositions: Record<string, CardPosition>, i: string, j: string) => {
    const cardsAreDifferent = i !== j;
    const width = cardPositions[j].large ? LARGE_CARD_WIDTH : CARD_WIDTH;
    const height = cardPositions[j].large ? LARGE_CARD_HEIGHT : CARD_HEIGHT;
    
    const cardsOverlapHorizontally = Math.abs(cardPositions[i].x - cardPositions[j].x) < width;
    const cardsOverlapVertically = Math.abs(cardPositions[i].y - cardPositions[j].y) < height;
    const cardsOverlap = cardsOverlapHorizontally && cardsOverlapVertically;
    return cardsAreDifferent && cardsOverlap;
  }
    
  // find an overlapping card wiht
  const getAttachedIndexes = useCallback((id: string) => {
    let attachedCardIndex: string|undefined = undefined
     Object.keys(cardPositions).forEach(id2 => {
      if (isAttached(cardPositions, id, id2)) {
        if (!attachedCardIndex) {
          attachedCardIndex = id2;
        } else if (cardPositions[id2].zIndex > cardPositions[attachedCardIndex].zIndex) {
          attachedCardIndex = id2;
        }
      }
     })
    if (attachedCardIndex !== undefined) {
      const otherAttachedCards = cardPositions[attachedCardIndex].attached.filter((j) => j !== id);
      return [attachedCardIndex, ...otherAttachedCards];
    } else {
      return []
    }
  }, [cardPositions]);

  const onDrag = useCallback((event: DraggableEvent, data: DraggableData, i: string) => {
    const newPositions = {...cardPositions};
    const cardPosition = cardPositions[i];
    newPositions[i] = { ...cardPosition, 
      x: cardPosition.x + data.deltaX,
      y: cardPosition.y + data.deltaY,
      maybeAttached: getAttachedIndexes(i),
      zIndex: 1000000
    };
    
    setCardPositions(newPositions);
  }, [cardPositions, getAttachedIndexes]);

  const onStop = useCallback((index: string) => {
    const newPositions = {...cardPositions};
    const newCardPosition = getNewCardPosition(index);
    newPositions[index] = newCardPosition;

    newCardPosition.attached.forEach((id) => {
      newPositions[id].attached = addIfNotInArray(newPositions[id].attached, index)
    })

    const cardsNoLongerAttachedToIndex = cardPositions[index].attached.filter((id) => {
      return newCardPosition.attached.indexOf(id) === -1;
    });

    cardsNoLongerAttachedToIndex.forEach((id) => {
      newPositions[id].attached = newPositions[id].attached.filter((j) => j !== index);
    });

    // find less janky way to do this
    Object.keys(cardPositions).forEach((i) => {
      const attached = []
      for (const j in cardPositions) {
        if (isAttached(cardPositions, i, j)) attached.push(j)
      }
      if (attached.length === 0) {
        newPositions[i].attached = []
      }
    })

    setCardPositions(newPositions);
  }, [cardPositions, getAttachedIndexes]);

  return { cardPositions, setCardPositions, onDrag, onStop };
}