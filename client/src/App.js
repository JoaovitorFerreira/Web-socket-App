import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Pages from "./Pages/Pages";
import StockPrice from "./Pages/StockPrice/StockPrice";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Pages />}>
        <Route index element={<Home />} />
        <Route path="stockPrice" element={<StockPrice />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
