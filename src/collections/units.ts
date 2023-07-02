export type CardType = {
  name: string,
  imageUrl: string,
}

export const units: Record<string, CardType> = {
  "villager1": {
    name: 'Villager',
    imageUrl: 'maleVillager.jpg',
  },
  "villager2": {
    name: 'Villager',
    imageUrl: 'femaleVillager.jpg',
  },
  'tree': {
    name: "Tree",
    imageUrl: 'tree.jpg',
  }
}

export const abilities = [
  { id: 1, name: 'Strength' },
]