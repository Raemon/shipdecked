import { CardSlug } from "./units";
export interface CardType {
  imageUrl?: string,
  backgroundImage?: string,
  large?: boolean,
  name: string,
  zIndex: number;
  maxHunger?: number;
  calories?: number;
  spawnItems: Partial<Record<CardSlug, CardSlug[]>>;
  spawnDescriptor?: string,
  whileAttached?: (
    cardPositionInfo: CardPositionInfo
  ) => void
}

export interface CardPosition extends CardType {
  slug: CardSlug,
  x: number,
  y: number,
  maybeAttached: number[],
  attached: number[],
  timerStart?: Date,
  timerEnd?: Date,
  timerId?: NodeJS.Timeout,
  currentSpawnDescriptor?: string,
  currentHunger?: number,
}

export type CardPositionInfo = {
  cardPositions: CardPosition[],
  i: number,
  setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>
}