import { CardType } from "./types"
import { spawnTimer } from "./utils"

export type CardSlug = 
  'carlos'|'ruth'|
  'tree'|'log'|'flint'|
  'path1'|
  'crate'|'cannedBeans'

export const units: Record<CardSlug, CardType> = {
  "carlos": {
    name: 'Carlos',
    imageUrl: 'maleVillager.jpg',
    zIndex: 2,
    spawnItems: {}
  },
  "ruth": {
    name: 'Ruth',
    imageUrl: 'ruth.png',
    zIndex: 2,
    spawnItems: {},
    maxHunger: 2000,
    whileAttached: (cardPositionInfo) => {
      spawnTimer('path1', 3000, cardPositionInfo)
      spawnTimer('tree', 2000, cardPositionInfo)
      spawnTimer('crate', 2000, cardPositionInfo)
    }
  },
  'tree': {
    name: "Tree",
    imageUrl: 'tree.jpg',
    zIndex: 1,
    spawnDescriptor: "Chopping...",
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
      'ruth': ['tree', 'carlos', 'tree']
    },
    spawnDescriptor: "Exploring...",
    zIndex: 1
  },
  'crate': {
    name: "Supply Crate",
    imageUrl: 'crate.png',
    spawnItems: {
      'ruth':['cannedBeans']
    },
    zIndex: 1
  },
  'flint': {
    name: "Flint",
    imageUrl: 'flint.png',
    spawnItems: {},
    zIndex: 1
  },
  'cannedBeans': {
    name: "Canned Beans",
    imageUrl: "cannedBeans.png",
    calories: 600,
    spawnItems: {},
    zIndex: 1
  }
}
