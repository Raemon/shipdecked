export type CardPosition = {
  slug: string;
  x: number;
  y: number;
  maybeAttached: number[];
  attached: number[];
  zIndex: number;
};

export type CardType = {
  name: string,
  imageUrl?: string,
  backgroundImage?: string,
  defaultZindex: number,
  whileAttached?: (
    cardPositions: CardPosition[], 
    i: number, 
    setCardPositions: React.Dispatch<React.SetStateAction<CardPosition[]>>
  ) => void
}