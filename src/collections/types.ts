import { type } from "os";
import React, { ReactElement } from "react";
import { CardSlug } from "./cards";

export interface MaxCardAttributes {
  maxHunger?: number;
  maxHealth?: number;
  maxFuel?: number;
  maxStamina?: number;
  maxFading?: number;
  maxDecay?: number;
  maxTemp?: number;
}

export interface CurrentCardAttriutes {
  currentHunger?: number;
  currentHealth?: number;
  currentFuel?: number;
  currentStamina?: number;
  currentFading?: number;
  currentDecay?: number;
  currentTemp?: number
}

export interface AttributeInfo extends MaxCardAttributes, CurrentCardAttriutes {}
export interface CardTypeBase {
  imageUrl?: string,
  nightImageUrl?: string,
  backgroundImage?: string,
  nightBackgroundImage?: string,
  name: string|React.ReactNode,
  large?: boolean,
  idea?: true,
  calories?: number;
  fuel?: number;
  rest?: number;
  heat?: number;
  loot?: CardSlug[];
  secondaryLoot?: CardSlug[];
  spawnInfo?: SpawnInfo[];
  spawnDescriptor?: string,
  creatingDescriptor?: string,
  cardText?: string|React.ReactNode,
  Widget?: any,
  damagePerSecond?: number,
  tracks?: CardSlug[],
  enemy?: boolean,
  whileAttached?: (
    cardPositionInfo: CardPositionInfo
  ) => void
}

export interface CardType extends CardTypeBase, MaxCardAttributes {}

export interface CardPositionBase extends CardType {
  id: string,
  slug: CardSlug,
  x: number,
  y: number,
  destinationX?: number,
  destinationY?: number,
  destinationSpeed?: number,
  maybeAttached: string[],
  attached: string[],
  timerStart?: Date,
  timerEnd?: Date,
  timerId?: NodeJS.Timeout,
  spawningStack?: CardSlug[],
  currentSpawnDescriptor?: string,
  hide?: boolean,
  zIndex: number,
  dragging?: boolean,
  createdAt: Date,
}

export interface CardPosition extends CardPositionBase, CurrentCardAttriutes, MaxCardAttributes {}

export type CardPositionInfo = {
  cardPositions: Record<string, CardPosition>,
  id: string,
  setCardPositions: React.Dispatch<React.SetStateAction<Record<string, CardPosition>>>
}

export type SpawnInfo = {
  lootInput?: CardSlug,
  duration: number, 
  inputStack?: CardSlug[], 
  damage?: number,
  output?: CardSlug[], 
  attachedOutput?: CardSlug[],
  preserve?:boolean, 
  consumeInitiator?: boolean,
  descriptor: string,
  skipIfExists?: CardSlug[],
}
