import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";

const App = () => (
  <div>
    <h1>Tutorial!</h1>
    <nav>
      <Link to="/">Home</Link> <Link to="dashboard">Dashboard</Link>{" "}
      <Link to="invoices/123">Invoice 123</Link>{" "}
      <Link to="invoices/abc">Invoice ABC</Link>{" "}
    </nav>
    <Router>
      <Home path="/" />
      <Dashboard path="/dashboard" />
      <Invoice path="/invoices/:invoiceId" />
    </Router>
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

const Invoice = (props) => (
  <div>
    <h2>Invoice {props.invoiceId}</h2>
  </div>
);

render(<App />, document.getElementById("root"));
