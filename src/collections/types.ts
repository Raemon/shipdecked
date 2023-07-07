import React from "react";
import { CardSlug } from "./units";
export interface CardType {
  imageUrl?: string,
  nightImageUrl?: string,
  backgroundImage?: string,
  nightBackgroundImage?: string,
  type?: string,
  name: string,
  maxHunger?: number;
  calories?: number;
  loot?: CardSlug[];
  spawnInfo?: SpawnInfo;
  spawnDescriptor?: string,
  creatingDescriptor?: string,
  cardText?: string|React.ReactNode,
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
  zIndex: number
}

export type CardPositionInfo = {
  cardPositions: CardPosition[],
  i: number,
  setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>
}

export type SpawnInfo = Partial<Record<CardSlug, {time: number, stack?: CardSlug[], product?: CardSlug, preserve?:boolean, descriptor?: string}>>
