import { CardType } from "./types"
import { spawnTimer } from "./utils"

export type CardSlug = 
  'villager1'|'ruth'|
  'tree'|'log'|
  'path1'
  // 'crate'

export const units: Record<CardSlug, CardType> = {
  "villager1": {
    name: 'Villager',
    imageUrl: 'maleVillager.jpg',
    zIndex: 2,
    spawnItems: {}
  },
  "ruth": {
    name: 'Ruth',
    imageUrl: 'femaleVillager.jpg',
    zIndex: 2,
    spawnItems: {},
    hunger: true,
    whileAttached: (cardPositionInfo) => {
      spawnTimer('path1', 2000, cardPositionInfo)
      spawnTimer('tree', 2000, cardPositionInfo)
    }
  },
  'tree': {
    name: "Tree",
    imageUrl: 'tree.jpg',
    zIndex: 1,
    spawnItems: {
      'ruth': ['log', 'log', 'log']
    },
  },
  'log': {
    name: "Log",
    imageUrl: 'log.jpg',
    zIndex: 1,
    spawnItems: {}
  },
  'path1': {
    name: "Shoreside path",
    backgroundImage: 'shoresidepath.jpg',
    large: true,
    spawnItems: {
      'ruth': ['tree', 'villager1', 'tree']
    },
    zIndex: 1
  },
  // 'crate': {
  //   name: "Supply Crate",
  //   imageUrl: 'crate.jpg',
  //   spawnItems: {
  //     'ruth':['cannedBeans']
  //   },
  //   zIndex:1
  // }
}
