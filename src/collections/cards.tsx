import React from 'react';
import { CardType, SpawnInfo } from "./types"

export const startingCards: CardSlug[] = [
  'ruth',
  'shoresidePath', 'crate', 
  // 'seaweed', 'smallFire',
  // 'carlos', 'shelter', 'log'
]

export type CardSlug = 
  'carlos'|'ruth'|
  'palmTree'|'log'|'driftWoodLog'|'flint'|'sticks'|'rocks'|
  'coconut'|'seaweed'|'cannedBeans'|'bakedSeaweed'|
  'shoresidePath'|'denseJungle'|'birdIsland'|'shelteredCove'|'craggyCliffs'|
  'carlosFootprints'|
  'crate'|
  'smallFire'|
  'raft'|'birdDroppings'|
  'ideaFire'|'ideaRaft'|'ideaEscape'|'ideaHatchet'|
  'shelter'|
  'hatchet'

const characterSpawnInfo: SpawnInfo = {
  'shoresidePath': { duration: 3000, descriptor: "Exploring...", preserve: true },
  'shelteredCove': { duration: 3000, descriptor: "Exploring...", preserve: true },
  'craggyCliffs': { duration: 3000, descriptor: "Exploring...", preserve: true },
  'denseJungle': { duration: 25000, descriptor: "Exploring...", preserve: true},
  'crate': { duration: 1000, descriptor: "Opening..." },
  'rocks': { duration: 3000, descriptor: "Chipping..." },
  'flint': { 
    duration: 6000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'log', 'sticks'], 
    output: 'smallFire', 
  },
  'driftWoodLog': { 
    duration: 6000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'driftWoodLog', 'sticks'], 
    output: 'smallFire',  
  },
  'sticks': {
    duration: 1000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'sticks'], 
    output: 'hatchet',
  },
  'log': {
    duration: 1000,
    descriptor: "Building...",
    inputStack: ['log', 'log'],
    output: 'shelter',
  },
  'smallFire': { 
    duration: 6000, 
    descriptor: "Stare into flames...", 
    inputStack: ['smallFire'], 
    output: "ideaEscape"
  },
  'hatchet': { 
    duration: 6000, 
    descriptor: "Chopping...", 
    inputStack: ['hatchet', 'palmTree'], 
    output: ["coconut", "coconut", "log"]
  },
  'palmTree': {
    duration: 3000, 
    descriptor: "Staring Frustratedly...", 
    skipIfExists: ['hatchet', 'ideaHatchet'], 
    preserve: true,
    inputStack: ['palmTree'],
    output: 'ideaHatchet', 
  },
}

export const units: Record<CardSlug, CardType> = {
  "carlos": {
    name: 'Carlos',
    imageUrl: 'carlos.png',
    maxHunger: 2800,
    maxStamina: 2000,
    maxHealth: 10,
    spawnInfo: {
      ...characterSpawnInfo,
      'ruth': { 
        skipIfExists: ['ideaFire'], 
        inputStack: ['ruth'],
        duration: 3000, preserve: true, descriptor: "Talking...", output: 'ideaFire' 
      },
    }
  },
  "ruth": {
    name: 'Ruth',
    imageUrl: 'ruth.png',
    nightImageUrl: 'nightRuth.png',
    maxHunger: 2000,
    maxStamina: 2000,
    maxHealth: 6,
    spawnInfo: {
      ...characterSpawnInfo,
      'carlosFootprints': { duration: 5000, descriptor: "Following..." },
      'carlos': { 
        skipIfExists: ['ideaFire'], 
        inputStack: ['carlos'],
        duration: 3000, preserve: true, descriptor: "Talking...", output: 'ideaFire' 
      },
    } 
  },
  'sticks': {
    name: "Sticks",
    imageUrl: 'sticks.png',
    fuel: 100,
  },
  'palmTree': {
    name: "Palm Tree",
    imageUrl: 'palmTree.png',
    spawnDescriptor: "Chopping...",
    loot: ['coconut', 'coconut']
  },
  'coconut': {
    name: "Coconut",
    imageUrl: 'coconut.png',
    calories: 200,
  },
  'log': {
    name: "Log",
    imageUrl: 'log.jpg',
    fuel: 400,
  },
  'driftWoodLog': {
    name: "Driftwood Log",
    imageUrl: 'driftWoodLog.png',
    fuel: 500,
  },

  // Locations

  'shoresidePath': {
    name: "Shoreside path",
    backgroundImage: 'shoresidepath.jpg',
    large: true,
    loot: ['palmTree', 'flint', 'sticks', 'sticks', 'flint', 'carlosFootprints'],
    spawnDescriptor: "Exploring...",
  },
  'denseJungle': {
    name: "Dense Jungle",
    backgroundImage: "junglePath.png",
    large: true,
    spawnDescriptor: "Exploring...",
    loot: ['palmTree', 'craggyCliffs', 'palmTree', 'sticks', 'sticks'],
  },
  'shelteredCove': {
    name: "Sheltered Cove",
    backgroundImage: "shelteredCove.png",
    large: true,
    loot: ['carlos', 'driftWoodLog', 'rocks', 'driftWoodLog', 'seaweed', 'denseJungle' ],
    spawnDescriptor: "Exploring...",
  },
  'craggyCliffs': {
    name: "Craggy Cliffs",
    backgroundImage: "craggyCliffs.jpg",
    large: true,
    loot: ['rocks', 'rocks'],
    spawnDescriptor: "Exploring...",
  },


  'carlosFootprints': {
    name: "Footprints",
    imageUrl: "footprints.png",
    loot: ['shelteredCove'],
  },
  'rocks': {
    name: "Rocks",
    imageUrl: "rocks.png",
    loot: ['flint', 'flint'],
  },
  'seaweed': {
    name: "Seaweed",
    imageUrl: "seaweed.png",
    calories: 100,
    spawnInfo: {
      'smallFire': {
        duration: 3000,
        descriptor: "Cooking...",
        inputStack: ['smallFire'],
        output: 'bakedSeaweed',
        preserve: true,
        consumeInitiator: true
      }
    }
  },
  'bakedSeaweed': {
    name: "Baked Seaweed",
    imageUrl: "bakedSeaweed.png",
    calories: 300,
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
    maxFuel: 1000,
    loot: ['ideaRaft'],
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
  },

  // Tools

  'hatchet': {
    name: "Hatchet",
    imageUrl: 'hatchet.png',
  },

  'shelter': {
    name: "Shelter",
    imageUrl: 'shelter.png',
    rest: 600
  },

  // Ideas/Dreams

  'ideaFire': {
    name: 'Idea: Fire',
    imageUrl: 'ideaFire.png',
    idea: true,
    cardText: <div>Sticks, Log and Flint</div>
  },
  'ideaRaft': {
    name: 'Idea: Raft',
    imageUrl: "ideaRaft.png",
    idea: true,
    cardText: <div>
      <div>Sticks, 2 Rope, 5 Logs</div>
    </div>
  },
  'ideaEscape': {
    name: 'Idea: Escape',
    backgroundImage: "ideaEscape.jpg",
    idea: true,
    large: true,
    cardText: <div>
      <p><em>Need to get out of here...</em></p>
      <div>Covered Boat, Sheltered Cove</div>
    </div>
  },
  'ideaHatchet': {
    name: 'Idea: Hatchet',
    imageUrl: "ideaHatchet.png",
    idea: true,
    cardText: <div>
      <div>Sticks and Flint</div>
    </div>
  } 
}
