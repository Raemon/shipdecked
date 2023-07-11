import { useState, useCallback } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { getCardDimensions } from '../components/Card';
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


export const isOverlapping = (cardPositions: Record<string, CardPosition>, i: string, j: string) => {
  const cardsAreDifferent = i !== j;
  const { width, height } = getCardDimensions(cardPositions[i])

  const cardsOverlapHorizontally = Math.abs(cardPositions[i].x - cardPositions[j].x) < width;
  const cardsOverlapVertically = Math.abs(cardPositions[i].y - cardPositions[j].y) < height;
  const cardsOverlap = cardsOverlapHorizontally && cardsOverlapVertically;
  return cardsAreDifferent && cardsOverlap;
}
  
// find an overlapping card wiht
export const getAttachedIndexes = (cardPositions: Record<string, CardPosition>, id: string) => {
  let attachedCardIndex: string|undefined = undefined
   Object.keys(cardPositions).forEach(id2 => {
    if (isOverlapping(cardPositions, id, id2)) {
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
}

interface GridPosition {
  x: number;
  y: number;
}

export const findNearestNonOverlappingSpace = (cardPositions: Record<string, CardPosition>, currentId: string): GridPosition => {
  const currentCard = cardPositions[currentId];
  if (!currentCard) return {x: 0, y: 0}
  const { width: cardWidth, height: cardHeight } = getCardDimensions(currentCard);

  // Start searching from the card's current position
  const queue: GridPosition[] = [{ x: currentCard.x, y: currentCard.y }];

  while (queue.length > 0) {
    const currentPos = queue.shift()!; // It's safe to use '!' because we check that queue.length > 0

    // Check if the current position overlaps with any other card
    const isOverlapping = Object.values(cardPositions).some(({ x, y, id }) => {
      if (id === currentId) return false; // Don't check the card against itself

      const { width, height } = getCardDimensions(cardPositions[id]);

      const horizontalOverlap = Math.abs(currentPos.x - x) < Math.max(cardWidth, width);
      const verticalOverlap = Math.abs(currentPos.y - y) < Math.max(cardHeight, height);

      return horizontalOverlap && verticalOverlap;
    });

    if (!isOverlapping) {
      // If it doesn't overlap, return the current position
      return currentPos;
    } else {
      // Otherwise, enqueue the neighboring positions
      queue.push(
        { x: currentPos.x - 1, y: currentPos.y },
        { x: currentPos.x + 1, y: currentPos.y },
        { x: currentPos.x, y: currentPos.y - 1 },
        { x: currentPos.x, y: currentPos.y + 1 }
      );
    }
  }

  // If no non-overlapping position was found, return the card's current position
  // (this should never happen unless the grid is completely filled)
  return { x: currentCard.x, y: currentCard.y };
};

export const getOverlappingCards = (cardPositions: Record<string, CardPosition>, id: string) => {
  const overlappingCards: CardPosition[] = []
  Object.keys(cardPositions).forEach(id2 => {
    if (isOverlapping(cardPositions, id, id2)) {
      overlappingCards.push(cardPositions[id2])
    }
  })
  return overlappingCards;
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
    const attachedCardIndexes = getAttachedIndexes(cardPositions, index);
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

  const onDrag = useCallback((event: DraggableEvent, data: DraggableData, i: string) => {
    const newPositions = {...cardPositions};
    const cardPosition = cardPositions[i];
    newPositions[i] = { ...cardPosition, 
      x: cardPosition.x + data.deltaX,
      y: cardPosition.y + data.deltaY,
      maybeAttached: getAttachedIndexes(cardPositions, i),
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
        if (isOverlapping(cardPositions, i, j)) attached.push(j)
      }
      if (attached.length === 0) {
        newPositions[i].attached = []
      }
    })

    setCardPositions(newPositions);
  }, [cardPositions, getAttachedIndexes]);

  return { cardPositions, setCardPositions, onDrag, onStop };
}