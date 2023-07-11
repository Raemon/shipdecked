import sample from "lodash/sample"
import { CardPosition, CardPositionInfo } from "./types"
import { CardSlug, units } from "./cards"
import { filter, includes, some } from "lodash"
import { findNearestNonOverlappingSpace } from "./useCardPositions";

export const randomHexId = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

export function createCardPosition(slug: CardSlug, x: number, y: number): CardPosition {
  const card = units[slug]
  return {
    slug,
    timerEnd: undefined,
    timerStart: undefined,
    timerId: undefined,
    attached: [],
    maybeAttached: [],
    zIndex: 1,
    currentHunger: card.maxHunger ? card.maxHunger/2 - 1: undefined,
    currentFuel: card.maxFuel ? card.maxFuel/2 - 1: undefined,
    currentStamina: card.maxStamina ? card.maxStamina/1.5 - 1: undefined,
    currentFading: card.maxFading,
    x,
    y,
    ...card,
    id: randomHexId(),
  }
}

export function getAttachedCardsSortedByZIndex (cardPositionInfo: CardPositionInfo) {
  const { cardPositions, id } = cardPositionInfo
  const cardPosition = cardPositions[id]
  const attachedCardIds = cardPosition.attached
  const attachedCards = attachedCardIds.map((id) => cardPositions[id])
  return attachedCards.sort((a, b) => b.zIndex - a.zIndex)
}

export const updateCardPosition = (
  cardPositionInfo: CardPositionInfo, 
  updateFunction: (cardPosition: CardPosition) => CardPosition
) => {
  const { setCardPositions, id } = cardPositionInfo
  setCardPositions((prevCardPositions: Record<string, CardPosition>) => {
    const newCardPositions = {...prevCardPositions};
    if (newCardPositions[id]) {
      const cardPosition = newCardPositions[id];
      newCardPositions[id] = updateFunction(cardPosition);
    }
    return newCardPositions;
  });
};

function spawnNearby(slug: CardSlug, parent: CardPosition, i?: number) {
  if (i) return spawnInSemiCircle(slug, parent, i)
  return createCardPosition(slug,
    parent.x+100 + Math.random() * 50,
    parent.y+15 + Math.random() * 50
  )
}

function spawnInSemiCircle(slug: CardSlug, parent: CardPosition, i = 0, radius = 180, angleIncrement: number = Math.PI / 6) {
  // Calculate the angle for the current card
  const angle = i * angleIncrement;

  // Calculate the new position using the circle's equation
  const x = parent.x + radius * Math.cos(angle) + Math.random() * 50;
  const y = parent.y + radius * Math.sin(angle) + Math.random() * 50;

  // Create and return the new card position
  return createCardPosition(slug, x, y);
}

function getLoot (cardPositions: Record<string, CardPosition>, index: string, slug: CardSlug) {
  const cardPosition = cardPositions[index]
  const attachedId = cardPosition.attached.find(i => cardPositions[i].slug === slug)
  const loot = typeof attachedId === "string" && cardPositions[attachedId].loot
  const lootStack = loot && filter(loot, (lootStack) => lootStack.length > 0 )

  const spawnSlug = lootStack && sample(lootStack)

  return { spawnSlug, attachedId }
}

const removeOneInstance = (arr: CardSlug[], itemToRemove: CardSlug) => {
  const index = arr.indexOf(itemToRemove);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
};

function popOffCard(cardPositionInfo: CardPositionInfo) {
  const { cardPositions, id } = cardPositionInfo
  return {
    ...cardPositions[id],
    attached: [],
    x: cardPositions[id].x - 50 - Math.random() * 50,
    y: cardPositions[id].y + 15 + Math.random() * 50,
    timerEnd: undefined,
    timerStart: undefined,
    timerId: undefined,
    spawningStack: undefined
  }
}

export function getAttachedCardsWithHigherZIndex (cardPositions: Record<string, CardPosition>, id: string) {
  const cardPosition = cardPositions[id]
  const attachedCardIds = cardPosition.attached
  const attachedCards = attachedCardIds.map((id) => cardPositions[id])
  const attachedCardsWithHigherZIndex = attachedCards.filter(attachedCard => {
    try {
      return attachedCard.zIndex > cardPosition.zIndex
    } catch(err) {
      console.log(err)
      console.log({attachedCards, attachedCard, cardPosition})
    }
  })
  return attachedCardsWithHigherZIndex.sort((a, b) => b.zIndex - a.zIndex)
}

// function containsAll(arr1: string[], arr2: string[]): boolean {
//   return arr2.every(arr2Item => arr1.includes(arr2Item));
// }

function areArraysIdentical<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
      return false;
  }

  const sortedArr1 = arr1.sort();
  const sortedArr2 = arr2.sort();

  for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
          return false;
      }
  }

  return true;
}

export function spawnTimerFromLoot({attachedSlug, duration, cardPositionInfo, preserve, descriptor}:{attachedSlug: CardSlug, duration: number, cardPositionInfo: CardPositionInfo, preserve?: boolean, descriptor?: string}) {
  const { cardPositions, id } = cardPositionInfo
  const cardPosition = cardPositions[id]
  const attachedSlugs = cardPosition.attached.map(i => cardPositions[i].slug)
  const spawnSlug = getLoot(cardPositions, id, attachedSlug).spawnSlug
  if (attachedSlugs.includes(attachedSlug) && !cardPosition.timerEnd && spawnSlug) {
    const timerId = setTimeout(() => spawnFromLoot({attachedSlug, cardPositionInfo, preserve}), duration);
    const attachedSpawnDescriptor = descriptor ?? units[attachedSlug].spawnDescriptor
    
    return updateCardPosition(cardPositionInfo, (cardPosition) => ({
      ...cardPosition, 
      timerId: timerId,
      timerStart: new Date(), 
      timerEnd: new Date(Date.now() + duration),
      spawningStack: [spawnSlug],
      currentSpawnDescriptor: attachedSpawnDescriptor
   }))
  }
  return cardPositionInfo
}

export function spawnFromLoot({attachedSlug, cardPositionInfo, preserve}:{attachedSlug: CardSlug, cardPositionInfo: CardPositionInfo, preserve?: boolean, output?: CardSlug|CardSlug[]}) {
  const { cardPositions, id, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[id]
  if (!cardPositions[id]) return

  setCardPositions(prevCardPositions => {
    const { spawnSlug, attachedId } = getLoot(prevCardPositions, id, attachedSlug)

    if (spawnSlug && attachedId) {
      console.log("spawning from loot", {attachedId, attachedSlug, cardPositionInfo})
      const newCardPositions = {...prevCardPositions}

      const oldAttached = cardPositions[attachedId]
      const oldSpawnItems = [...(oldAttached.loot ?? [])]
      let newSpawnItems = removeOneInstance(oldSpawnItems, spawnSlug)
      let secondaryLoot = oldAttached.secondaryLoot ?? []

      newCardPositions[id] = popOffCard(cardPositionInfo)

      const newCardPosition = spawnNearby(spawnSlug, cardPosition)
      newCardPositions[newCardPosition.id] = newCardPosition

      // If there are no more items to spawn, add the secondary loot
      if (newSpawnItems.length === 0 && secondaryLoot.length > 0) {
        newSpawnItems = secondaryLoot
        secondaryLoot = []
      }

      newCardPositions[attachedId] = {
      ...cardPositions[attachedId],
        loot: newSpawnItems,
        secondaryLoot
      }

      // If there are no more items to spawn even , remove the attached card
      
      if (newSpawnItems.length === 0 && !preserve) {
        delete newCardPositions[attachedId]
      }
      return newCardPositions;
    } else {
      return prevCardPositions;
    }
  })
}

export function spawnTimerFromSet({inputStack, output, duration, cardPositionInfo, descriptor, preserve, consumeInitiator, skipIfExists}:{
  inputStack: CardSlug[], 
  output: CardSlug|CardSlug[], 
  duration: number, 
  cardPositionInfo: CardPositionInfo, 
  descriptor: string,
  skipIfExists?: CardSlug[]
  preserve?: boolean,
  consumeInitiator?: boolean
}) {
  const { cardPositions, id, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[id] 
  const attachedSlugs = cardPosition.attached.map(i => cardPositions[i].slug)

  const completeStack = areArraysIdentical(attachedSlugs, inputStack)

  const allSlugs = Object.values(cardPositions).map(cardPosition => cardPosition.slug)
  const alreadySpawned = skipIfExists && some(skipIfExists, function(item) {
    return includes(allSlugs, item);
  });

  if (completeStack && !cardPosition.timerEnd && !alreadySpawned) {
    const timerId = setTimeout(() => spawnFromSet({inputStack, output, cardPositionInfo, preserve, consumeInitiator}), duration);
    setCardPositions(prevCardPositions => {
      const newCardPositions = {...prevCardPositions}
      newCardPositions[id] = ({
        ...cardPosition, 
        timerId: timerId,
        timerStart: new Date(), 
        timerEnd: new Date(Date.now() + duration),
        spawningStack: inputStack,
        currentSpawnDescriptor: descriptor
      })
      return newCardPositions;
    })
  }
}

export function spawnFromSet({inputStack, output, cardPositionInfo, preserve, consumeInitiator}:{
  inputStack: CardSlug[], 
  output: CardSlug|CardSlug[], 
  cardPositionInfo: CardPositionInfo
  preserve?: boolean,
  consumeInitiator?: boolean
}) {
  const { cardPositions, id, setCardPositions } = cardPositionInfo
  if (!cardPositions[id]) return

  setCardPositions(prevCardPositions => {
    const newCardPositions = {...prevCardPositions}
    const cardPosition = newCardPositions[cardPositionInfo.id]
    const newCardPositionInfo = { ...cardPositionInfo, cardPositions: newCardPositions }
    const attachedSlugs = cardPosition.attached.map(i => newCardPositions[i].slug)
    if (areArraysIdentical(attachedSlugs, inputStack)) {
      newCardPositions[id] = popOffCard(newCardPositionInfo)

      // create the output card
      if (typeof output === "string") {
        const newCardPosition = spawnNearby(output, cardPosition)
        newCardPositions[newCardPosition.id] = newCardPosition
      } else {
        output.forEach((outputSlug, i) => {
          const newCardPosition = spawnNearby(outputSlug, cardPosition, i)
          newCardPositions[newCardPosition.id] = newCardPosition
        })
      }

      const attachedCardPositions = cardPosition.attached.map(i => newCardPositions[i])
      const attachedCardsInStack = attachedCardPositions.filter(attachedCardPosition => inputStack.includes(attachedCardPosition.slug))
      // destroy the attached cards
      if (!preserve) {
        attachedCardsInStack.forEach(attachedCardPosition => {
          delete newCardPositions[attachedCardPosition.id]
        })
      }
      if (consumeInitiator) {
        delete newCardPositions[id]
      }
    }
    return newCardPositions
  })
}

export function restoreTimer({duration, cardPositionInfo, currentAttribute, maxAttribute, resource, preserve, descriptor}:{
  duration: number, 
  cardPositionInfo: 
  CardPositionInfo, 
  currentAttribute: "currentHunger"|"currentFuel"|"currentStamina",
  maxAttribute: "maxHunger"|"maxFuel"|"maxStamina",
  resource: "calories"|"fuel"|"rest",
  preserve?: boolean,
  descriptor?: string
}) {
  const { cardPositions, id } = cardPositionInfo
  const cardPosition = cardPositions[id]
  const attachedId = cardPosition.attached.find(i => cardPositions[i][resource])
  const resourceAmount = attachedId && cardPositions[attachedId][resource]
  if (cardPosition[currentAttribute] && !cardPosition.timerEnd && resourceAmount && attachedId) {
    const timerId = setTimeout(() => {
      restore({
        cardPositionInfo,
        currentAttribute, 
        maxAttribute,
        resourceAmount, 
        attachedId,
        preserve,
      })
    }, duration)
    return updateCardPosition(cardPositionInfo, (cardPosition) => ({
      ...cardPosition,
      timerId: timerId,
      timerStart: new Date(),
      timerEnd: new Date(Date.now() + duration),
      currentSpawnDescriptor: descriptor,
      spawningStack: [cardPositions[attachedId].slug],
    }))
  }
  return cardPositionInfo
}

function restore({cardPositionInfo, resourceAmount, currentAttribute, maxAttribute, attachedId, preserve}:{
  cardPositionInfo: CardPositionInfo, 
  resourceAmount: number, 
  currentAttribute: "currentHunger"|"currentFuel"|"currentStamina",
  maxAttribute: "maxHunger"|"maxFuel"|"maxStamina",
  attachedId: string,
  preserve?: boolean,
}) {
  const { cardPositions, id, setCardPositions } = cardPositionInfo;
  if (!cardPositions[id]) return

  setCardPositions((prevCardPositions: Record<string, CardPosition>) => {
    const newCardPositions = {...prevCardPositions}
    const cardPosition = newCardPositions[id];
    const currentAttributeAmount = cardPosition[currentAttribute];

    if (currentAttributeAmount && resourceAmount) {
      // Update the current card position.
      newCardPositions[id] = {
        ...cardPosition,
        timerId: undefined,
        timerStart: undefined,
        timerEnd: undefined,
        currentSpawnDescriptor: undefined,
        attached: [],
        spawningStack: undefined,
        [currentAttribute]: Math.min(currentAttributeAmount + resourceAmount, cardPosition[maxAttribute] ?? 0),
      };

      if (!preserve) {
        delete newCardPositions[attachedId]
      }
    }

    return newCardPositions;
  });
}

export function whileAttached (cardPositionInfo: CardPositionInfo) {
  const { cardPositions, id } = cardPositionInfo
  const spawnInfo = cardPositions[id].spawnInfo
  if (!spawnInfo) return

  const attachedSortedByZIndex = getAttachedCardsSortedByZIndex(cardPositionInfo)

  attachedSortedByZIndex.forEach((attachedCard) => {
    const spawnCardInfo = spawnInfo[attachedCard.slug]
    if (spawnCardInfo) {
      const { duration, inputStack, preserve, output, descriptor, skipIfExists, consumeInitiator } = spawnCardInfo
      if (inputStack && output) {
        spawnTimerFromSet({inputStack, output, duration, cardPositionInfo, descriptor, skipIfExists, preserve, consumeInitiator})
      } else if (duration && attachedSortedByZIndex.length === 1) {  
        spawnTimerFromLoot({attachedSlug: attachedCard.slug, duration, cardPositionInfo, preserve, descriptor})
      }
    } else if (attachedCard.calories) {
      restoreTimer({
        duration: 1000, 
        cardPositionInfo, 
        resource: "calories", 
        currentAttribute: "currentHunger",
        maxAttribute: "maxHunger",
        descriptor: "Eating..."
      })
    } else if (attachedCard.fuel) {
      restoreTimer({
        duration:1000, 
        cardPositionInfo, 
        resource: "fuel", 
        currentAttribute: "currentFuel",
        maxAttribute: "maxFuel",
        descriptor: "Fueling..."
      })
    } else if (attachedCard.rest) {
      restoreTimer({
        duration:6000, 
        cardPositionInfo, 
        resource: "rest", 
        currentAttribute: "currentStamina",
        maxAttribute: "maxStamina",
        preserve: true,
        descriptor: "Resting..."
      })
    }
  })
}