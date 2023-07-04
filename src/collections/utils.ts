import { CardPosition } from "./types"
import { units } from "./units"

export function createCardPosition(slug: string, x=0, y=0): CardPosition {
  const card = units[slug]
  return {
    x,
    y,
    zIndex: card.defaultZindex,
    maybeAttached: [],
    attached: [],
    slug,
  }
}

function spawnNearby(slug: string, parent: CardPosition) {
  return createCardPosition(slug, 
    parent.x+200 + Math.random() * 100, 
    parent.y+200 + Math.random() * 100
  )
}

function unattach(i: number, cardPositions: CardPosition[]) {
  cardPositions[i].attached = []
  cardPositions[i].x = cardPositions[i].x + 50 + Math.random() * 100
  cardPositions[i].y = cardPositions[i].y + 50 + Math.random() * 100
  return cardPositions
}


export function spawnFromParent(attachedSlug: string, spawnSlug: string, cardPositions: CardPosition[], i: number, setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>) {
  const cardPosition = cardPositions[i]
  const attachedSlugs = cardPosition.attached.map(i => cardPositions[i].slug)
  if (attachedSlugs.includes(attachedSlug)) {
    let newCardPositions = [...cardPositions]
    newCardPositions.push(spawnNearby(spawnSlug, cardPosition))
    newCardPositions = unattach(i, newCardPositions)
    setCardPositions(newCardPositions)
  }
}