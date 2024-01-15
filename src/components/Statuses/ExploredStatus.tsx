import React from 'react';
import { CardPosition, CardType } from '../../collections/types';

const ExploredStatus = ({card, cardPosition}:{card: CardType, cardPosition:CardPosition}) => {
  const maxLoot = (card.loot ?? []).length + (card.secondaryLoot ?? []).length
  if (maxLoot === 0) return null
  const currentLoot = (cardPosition.loot ?? []).length + (cardPosition.secondaryLoot ?? []).length
  if (currentLoot === 0) {
    return <>Fully Explored</>
  } else {
    return null
  }
}

export default ExploredStatus;