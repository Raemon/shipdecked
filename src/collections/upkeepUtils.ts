import { CardPositionInfo } from "./types";

function hungerCheck(cardPositionInfo:CardPositionInfo) {
  const hungerCards = cardPositionInfo.cardPositions.filter(cardPosition => cardPosition.maxHunger)
  const foodCards = [...cardPositionInfo.cardPositions.filter(cardPosition => cardPosition.calories)]
  hungerCards.forEach(cardPosition => {

  })
  return true
}