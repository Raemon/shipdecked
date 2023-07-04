import { CardPosition, CardType } from "./types"
import { spawnFromParent } from "./utils"

export const units: Record<string, CardType> = {
  "villager1": {
    name: 'Villager',
    imageUrl: 'maleVillager.jpg',
    defaultZindex: 2,
  },
  "villager2": {
    name: 'Villager',
    imageUrl: 'femaleVillager.jpg',
    defaultZindex: 2,
    whileAttached: (cardPositions: CardPosition[], i: number, setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>) => {
      spawnFromParent('tree', 'log', cardPositions, i, setCardPositions)
      spawnFromParent('path1', 'tree', cardPositions, i, setCardPositions)
    }
  },
  'tree': {
    name: "Tree",
    imageUrl: 'tree.jpg',
    defaultZindex: 1,
  },
  'log': {
    name: "Log",
    imageUrl: 'log.jpg',
    defaultZindex: 1
  },
  'path1': {
    name: "Shoreside path",
    backgroundImage: 'shoresidepath.jpg',
    defaultZindex: 1
  }
}

export const abilities = [
  { id: 1, name: 'Strength' },
]