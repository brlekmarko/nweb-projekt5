import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage/homePage";
import Page404 from './pages/page404/page404';
import IdeasPage from './pages/ideasPage/ideasPage';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route
          path={"/"}
          element={<HomePage/>}
        />

        <Route
          path={"/ideas"}
          element={<IdeasPage/>}
        />

        <Route
          path={"*"}
          element={<Page404/>}
        />
    </Routes>
    </div>
  );
}

export default App;
