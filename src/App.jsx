import React from 'react';
import {
  Button, Container, Nav, Navbar
} from 'react-bootstrap';
import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom"
import './App.css';

function App() {
  return (
    <Container fluid={true}>
      <Router>
        <header>
          <Navbar>
            <AuthButton />
            <Nav>
              <Nav.Link>
                <Link to="/info">Info Page</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/invoice">Create Invoice</Link>
              </Nav.Link>
            </Nav>
          </Navbar>
        </header>
        <main>
          <Switch>
            <Route path="/info">
              <PublicPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/invoice">
              <InvoicePage />
            </PrivateRoute>
          </Switch>
        </main>
      </Router>
    </Container>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function AuthButton() {
  let history = useHistory();

  return fakeAuth.isAuthenticated ? (
    <div>
      Welcome!{" "}
      <Button
        onClick={() => {
          fakeAuth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </Button>
    </div>
  ) : (
      <Button as={Link} to="/login">Login</Button>
    );
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }

    />
  );

}

function PublicPage() {
  return <h3>Create Invoices here</h3>;
}

function InvoicePage() {
  return <h3>Clients/Invoices</h3>;
}

function LoginPage() {
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    fakeAuth.authenticate(() => {
      history.replace(from);
    });
  }
  return (
    <div>
      <p>You must login to view the page at {from.pathname}</p>
      <Button onClick={login}>Log in</Button>
    </div>
  );
}

export default App;
