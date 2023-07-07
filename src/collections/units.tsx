import React from 'react';
import { CardType, SpawnInfo } from "./types"

export type CardSlug = 
  'carlos'|'ruth'|'ideaFire'|
  'tree'|'log'|'driftWoodLog'|'flint'|'sticks'|'coconut'|
  'shoresidePath'|'junglePath'|
  'crate'|'cannedBeans'|
  'smallFire'|'ideaRaft'|
  'raft'|'birdIsland'|'birdDroppings'

const characterSpawnInfo: SpawnInfo = {
  'shoresidePath': { time: 3000, descriptor: "Exploring..." },
  'smallFire': { time: 5000, descriptor: "Staring into flames..." },
  'junglePath': { time: 20000, descriptor: "Exploring..." },
  'tree': { time: 2000 },
  'crate': { time: 1000 },
  'flint': { stack: ['flint', 'log', 'sticks'], product: 'smallFire', time: 1000 },
}

export const units: Record<CardSlug, CardType> = {
  "carlos": {
    name: 'Carlos',
    imageUrl: 'carlos.png',
    spawnInfo: characterSpawnInfo,
    loot: ['ideaFire']
  },
  "ruth": {
    name: 'Ruth',
    imageUrl: 'ruth.png',
    nightImageUrl: 'nightRuth.png',
    maxHunger: 2000,
    spawnInfo: {
      ...characterSpawnInfo,
      'carlos': { time: 1000, preserve: true, descriptor: "Talking..." },
    }
  },
  'ideaFire': {
    name: 'Idea: Fire',
    imageUrl: 'ideaFire.png',
    type: "idea",
    cardText: <div>Sticks, Log and Flint</div>
  },
  'sticks': {
    name: "Sticks",
    imageUrl: 'sticks.png',
  },
  'tree': {
    name: "Palm Tree",
    imageUrl: 'palmTree.png',
    spawnDescriptor: "Chopping...",
    loot: ['log', 'sticks', 'coconut']
  },
  'coconut': {
    name: "Coconut",
    imageUrl: 'coconut.png',
    calories: 200,
  },
  'log': {
    name: "Log",
    imageUrl: 'log.jpg',
  },
  'driftWoodLog': {
    name: "Driftwood Log",
    imageUrl: 'driftWoodLog.png',
  },
  'shoresidePath': {
    name: "Shoreside path",
    backgroundImage: 'shoresidepath.jpg',
    type: "landscape",
    loot: ['tree', 'flint', 'carlos', 'sticks', 'coconut', 'driftWoodLog', 'junglePath'],
    spawnDescriptor: "Exploring...",
  },
  'junglePath': {
    name: "Jungle Path",
    backgroundImage: "junglePath.png",
    type: "landscape",
    spawnDescriptor: "Exploring...",
    loot: ['tree', 'sticks'],
  },
  'crate': {
    name: "Supply Crate",
    imageUrl: 'crate.png',
    loot: ['cannedBeans'],
    spawnDescriptor: "Opening...",
  },
  'flint': {
    name: "Flint",
    imageUrl: 'flint.png',
  },
  'cannedBeans': {
    name: "Canned Beans",
    imageUrl: "cannedBeans.png",
    calories: 600,
  },
  'smallFire': {
    name: "Small Fire",
    imageUrl: "smallFire.png",
    creatingDescriptor: "Building...",
    spawnDescriptor: "Cooking...",
    loot: ['ideaRaft'],
  },
  'ideaRaft': {
    name: 'Idea: Raft',
    imageUrl: "ideaRaft.png",
    cardText: <div>
      <p><em>Need to get out of here</em></p>
      <p>Sticks, 2 Rope, 5 Logs</p>
    </div>
  },
  'raft': {
    name: "Raft",
    imageUrl: 'raft.png',
    loot: ['birdIsland']
  },
  'birdIsland': {
    name: "Bird Island",
    imageUrl: "birdIsland.png",
    loot: ['birdDroppings']
  },
  'birdDroppings': {
    name: "Bird Droppings",
    imageUrl: "Bird Droppings",
  }
}
