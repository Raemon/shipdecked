import React from "react";
import { CardSlug } from "./cards";

export interface CardType {
  imageUrl?: string,
  nightImageUrl?: string,
  backgroundImage?: string,
  nightBackgroundImage?: string,
  name: string,
  large?: boolean,
  idea?: true,
  maxHunger?: number;
  maxHealth?: number;
  maxFuel?: number;
  calories?: number;
  fuel?: number;
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
  currentHealth?: number,
  currentFuel?: number,
  zIndex: number
}

export type CardPositionInfo = {
  cardPositions: CardPosition[],
  i: number,
  setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>
}

export type SpawnInfo = Partial<Record<CardSlug, {
  duration: number, 
  inputStack?: CardSlug[], 
  output?: CardSlug|CardSlug[], 
  preserve?:boolean, 
  descriptor: string,
}>>
