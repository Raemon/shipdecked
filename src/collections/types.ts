import { CardSlug } from "./units";
export interface CardType {
  imageUrl?: string,
  backgroundImage?: string,
  large?: boolean,
  name: string,
  zIndex: number;
  hunger?: boolean;
  spawnItems: Partial<Record<CardSlug, CardSlug[]>>;
  whileAttached?: (
    cardPositionInfo: CardPositionInfo
  ) => void
}

export interface CardPosition extends CardType {
  slug: CardSlug;
  x: number;
  y: number;
  maybeAttached: number[];
  attached: number[];
  timerStart?: Date;
  timerEnd?: Date;
  timerId?: NodeJS.Timeout;
};

export type CardPositionInfo = {
  cardPositions: CardPosition[],
  i: number,
  setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>
}