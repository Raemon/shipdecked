import { useState, useCallback } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { getCardDimensions } from '../components/Card';
import { CardPosition } from './types';

export const STACK_OFFSET_X = 14;
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
  

// Attach the card to the overlapping card with a highest z-index, and all of it's attached cards
export const getAttachedIndexes = (cardPositions: Record<string, CardPosition>, id: string) => {
  let attachedCardIndex: string|undefined = undefined
  
  // find the highest z-index of the overlapping cards
  Object.keys(cardPositions).forEach(id2 => {
    if (isOverlapping(cardPositions, id, id2)) {
      if (!attachedCardIndex) {
        attachedCardIndex = id2;
      } else if (cardPositions[id2].zIndex > cardPositions[attachedCardIndex].zIndex) {
        attachedCardIndex = id2;
      }
    }
  })
  
  // if there is an overlapping card, include the attached cards of that card
  if (attachedCardIndex !== undefined) {
    const otherAttachedCards = cardPositions[attachedCardIndex].attached.filter((j) => j !== id);
    return [attachedCardIndex, ...otherAttachedCards];
  } else {
    return []
  }
}

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

  function getZIndex(cardPosition: CardPosition, cardPositions: Record<string, CardPosition>): number {
    const greatestAttachedIndex = getIndexOfHighestAttachedZIndex(cardPosition.attached, cardPosition.zIndex)
    if (greatestAttachedIndex === undefined) return 1
    return cardPositions[greatestAttachedIndex].zIndex + 1
  }

  // gets the index of the highest attached card with a lower z-index than the card being dragged

  function getIndexOfHighestAttachedZIndex (attachedCardIndices: string[], cardZindex: number): string|undefined {
    let highestAttachedZIndex = 0;
    let highestAttachedIndex = undefined;
    attachedCardIndices.forEach((i) => {
      const zIndex = cardPositions[i].zIndex;
      if (zIndex > highestAttachedZIndex && zIndex < cardZindex) {
        highestAttachedZIndex = zIndex;
        highestAttachedIndex = i;
      }
    });
    return highestAttachedIndex;
  }


  const onDrag = useCallback((event: DraggableEvent, data: DraggableData, id: string) => {
    const newPositions = {...cardPositions};
    const cardPosition = cardPositions[id];

    const attachedCards = cardPosition.attached.map((i) => cardPositions[i]);
    const attachedCardsWithGreaterZIndex = attachedCards.filter((card) => card.zIndex > cardPosition.zIndex && card.id !== id)
    
    attachedCardsWithGreaterZIndex.forEach((c) => {
      newPositions[c.id].x = c.x + data.deltaX;
      newPositions[c.id].y = c.y + data.deltaY;
      newPositions[c.id].zIndex = 1000000 + cardPositions[c.id].zIndex - cardPosition.zIndex
    })

    newPositions[id] = { ...cardPosition, 
      x: cardPosition.x + data.deltaX,
      y: cardPosition.y + data.deltaY,
      maybeAttached: getAttachedIndexes(cardPositions, id),
      transition: false,
      zIndex: 1000000
    };
    
    setCardPositions(newPositions);
  }, [cardPositions, getAttachedIndexes]);

  function getNewCardPosition (index: string): CardPosition {
    const cardPosition = cardPositions[index];  
    const attachedCardIndexes = getAttachedIndexes(cardPositions, index);
    clearTimeout(cardPosition.timerId);
    const newCardData = { ...cardPosition,

      maybeAttached: [],
      timerEnd: undefined,
      timerStart: undefined,
      timerId: undefined,
      attached: attachedCardIndexes,
    }
    const attachedCardIndex = getIndexOfHighestAttachedZIndex(attachedCardIndexes, cardPosition.zIndex);
    if (attachedCardIndex !== undefined) {
      newCardData.x = cardPositions[attachedCardIndex].x + STACK_OFFSET_X;
      newCardData.y = cardPositions[attachedCardIndex].y + STACK_OFFSET_Y;
    }
    return newCardData;
  }

  const onStop = useCallback((index: string) => {
    const newPositions = {...cardPositions};  
    const newCardPosition = getNewCardPosition(index);


    newPositions[index] = newCardPosition;
    newPositions[index].zIndex = getZIndex(newCardPosition, cardPositions)

    const attachedCardIndexes = getAttachedIndexes(cardPositions, index);
    newPositions[index].attached = attachedCardIndexes;
    
    // .zIndex = getZIndex(newCardPosition, attachedCardIndexes);

    // 





    newCardPosition.attached.forEach((j) => {
      newPositions[j].attached = addIfNotInArray(newPositions[j].attached, index)
    })

    const cardsNoLongerAttachedToIndex = cardPositions[index].attached.filter((i) => {
      return newCardPosition.attached.indexOf(i) === -1;
    });

    cardsNoLongerAttachedToIndex.forEach((id) => {
      newPositions[id].attached = newPositions[id].attached.filter((j) => j !== index);
      newPositions[id].zIndex = 1
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