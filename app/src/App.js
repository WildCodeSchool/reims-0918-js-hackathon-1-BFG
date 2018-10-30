import React, { Component } from "react";
import { Container } from "reactstrap";

import HomeButtons from "./HomeButtons";
import Header from "./Header";
import Footer from "./Footer";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Container>
          <HomeButtons />
        </Container>

        <Footer />
      </div>
    );
  }
}

export default App;
