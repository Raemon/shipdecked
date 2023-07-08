import React from 'react';
import { CardType, SpawnInfo } from "./types"

export type CardSlug = 
  'carlos'|'ruth'|
  'palmTree'|'log'|'driftWoodLog'|'flint'|'sticks'|'rocks'|
  'coconut'|'seaweed'|'cannedBeans'|
  'shoresidePath'|'junglePath'|'birdIsland'|'shelteredCove'|'craggyCliffs'|
  'carlosFootprints'|
  'crate'|
  'smallFire'|
  'raft'|'birdDroppings'|
  'ideaFire'|'ideaRaft'|'ideaEscape'

const characterSpawnInfo: SpawnInfo = {
  'shoresidePath': { duration: 3000, descriptor: "Exploring...", preserve: true },
  'shelteredCove': { duration: 3000, descriptor: "Exploring...", preserve: true },
  'craggyCliffs': { duration: 3000, descriptor: "Exploring...", preserve: true },
  'junglePath': { duration: 30000, descriptor: "Exploring...", preserve: true},
  'smallFire': { duration: 6000, descriptor: "Stare into flames..." },
  'palmTree': { duration: 2000, descriptor: "Climbing...", preserve: true },
  'crate': { duration: 1000, descriptor: "Opening..." },
  'rocks': { duration: 2000, descriptor: "Smashing..." },
  'flint': { 
    duration: 1000, descriptor: "Building...", inputStack: ['flint', 'log', 'sticks'], output: 'smallFire', 
  },
  'driftWoodLog': { 
    duration: 1000, descriptor: "Building...", inputStack: ['flint', 'driftWoodLog', 'sticks'], output: 'smallFire',  
  },
}

export const units: Record<CardSlug, CardType> = {
  "carlos": {
    name: 'Carlos',
    imageUrl: 'carlos.png',
    spawnInfo: characterSpawnInfo,
    maxHunger: 2800,
    maxHealth: 10,
    loot: ['ideaFire']
  },
  "ruth": {
    name: 'Ruth',
    imageUrl: 'ruth.png',
    nightImageUrl: 'nightRuth.png',
    maxHunger: 2000,
    maxHealth: 6,
    spawnInfo: {
      ...characterSpawnInfo,
      'carlosFootprints': { duration: 5000, descriptor: "Following...", output: ['carlos', 'shelteredCove'] },
      'carlos': { duration: 3000, preserve: true, descriptor: "Talking..." },
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
    loot: ['palmTree', 'flint', 'sticks', 'coconut', 'carlosFootprints'],
    spawnDescriptor: "Exploring...",
  },
  'junglePath': {
    name: "Jungle Path",
    backgroundImage: "junglePath.png",
    large: true,
    spawnDescriptor: "Exploring...",
    loot: ['palmTree', 'shelteredCove', 'palmTree'],
  },
  'shelteredCove': {
    name: "Sheltered Cove",
    backgroundImage: "shelteredCove.png",
    large: true,
    loot: ['seaweed', 'carlos', 'driftWoodLog', 'craggyCliffs', 'driftWoodLog', 'seaweed', 'junglePath' ],
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
  
}
