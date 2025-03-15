import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import TechTree from './components/TechTree';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/tech-tree" element={<TechTree />} />
    </Routes>
  );
}

export default App;
