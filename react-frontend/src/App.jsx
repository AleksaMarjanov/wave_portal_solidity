import React from "react";
import Wave from "../components/Wave";
import About from "../components/About";
import { Routes, Route } from "react-router";
import "./App.scss";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Wave />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
