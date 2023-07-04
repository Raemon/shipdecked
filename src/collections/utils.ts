import sample from "lodash/sample"
import { CardPosition, CardPositionInfo } from "./types"
import { CardSlug, units } from "./units"

export function createCardPosition(slug: CardSlug, x=0, y=0): CardPosition {
  const card = units[slug]
  return {
    x,
    y,
    maybeAttached: [],
    attached: [],
    slug,
    ...card
  }
}

function updateCardPosition(cardPositionInfo: CardPositionInfo, newCardPosition: CardPosition) {
  const { cardPositions, i, setCardPositions } = cardPositionInfo
  const newCardPositions = [...cardPositions]
  newCardPositions[i] = newCardPosition
  setCardPositions(newCardPositions)
  return {cardPositions: newCardPositions, i, setCardPositions}
}

function spawnNearby(slug: CardSlug, parent: CardPosition) {
  return createCardPosition(slug, 
    parent.x+100 + Math.random() * 100, 
    parent.y+50 + Math.random() * 100
  )
}

function getSpawn (cardPositionInfo: CardPositionInfo, slug: CardSlug) {
  const { cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const attachedId = cardPosition.attached.find(i => cardPositions[i].slug === slug)
  const spawnItems = attachedId && cardPositions[attachedId].spawnItems
  const spawnItemsResult = spawnItems && spawnItems[cardPosition.slug]
  const spawnSlug = spawnItemsResult && sample(spawnItemsResult)
  return { spawnSlug, attachedId }
}

const removeOneInstance = (arr: string[], itemToRemove: string) => {
  const index = arr.indexOf(itemToRemove);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
};

export function spawnTimer(attachedSlug: CardSlug, duration: number, cardPositionInfo: CardPositionInfo) {
  const { cardPositions, i } = cardPositionInfo
  const cardPosition = cardPositions[i]
  const attachedSlugs = cardPosition.attached.map(i => cardPositions[i].slug)
  if (attachedSlugs.includes(attachedSlug) && !cardPosition.timerEnd) {
    const timerId = setTimeout(() => spawnFromParent(attachedSlug, cardPositionInfo), duration);
    updateCardPosition(cardPositionInfo, {
      ...cardPositions[i], 
      timerId: timerId,
      timerStart: new Date(), 
      timerEnd: new Date(Date.now() + duration) 
   })
  }
}


export function spawnFromParent(attachedSlug: CardSlug, cardPositionInfo: CardPositionInfo) {
  const { cardPositions, i, setCardPositions } = cardPositionInfo
  const cardPosition = cardPositions[i]

  const newCardPositions = [...cardPositions]

  newCardPositions[i] = { 
    ...cardPosition,
    attached:[],
    x: cardPosition.x - 100 - Math.random() * 100,
    y: cardPosition.y + 50 + Math.random() * 100,
    timerEnd: undefined,
    timerStart: undefined,
  }
  const { spawnSlug, attachedId } = getSpawn(cardPositionInfo, attachedSlug)
  if (spawnSlug && attachedId) {
    newCardPositions.push(spawnNearby(spawnSlug, cardPosition))
    
    const oldAttached = cardPositions[attachedId]
    const oldSpawnItems = oldAttached.spawnItems[cardPosition.slug]
    const newSpawnItems = oldSpawnItems ? removeOneInstance(oldSpawnItems, spawnSlug) : []

    newCardPositions[attachedId] = {
      ...cardPositions[attachedId],
      spawnItems: {
        ...cardPositions[attachedId].spawnItems,
        [cardPosition.slug]: newSpawnItems
      }
    }
  }
  setCardPositions(newCardPositions)  
}
