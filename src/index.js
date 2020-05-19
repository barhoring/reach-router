import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";

const App = () => (
  <div>
    <h1>Tutorial!</h1>
    <nav>
      <Link to="/">Home</Link> <Link to="dashboard">Dashboard</Link>{" "}
      <Link to="/invoices">Invoices</Link>{" "}
    </nav>
    <Router>
      <Home path="/" />
      <Dashboard path="/dashboard" />
      <Invoices path="/invoices">
        <InvoicesIndex path="/" />
        <Invoice path="/:invoiceId" />
      </Invoices>
      <NotFound default />
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

const Invoices = (props) => (
  <div>
    <h2>Invoices</h2>
    <ul>
      <li>
        <Link to="123">Invoice 123</Link>
      </li>
      <li>
        <Link to="abc">Invoice ABC</Link>
      </li>
    </ul>

    <form
      onSubmit={(event) => {
        event.preventDefault();
        const id = event.target.elements[0].value;
        console.log(id);
        event.target.reset();
        // pretend like we saved a record to the DB here
        // and then we navigate imperatively

        props.navigate(id); // like navigate(`/invoices/${id}`);
        console.log(id);
      }}
    >
      <p>
        <label>
          New Invoice ID: <input type="text" />
        </label>
      </p>
      <button type="submit">create</button>
    </form>

    {props.children}
  </div>
);

const InvoicesIndex = () => (
  <div>
    <p>Maybe put some pretty graphs here or something.</p>
  </div>
);

const NotFound = () => <p>sorry, nada here</p>;

render(<App />, document.getElementById("root"));
