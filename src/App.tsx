import React from 'react';
import Game from './components/Game';
import { allCards } from './collections/cards';


function App() {
  Object.values(allCards).forEach(unit => {
    const img = new Image();
    console.log("loading", unit.imageUrl)
    img.src = unit.imageUrl || ""
  })
  return (
    <Game/>
  );
}

export default App;
