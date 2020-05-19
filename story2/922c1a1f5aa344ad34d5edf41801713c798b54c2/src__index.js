import React from "react";
import { render } from "react-dom";

const App = () => (
  <div>
    <h1>Tutorial!</h1>
  </div>
);

const Home = () => (
  <div>
    <h2>Welcome</h2>
  </div>
);

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
);

render(<App />, document.getElementById("root"));
