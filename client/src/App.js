import React, { useState } from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import HomePage from './Components/HomePage';

function App() {
  
  return(
    <div>

   <BrowserRouter>
   <Routes>
    <Route path="/" Component={HomePage} />
   </Routes>
   </BrowserRouter>

    </div>
  );

}

export default App;
