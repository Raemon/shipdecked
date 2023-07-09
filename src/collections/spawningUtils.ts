import sample from "lodash/sample"
import { CardPosition, CardPositionInfo } from "./types"
import { CardSlug, units } from "./cards"
import { filter, includes, some } from "lodash"

export function createCardPosition(slug: CardSlug, x: number, y: number): CardPosition {
  const card = units[slug]
  return {
    x,
    y,
    maybeAttached: [],
    attached: [],
    slug,
    zIndex: 1,
    currentHunger: card.maxHunger ? card.maxHunger/2 - 1: undefined,
    currentFuel: card.maxFuel ? card.maxFuel/2 - 1: undefined,
    currentStamina: card.maxStamina ? card.maxStamina/1.5 - 1: undefined,
    currentFading: card.maxFading,
    ...card
  }
}

export function getAttachedCardsSortedByZIndex (cardPositionInfo: CardPositionInfo) {
  const { cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const attachedCardIds = cardPosition.attached
  const attachedCards = attachedCardIds.map((id) => cardPositions[id])
  return attachedCards.sort((a, b) => b.zIndex - a.zIndex)
}

export const updateCardPosition = (
  cardPositionInfo: CardPositionInfo, 
  updateFunction: (cardPosition: CardPosition) => CardPosition
) => {
  const { setCardPositions, i } = cardPositionInfo
  setCardPositions((prevCardPositions: CardPosition[]) => {
    const newCardPositions = [...prevCardPositions];
    const cardPosition = newCardPositions[i];
    newCardPositions[i] = updateFunction(cardPosition);
    return newCardPositions;
  });
};

function spawnNearby(slug: CardSlug, parent: CardPosition) {
  return createCardPosition(slug,
    parent.x+100 + Math.random() * 50, 
    parent.y+15 + Math.random() * 50
  )
}

function getLoot (cardPositionInfo: CardPositionInfo, slug: CardSlug) {
  const { cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const attachedId = cardPosition.attached.find(i => cardPositions[i].slug === slug)
  const loot = typeof attachedId === "number" && cardPositions[attachedId].loot
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
  const { cardPositions, i } = cardPositionInfo
  return {
    ...cardPositions[i],
    attached: [],
    x: cardPositions[i].x - 50 - Math.random() * 50,
    y: cardPositions[i].y + 15 + Math.random() * 50,
    timerEnd: undefined,
    timerStart: undefined,
    timerId: undefined,
  }
}

export function getAttachedCardsWithHigherZIndex (cardPositions: CardPosition[], i: number) {
  const cardPosition = cardPositions[i]
  const attachedCardIds = cardPosition.attached
  const attachedCards = attachedCardIds.map((id) => cardPositions[id])
  const attachedCardsWithHigherZIndex = attachedCards.filter(attachedCard => {
    try {
      return attachedCard.zIndex > cardPosition.zIndex
    } catch(err) {
      console.log(err)
      console.log({attachedCard, cardPosition})
    }
  })
  return attachedCardsWithHigherZIndex.sort((a, b) => b.zIndex - a.zIndex)
}

function containsAll(arr1: string[], arr2: string[]): boolean {
  return arr2.every(arr2Item => arr1.includes(arr2Item));
}

export function spawnTimerFromLoot({attachedSlug, duration, cardPositionInfo, preserve, descriptor}:{attachedSlug: CardSlug, duration: number, cardPositionInfo: CardPositionInfo, preserve?: boolean, descriptor?: string}) {
  const { cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const attachedSlugs = cardPosition.attached.map(i => cardPositions[i].slug)

  const spawnSlug = getLoot(cardPositionInfo, attachedSlug).spawnSlug

  if (attachedSlugs.includes(attachedSlug) && !cardPosition.timerEnd && spawnSlug) {
    const timerId = setTimeout(() => spawnFromLoot({attachedSlug, cardPositionInfo, preserve}), duration);
    const attachedSpawnDescriptor = descriptor ?? units[attachedSlug].spawnDescriptor
    
    return updateCardPosition(cardPositionInfo, (cardPosition) => ({
      ...cardPosition, 
      timerId: timerId,
      timerStart: new Date(), 
      timerEnd: new Date(Date.now() + duration),
      currentSpawnDescriptor: attachedSpawnDescriptor
   }))
  }
  return cardPositionInfo
}

export function spawnFromLoot({attachedSlug, cardPositionInfo, preserve}:{attachedSlug: CardSlug, cardPositionInfo: CardPositionInfo, preserve?: boolean, output?: CardSlug|CardSlug[]}) {
  const { cardPositions, i, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const { spawnSlug, attachedId } = getLoot(cardPositionInfo, attachedSlug)
  if (spawnSlug && attachedId) {
    setCardPositions(prevCardPositions => {
      const newCardPositions = [...prevCardPositions];

      const oldAttached = cardPositions[attachedId]
      const oldSpawnItems = [...(oldAttached.loot ?? [])]
      let newSpawnItems = removeOneInstance(oldSpawnItems, spawnSlug)
      let secondaryLoot = oldAttached.secondaryLoot ?? []

      newCardPositions[i] = popOffCard(cardPositionInfo)
      newCardPositions.push(spawnNearby(spawnSlug, cardPosition))

      // If there are no more items to spawn, add the secondary loot
      if (newSpawnItems.length === 0 && secondaryLoot.length > 0) {
        newSpawnItems = secondaryLoot
        secondaryLoot = []
      }

      newCardPositions[attachedId] = {
      ...cardPositions[attachedId],
        loot: newSpawnItems
      }

      // If there are no more items to spawn even , remove the attached card
      if (newSpawnItems.length === 0 && !preserve) {
        newCardPositions.splice(attachedId, 1)
      }
      return newCardPositions;
    })
  } else {
    setCardPositions(prevCardPositions => {
      const newCardPositions = [...prevCardPositions];
      newCardPositions[i] = popOffCard(cardPositionInfo)
      return newCardPositions;
    })
  }
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
  const { cardPositions, i, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[i] 
  const attachedSlugs = cardPosition.attached.map(i => cardPositions[i].slug)

  const completeStack = containsAll(attachedSlugs, inputStack)

  const allSlugs = cardPositions.map(cardPosition => cardPosition.slug)
  const alreadySpawned = skipIfExists && some(skipIfExists, function(item) {
    return includes(allSlugs, item);
  });

  if (completeStack && !cardPosition.timerEnd && !alreadySpawned) {
    const timerId = setTimeout(() => spawnFromSet({inputStack, output, cardPositionInfo, preserve, consumeInitiator}), duration);
    setCardPositions(prevCardPositions => {
      const newCardPositions = [...prevCardPositions];
      newCardPositions[i] = ({
        ...cardPosition, 
        timerId: timerId,
        timerStart: new Date(), 
        timerEnd: new Date(Date.now() + duration),
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
  const { i, setCardPositions } = cardPositionInfo
  setCardPositions(prevCardPositions => {
    const newCardPositions = [...prevCardPositions]
    const cardPosition = newCardPositions[cardPositionInfo.i]
    const newCardPositionInfo = { ...cardPositionInfo, cardPositions: newCardPositions }
    const attachedSlugs = cardPosition.attached.map(i => newCardPositions[i].slug)
    if (containsAll(attachedSlugs, inputStack)) {
      newCardPositions[i] = popOffCard(newCardPositionInfo)

      // create the output card
      if (typeof output === "string") {
        newCardPositions.push(spawnNearby(output, cardPosition))
      } else {
        output.forEach((outputSlug) => {
          newCardPositions.push(spawnNearby(outputSlug, cardPosition))
        })
      }

      const attachedCardPositions = cardPosition.attached.map(i => newCardPositions[i])
      const attachedCardsInStack = attachedCardPositions.filter(attachedCardPosition => inputStack.includes(attachedCardPosition.slug))
      // destroy the attached cards
      if (!preserve) {
        attachedCardsInStack.forEach(attachedCardPosition => {
          newCardPositions.splice(newCardPositions.indexOf(attachedCardPosition), 1)
        })
      }
      if (consumeInitiator) {
        newCardPositions.splice(i, 1)
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
  const { cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const attachedId = cardPosition.attached.find(i => cardPositions[i][resource])
  const resourceAmount = attachedId && cardPositions[attachedId][resource]
  if (cardPosition.currentHunger && !cardPosition.timerEnd && resourceAmount && attachedId) {
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
      currentSpawnDescriptor: descriptor
    }))
  }
  return cardPositionInfo
}

function restore({cardPositionInfo, resourceAmount, currentAttribute, maxAttribute, attachedId, preserve}:{
  cardPositionInfo: CardPositionInfo, 
  resourceAmount: number, 
  currentAttribute: "currentHunger"|"currentFuel"|"currentStamina",
  maxAttribute: "maxHunger"|"maxFuel"|"maxStamina",
  attachedId: number,
  preserve?: boolean,
}) {
  const { i, setCardPositions } = cardPositionInfo;

  setCardPositions((prevCardPositions: CardPosition[]) => {
    const newCardPositions = [...prevCardPositions];
    const cardPosition = newCardPositions[i];
    const currentAttributeAmount = cardPosition[currentAttribute];

    if (currentAttributeAmount && resourceAmount) {
      // Update the current card position.
      newCardPositions[i] = {
        ...cardPosition,
        timerId: undefined,
        timerStart: undefined,
        timerEnd: undefined,
        currentSpawnDescriptor: undefined,
        attached: [],
        [currentAttribute]: Math.min(currentAttributeAmount + resourceAmount, cardPosition[maxAttribute] ?? 0),
      };

      if (!preserve) {
        newCardPositions.splice(attachedId, 1);
      }
    }

    return newCardPositions;
  });
}

export function whileAttached (cardPositionInfo: CardPositionInfo) {
  const { cardPositions, i } = cardPositionInfo
  const spawnInfo = cardPositions[i].spawnInfo
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