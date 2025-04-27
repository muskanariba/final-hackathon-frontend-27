import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home'; // Correct path
import Dashboard from './Components/Dashboard';

function App() {
  return (
<div>
<Home />
<Routes>
<Route path="/dashboard" element={<Dashboard />} />
</Routes>
</div>



   
  );
}

export default App;
