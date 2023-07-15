import React from 'react';
import { CardType, SpawnInfo } from "./types"

export const startingCards: CardSlug[] = [
  'ruth', 
  'shoresidePath', 'crate',
  'sticks', 'sticks', 'sticks'
]

export type CardSlug = 
  'carlos'|'ruth'|'milo'|
  'coconutTree'|'tree'|'ancientTree'|'jungleTree'|'bananaTree'|
  'log'|'driftWoodLog'|'flint'|'sticks'|'rocks'|
  'coconut'|'seaweed'|'cannedBeans'|'bakedSeaweed'|'bananas'|'openCoconut'|
  'palmLeaves'|
  'shoresidePath'|'denseJungle'|'birdIsland'|'shelteredCove'|'craggyCliffs'|
  'carlosFootprints'|'jungleFootprints'|
  'crate'|
  'smallFire'|
  'raft'|'birdDroppings'|
  'ideaFire'|'ideaRaft'|'ideaEscape'|'ideaHatchet'|'ideaShelter'|'ideaGatherSurvivors'|
  'sexualTensionCarlosRuth'|
  'shelter'|
  'hatchet'|'spear'|
  'distantFigure'|'feyHorror'|'jungleShrine'|
  'miloUnsettlingFeeling'|'carlosUnsettlingFeeling'|'ruthUnsettlingFeeling'

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
    inputStack: ['log', 'log', 'log', 'palmLeaves', 'palmLeaves'],
    output: 'shelter',
  },
  'hatchet': { 
    duration: 6000, 
    descriptor: "Chopping...", 
    inputStack: ['hatchet', 'coconutTree'], 
    output: ["coconut", "coconut", "log", "hatchet", "palmLeaves"],
  },
  'coconutTree': {  
    duration: 3000, 
    descriptor: "Staring Frustratedly...", 
    skipIfExists: ['hatchet', 'ideaHatchet'], 
    preserve: true,
    inputStack: ['coconutTree'],
    output: 'ideaHatchet', 
  },
  'coconut': {
    duration: 1500,
    descriptor: "Cracking...",
    inputStack: ['coconut', 'hatchet'],
    output: ['openCoconut', 'hatchet']
  },
  'bananaTree': {
    duration: 6000, 
    descriptor: "Chopping Tree...",  
    inputStack: ['hatchet', 'bananaTree'],
    output: ['bananas', 'bananas', 'bananas', 'log', 'palmLeaves', 'hatchet'], 
  },
  'jungleTree': {
    duration: 3000,
    descriptor: "Chopping",
    inputStack: ['jungleTree', 'hatchet'],
    output: ['sticks', 'log', 'log', 'log', 'sticks', 'hatchet']
  },
  'distantFigure': {
    duration: 3000,
    descriptor: "Following...",
    inputStack: ['distantFigure'], 
    consumeInitiator: true,
    output: 'feyHorror',
  },
  'jungleShrine': {
    duration: 3000,
    descriptor: "Sitting quietly...",
    inputStack: ['jungleShrine'],
    output: 'ideaEscape',
  },
}

export const units: Record<CardSlug, CardType> = {
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
      'ancientTree': {
        duration: 30000,
        descriptor: "Chopping...",
        inputStack: ['hatchet', 'ancientTree'],
        output: ['sticks', 'log', 'log', 'log', 'hatchet', 'ruthUnsettlingFeeling']
      },
      'smallFire': { 
        duration: 6000, 
        descriptor: "Stare into flames...", 
        inputStack: ['smallFire'], 
        skipIfExists: ['ideaGatherSurvivors'], 
        output: "ideaGatherSurvivors",
        preserve: true,
      }
    } 
  },
  "carlos": {
    name: 'Carlos',
    imageUrl: 'carlos.png',
    maxHunger: 2800,
    maxStamina: 2000,
    maxHealth: 10,
    spawnInfo: {
      ...characterSpawnInfo,
      'ruth': { 
        duration: 6000, 
        descriptor: "Talking...", 
        inputStack: ['smallFire', 'ruth'], 
        output: "ideaShelter",
        preserve: true,
      },
      'ancientTree': {
        duration: 30000,
        descriptor: "Chopping...",
        inputStack: ['hatchet', 'ancientTree'],
        output: ['sticks', 'log', 'log', 'log', 'hatchet', 'carlosUnsettlingFeeling', 'palmLeaves']
      },
    }
  },
  'milo': {
    name: 'Milo',
    imageUrl: 'milo.png',
    maxHunger: 2000,
    maxStamina: 2000,
    maxHealth: 6,
    spawnInfo: {
      ...characterSpawnInfo,
      'ancientTree': {
        duration: 30000,
        descriptor: "Chopping...",
        inputStack: ['hatchet', 'ancientTree'],
        output: ['sticks', 'log', 'log', 'log', 'hatchet', 'miloUnsettlingFeeling']
      },
    }
  },
  'sticks': {
    name: "Sticks",
    imageUrl: 'sticks.png',
    fuel: 100,
  },
  'coconutTree': {
    name: "Coconut Tree",
    imageUrl: 'palmTree.png',
  },
  'bananaTree': {
    name: "Banana Tree",
    imageUrl: 'bananaTree.png',
  },
  'tree': {
    name: "Tree",
    imageUrl: 'tree.jpg',
  },
  'jungleTree': {
    name: "Jungle Tree",
    imageUrl: 'jungleTree.png',
  },
  'palmLeaves': {
    name: "Palm Leaves",
    imageUrl: 'palmLeaves.png',
  },
  'coconut': {
    name: "Coconut",
    imageUrl: 'coconut.png',
  },
  'openCoconut': {
    name: "Open Coconut",
    imageUrl: 'openCoconut.png',
    calories: 1400,
  },
  'bananas': {
    name: "Bananas",
    imageUrl: 'bananas.png',
    calories: 600,
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
    loot: ['coconutTree', 'flint', 'sticks', 'carlosFootprints'],
    secondaryLoot: ['crate', 'coconutTree', 'bananaTree', 'rocks', 'sticks'],
    spawnDescriptor: "Exploring...",
  },
  'denseJungle': {
    name: "Dense Jungle",
    backgroundImage: "junglePath.png",
    large: true,
    spawnDescriptor: "Exploring...",
    loot: ['coconutTree', 'craggyCliffs', 'jungleTree', 'coconutTree', 'sticks', 'sticks', 'ancientTree', 'jungleFootprints', 'distantFigure', 'tree', 'jungleShrine'],
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
    loot: ['rocks', 'rocks', 'milo', 'sticks', 'sticks'],
    spawnDescriptor: "Exploring...",
  },


  'carlosFootprints': {
    name: "Footprints",
    imageUrl: "footprints.png",
    loot: ['shelteredCove'],
  },
  'jungleFootprints': {
    name: "Footprints",
    imageUrl: "jungleFootprints.png",
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
  'ancientTree': {
    name: "Ancient Tree",
    large: true,
    backgroundImage: "ancientTree.jpg",
  },

  // Tools

  'hatchet': {
    name: "Hatchet",
    imageUrl: 'hatchet.png',
  },

  'spear': {
    name: "Spear",
    imageUrl: 'spear.png',
  },

  'shelter': {
    name: "Small Shelter",
    imageUrl: 'shelter.png',
    rest: 600,
    spawnInfo: {
      'ruth': {
        duration: 6000,
        descriptor: "Awkwardly resting...",
        inputStack: ['carlos', 'ruth'],
        output: 'sexualTensionCarlosRuth',
        skipIfExists: ['sexualTensionCarlosRuth'],
        preserve: true,
      },
    }
  },

  'jungleShrine': {
    name: "Jungle Shrine",
    imageUrl: 'jungleShrine.png',
    rest: 600,
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
  'ideaGatherSurvivors': {
    name: 'Idea: Gather Survivors',
    imageUrl: "ideaGatherSurvivors.png",
    idea: true,
    cardText: <div>
      Small Fire,<br/> 4 Survivors
    </div>
  },
  'ideaHatchet': {
    name: 'Idea: Hatchet',
    imageUrl: "ideaHatchet.png",
    idea: true,
    cardText: <div>
      <div>Sticks and Flint</div>
    </div>
  },
  'ideaShelter': {
    name: 'Idea: Shelter',
    imageUrl: "ideaShelter.png",
    idea: true,
    cardText: <div>
      <div>3 Logs, 2 Palm Leaves</div>
    </div>
  },

  // Encounters

  'distantFigure': {
    name: "Distant Figure",
    imageUrl: "distantFigure.png",
  },
  'feyHorror': {
    name: "Fey Horror",
    backgroundImage: "feyHorror.jpg",
    maxFading: 20
  },
  'miloUnsettlingFeeling': {
    name: "Unsettled Feeling",
    backgroundImage: "miloUnsettledFeeling.jpg",
    idea: true,
    cardText: <div>
      <em>I felt the tree screaming as my axe bit into it</em>
    </div>
  },
  'ruthUnsettlingFeeling': {
    name: "Unsettled Feeling",
    backgroundImage: "ruthUnsettlingFeeling.jpg",
    idea: true,
    cardText: <div>
      <em>I felt the tree screaming as my axe bit into it</em>
    </div>
  },
  'carlosUnsettlingFeeling': {
    name: "Unsettled Feeling",
    backgroundImage: "carlosUnsettlingFeeling.png",
    idea: true,
    cardText: <div>
      <em>I felt the tree screaming as my axe bit into it</em>
    </div>
  },

  'sexualTensionCarlosRuth': {
    name: "Sexual Tension",
    imageUrl: "sexualTensionRuthCarlos.png",
    idea: true,
  }
}
