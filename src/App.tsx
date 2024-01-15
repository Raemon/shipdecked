import React from 'react';
import Game from './components/Game';
import { units } from './collections/cards';


function App() {
  Object.values(units).forEach(unit => {
    const img = new Image();
    console.log("loading", unit.imageUrl)
    img.src = unit.imageUrl || ""
  })

  return (
    <Game/>
  );
}

export default App;
