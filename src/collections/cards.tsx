import React from 'react';
import { CardType, SpawnInfo } from "./types"

export const startingCards: CardSlug[] = [
  'ruth', 
  'shoresidePath', 'crate', 'raft', 'shelteredCove'
]

export type CardSlug = 
  'carlos'|'ruth'|'milo'|
  'coconutTree'|'tree'|'ancientTree'|'jungleTree'|'bananaTree'|
  'fallenLog'|'driftWoodLog'|'hewnLog'|'flint'|'sticks'|'longStick'|'rocks'|'smallRoundStone'|
  'coconut'|'seaweed'|'cannedBeans'|'bakedSeaweed'|'bananas'|'openCoconut'|
  'shipwreckedCorpse'|
  'palmLeaves'|'vine'|
  'shoresidePath'|'shelteredCove'|'denseJungle'|'junglePath'|'birdIsland'|'shipwreckedCove'|'craggyCliffs'|'coastalWaters'|
  'carlosFootprints'|'jungleFootprints'|
  'crate'|
  'smallFire'|
  'raft'|'birdDroppings'|
  'ideaFire'|'ideaRaft'|'ideaHatchet'|'ideaShelter'|'ideaRope'|
  'ideaGatherSurvivors'|'ideaEscape'|
  'sexualTensionCarlosRuth'|
  'shelter'|
  'hatchet'|'spear'|'hammer'|'workBench'|'rope'|
  'distantFigure'|'feyHorror'|'jungleShrine'|
  'miloUnsettlingFeeling'|'carlosUnsettlingFeeling'|'ruthUnsettlingFeeling'|
  'wildBoar'

const characterSpawnInfo: SpawnInfo[] = [
  { inputStack: ['shoresidePath'], duration: 1000, descriptor: "Exploring...", preserve: true },
  { inputStack: ['shipwreckedCove'], duration: 3000, descriptor: "Exploring...", preserve: true },
  { inputStack: ['craggyCliffs'], duration: 3000, descriptor: "Exploring...", preserve: true },
  { inputStack: ['denseJungle'], duration: 60000, descriptor: "Exploring...", preserve: true},
  { inputStack: ['crate'], duration: 1000, descriptor: "Opening..." },
  { inputStack: ['rocks'], duration: 3000, descriptor: "Chipping..." },
  { 
    duration: 6000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'fallenLog', 'sticks'], 
    output: ['smallFire'], 
  },
  {
    duration: 12000,
    descriptor: "Building...",
    inputStack: ['rope', 'rope', 'fallenLog', 'fallenLog', 'fallenLog', 'fallenLog', 'fallenLog'],
    output: ['raft'], 
  },
  { 
    duration: 6000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'driftWoodLog', 'sticks'], 
    output: ['smallFire'],  
  },
  { 
    duration: 6000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'hewnLog', 'sticks'], 
    output: ['smallFire'],  
  },
  {
    duration: 1000, 
    descriptor: "Building...", 
    inputStack: ['flint', 'sticks'], 
    output: ['hatchet'],
  },
  {
    duration: 1000,
    descriptor: "Building...",
    inputStack: ['hewnLog', 'hewnLog', 'palmLeaves'],
    output: ['shelter'],
  },

  {
    duration: 1000,
    descriptor: "Building...",
    inputStack: ['fallenLog', 'fallenLog', 'palmLeaves'],
    output: ['shelter'],
  },
  { 
    duration: 6000, 
    descriptor: "Chopping...", 
    inputStack: ['hatchet', 'coconutTree'], 
    output: ["coconut", "fallenLog", "palmLeaves"],
    attachedOutput: ['hatchet']
  },
  {
    duration: 6000,
    descriptor: "Chopping...",
    inputStack: ['hatchet', 'fallenLog'],
    output: ['hewnLog', 'hewnLog', 'sticks'],
    attachedOutput: ['hatchet']
  },
  {
    duration: 6000,
    descriptor: "Chopping...",
    inputStack: ['hatchet', 'driftWoodLog'],
    output: ['hewnLog', 'hewnLog', 'sticks'],
    attachedOutput: ['hatchet']
  },
  {
    duration: 6000,
    descriptor: "Building...", 
    inputStack: ['smallRoundStone', 'sticks'], 
    output: ['hammer'],
  },
  {  
    duration: 3000, 
    descriptor: "Staring Frustratedly...", 
    skipIfExists: ['hatchet', 'ideaHatchet'], 
    preserve: true,
    inputStack: ['coconutTree'],
    output: ['ideaHatchet'], 
  },
  {
    duration: 1500,
    descriptor: "Cracking...",
    inputStack: ['coconut', 'hatchet'],
    output: ['openCoconut', 'hatchet']
  },
  {
    duration: 6000, 
    descriptor: "Chopping Tree...",  
    inputStack: ['hatchet', 'bananaTree'],
    output: ['bananas', 'bananas', 'bananas', 'fallenLog', 'palmLeaves', 'hatchet'], 
  },
  {
    duration: 3000,
    descriptor: "Chopping",
    inputStack: ['jungleTree', 'hatchet'],
    output: ['sticks', 'fallenLog', 'fallenLog', 'vine', 'hatchet']
  },
  {
    duration: 3000,
    descriptor: "Weaving",
    inputStack: ['vine', 'vine', 'vine'],
    output: ['rope']
  },
  {
    duration: 3000,
    descriptor: "Following...",
    inputStack: ['distantFigure'], 
    consumeInitiator: true,
    output: ['feyHorror', 'jungleFootprints'],
  },
  {
    duration: 3000,
    descriptor: "Sitting quietly...",
    inputStack: ['jungleShrine'],
    output: ['ideaEscape'],
  },
  { 
    skipIfExists: ['ideaRope'], 
    inputStack: ['vine'],
    duration: 3000, preserve: true, descriptor: "Thinking...", 
    output: ['ideaRope'] 
  },
  {
    duration: 6000,
    descriptor: "Rowing...",
    inputStack: ['raft', 'shelteredCove'],
    output: ['ideaEscape'],
  },
]

export const allCards: Record<CardSlug, CardType> = {
  "ruth": {
    name: 'Ruth',
    imageUrl: 'ruth.png',
    nightImageUrl: 'nightRuth.png',
    maxHunger: 2000,
    maxStamina: 2000,
    maxHealth: 6,
    spawnInfo: [
      ...characterSpawnInfo,
      { inputStack: ['carlosFootprints'], duration: 5000, descriptor: "Following..." },
      { 
        skipIfExists: ['ideaFire'], 
        inputStack: ['carlos'],
        duration: 3000, preserve: true, descriptor: "Talking...", 
        output: ['ideaFire'] 
      },
      { 
        skipIfExists: ['ideaRaft'], 
        inputStack: ['milo'],
        duration: 3000, preserve: true, descriptor: "Talking...", 
        output: ['ideaRaft'] 
      },
      {
        duration: 30000,
        descriptor: "Chopping...",
        inputStack: ['hatchet', 'ancientTree'],
        output: ['sticks', 'fallenLog', 'fallenLog', 'fallenLog', 'hatchet', 'ruthUnsettlingFeeling']
      },
      { 
        duration: 6000, 
        descriptor: "Stare into flames...", 
        inputStack: ['smallFire'], 
        skipIfExists: ['ideaGatherSurvivors'], 
        output: ["ideaGatherSurvivors"],
        preserve: true,
      },
      { 
        duration: 6000, 
        descriptor: "Stare in horror...", 
        inputStack: ['shipwreckedCorpse'], 
        skipIfExists: ['ideaEscape'], 
        output: ["ideaEscape"],
        preserve: true,
      }
    ]
  },
  "carlos": {
    name: 'Carlos',
    imageUrl: 'carlos.png',
    maxHunger: 2800,
    maxStamina: 2000,
    maxHealth: 10,
    spawnInfo: [
      ...characterSpawnInfo,
      { 
        duration: 6000, 
        descriptor: "Talking...", 
        inputStack: ['smallFire', 'ruth'], 
        output: ["ideaShelter"],
        preserve: true,
      },
      {
        duration: 30000,
        descriptor: "Chopping...",
        inputStack: ['hatchet', 'ancientTree'],
        output: ['sticks', 'fallenLog', 'fallenLog', 'fallenLog', 'hatchet', 'carlosUnsettlingFeeling', 'palmLeaves']
      },
    ]
  },
  'milo': {
    name: 'Milo',
    imageUrl: 'milo.png',
    maxHunger: 2000,
    maxStamina: 2000,
    maxHealth: 6,
    spawnInfo: [
      ...characterSpawnInfo,
      {
        duration: 30000,
        descriptor: "Chopping...",
        inputStack: ['hatchet', 'ancientTree'],
        output: ['sticks', 'fallenLog', 'fallenLog', 'fallenLog', 'hatchet', 'miloUnsettlingFeeling']
      },
    ]
  },
  'sticks': {
    name: "Sticks",
    imageUrl: 'sticks.png',
    fuel: 100,
  },
  'longStick': {
    name: "Long Sticks",
    imageUrl: 'longStick.jpg',
    fuel: 200,
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
  'fallenLog': {
    name: "Fallen Log",
    imageUrl: 'fallenLog.png',
    fuel: 400,
  },
  'hewnLog': {
    name: "Hewn Logs",
    imageUrl: 'hewnLogs.png',
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
    loot: ['coconutTree', 'flint', 'sticks', 'shipwreckedCove'],
    secondaryLoot: ['crate', 'coconutTree', 'coconutTree', 'rocks', 'sticks', 'flint'],
    spawnDescriptor: "Exploring...",
  },
  'denseJungle': {
    name: "Dense Jungle",
    backgroundImage: "denseJungle.jpg",
    large: true,
    spawnDescriptor: "Exploring...",
    loot: ['craggyCliffs', 'jungleTree', 'jungleTree', 'wildBoar', 'ancientTree', 'distantFigure', 'jungleShrine'],
  },
  'junglePath': {
    name: "Jungle Path",
    backgroundImage: "junglePath.png",
    large: true,
    spawnDescriptor: "Exploring...",
    loot: ['coconutTree', 'craggyCliffs', 'jungleTree', 'jungleTree', 'coconutTree', 'wildBoar', 'ancientTree', 'distantFigure', 'tree', 'jungleShrine'],
  },
  'shipwreckedCove': {
    name: "The Shipwreck",
    backgroundImage: "shipwreckedCove.jpg",
    large: true,
    loot: ['shipwreckedCorpse'], 
    secondaryLoot: ['rocks', 'crate', 'seaweed', 'crate', 'flint', 'denseJungle', 'carlosFootprints' ],
    spawnDescriptor: "Exploring...",
  },
  'shelteredCove': {
    name: "Sheltered Cove",
    backgroundImage: "shelteredCove.png",
    large: true,
    loot: ['carlos'],
    secondaryLoot: ['rocks', 'coconutTree', 'seaweed', 'fallenLog', 'coconutTree', 'flint'],
  },
  'craggyCliffs': {
    name: "Craggy Cliffs",
    backgroundImage: "craggyCliffs.jpg",
    large: true,
    loot: ['rocks', 'rocks', 'milo', 'sticks', 'sticks'],
    spawnDescriptor: "Exploring...",
  },
  'coastalWaters': {
    name: "Coastal Waters",
    backgroundImage: "shallowWaters.jpg",
    large: true,
    loot: ['seaweed', 'seaweed'],
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
    loot: ['flint', 'flint', 'smallRoundStone'],
  },
  'vine': {
    name: "Vine",
    imageUrl: "vine.png"
  },
  'rope': {
    name: "Rope",
    imageUrl: "rope.png"
  },
  'seaweed': {
    name: "Seaweed",
    imageUrl: "seaweed.png",
    calories: 100,
    spawnInfo: [
      {
        duration: 3000,
        descriptor: "Cooking...",
        inputStack: ['smallFire'],
        output: ['bakedSeaweed'],
        preserve: true,
        consumeInitiator: true
      }
    ]
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
  'smallRoundStone': {
    name: "Small Stone",
    imageUrl: 'smalRoundStone.png',
  },
  'cannedBeans': {
    name: "Canned Beans",
    imageUrl: "cannedBeans.png",
    calories: 500,
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
  'shipwreckedCorpse': {
    name: "Shipwrecked Corpse",
    imageUrl: "shipwreckedCorpse.png",
    loot: ['ideaEscape'],
    maxDecay: 1500,
    spawnDescriptor: "Staring in horror....",
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

  'hammer': {
    name: "Hammer",
    imageUrl: 'hammer.png',
  },
  'workBench': {
    name: "Work Bench",
    imageUrl: 'crudeWorkbench.png',
  },

  'shelter': {
    name: "Small Shelter",
    imageUrl: 'shelter.png',
    rest: 600,
    spawnInfo: [
      {
        duration: 6000,
        descriptor: "Awkwardly resting...",
        inputStack: ['carlos', 'ruth'],
        output: ['sexualTensionCarlosRuth'],
        skipIfExists: ['sexualTensionCarlosRuth'],
        preserve: true,
      },
    ]
  },

  'jungleShrine': {
    name: "Jungle Shrine",
    imageUrl: 'jungleShrine.png'
  },

  // Ideas/Dreams

  'ideaFire': {
    name: 'Idea: Fire',
    imageUrl: 'ideaFire.png',
    idea: true,
    cardText: <div>Sticks, Log and Flint</div>
  },
  'ideaRope':{
    name: "Idea: Rope",
    imageUrl: 'ideaRope.png',
    idea: true,
    cardText: <div>3 Vines</div>
  },
  'ideaRaft': {
    name: 'Idea: Raft',
    imageUrl: "ideaRaft.png",
    idea: true,
    cardText: <div>
      <div>2 Rope, 5 Logs</div>
    </div>
  },
  'ideaEscape': {
    name: 'Idea: Escape',
    backgroundImage: "ideaEscape.jpg",
    idea: true,
    large: true,
    cardText: <div>
      <p><em>Need to get out of here...</em></p>
      <div>Raft, Sheltered Cove</div>
    </div>
  },
  'ideaGatherSurvivors': {
    name: 'Idea: Gather Survivors',
    imageUrl: "ideaGatherSurvivors.png",
    idea: true,
    large: true,
    cardText: <div>
      Small Fire,<br/> 4 Survivors
    </div>
  },
  'ideaHatchet': {
    name: 'Idea: Hatchet',
    imageUrl: "ideaHatchet.png",
    idea: true,
    cardText: <div>
      <div>Attach Ruth to <br/> <b><em>Sticks</em></b> and <b><em>Flint</em></b><br/> to make a hatchet</div>
    </div>
  },
  'ideaShelter': {
    name: 'Idea: Shelter',
    imageUrl: "ideaShelter.png",
    idea: true,
    cardText: <div>
      <div>2 Hewn Logs, Palm Leaves</div>
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
    maxFading: 100
  },
  'wildBoar': {
    name: "Wild Boar",
    imageUrl: "wildBoar.png",
    maxHealth: 20,
    maxHunger: 3000,
    damagePerSecond: 5,
    tracks: ['bananas', 'openCoconut', 'cannedBeans', 'bakedSeaweed'],
    enemy: true,
    spawnInfo: []
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
    backgroundImage: "carlosUnsettledFeeling.jpg",
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
