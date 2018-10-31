import React, { Component } from "react";
import { Container, Button, Row } from "reactstrap";

import HomeButtons from "./HomeButtons";
import Header from "./Header";
import Footer from "./Footer";
import getRandomNumber from "./getRandomNumber";
import FullInventory from "./FullInventory";
import AdressesListing from "./AdressesListing";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adresses: [],
      candiesList: [],
      adressesAndCandies: [],
      myCandies: [],
      huntingOpen: false,
      adresseOpen: false,
      myCandiesOpen: false,
      fullBag: []
    };
    this.tabsOpeningSystem = this.tabsOpeningSystem.bind(this);
    this.selectCandy = this.selectCandy.bind(this);
    this.backButton = this.backButton.bind(this);
    this.keepMyBag = this.keepMyBag.bind(this);
  }

  componentDidMount() {
    this.callApiAdresses();
    this.callApiCandies();
  }

  callApiAdresses() {
    for (let i = 0; i < 20; i++) {
      fetch(
        `https://api-adresse.data.gouv.fr/search/?q=Reims&postcode=51100&limit=20`
      )
        .then(results => results.json()) // conversion du résultat en JSON
        .then(data => {
          data.features.map(
            singleData => (
              (singleData.candiesHouse = []),
              (singleData.houseNumber = getRandomNumber(100))
            )
          );
          this.setState({
            adresses: { data }
          });
        });
    }
  }

  callApiCandies() {
    fetch(`https://fr-en.openfoodfacts.org/category/candies.json`)
      .then(results => results.json()) // conversion du résultat en JSON
      .then(data => {
        this.setState({
          candiesList: { data }
        });
      });
  }

  candiesAttribution() {
    const listAdresses = this.state.adresses.data.features;
    const adressesAndCandies = listAdresses.map(oneAdress => {
      const listNumberRandom = [];
      const candiesHouse = [];
      for (let j = 5; j > 0; j--) {
        const randomN = getRandomNumber(20);
        if (!listNumberRandom.includes(randomN)) {
          listNumberRandom.push(randomN);
          let oneCandy = this.state.candiesList.data.products[randomN];
          candiesHouse.push({ ...oneCandy });
        } else j++;
      }
      return { ...oneAdress, candiesHouse };
    });
    this.setState({
      huntingOpen: true,
      adressesAndCandies
    });
  }

  tabsOpeningSystem(tabName) {
    tabName === "adresse"
      ? this.setState({
          adresseOpen: true,
          myCandiesOpen: false
        })
      : this.setState({
          adresseOpen: false,
          myCandiesOpen: true
        });
  }

  selectCandy(id) {
    let newCandy = this.state.candiesList.data.products.find(product => {
      if (product.id === id) {
        return product;
      }
    });
    this.setState({
      myCandies: [...this.state.myCandies, newCandy]
    });
  }

  backButton() {
    this.setState({
      adresseOpen: false,
      myCandiesOpen: false
    });
  }

  keepMyBag() {
    let newBag = this.state.myCandies;
    this.setState({
      adresseOpen: false,
      myCandies: [],
      fullBag: [...this.state.fullBag, newBag]
    });
  }

  render() {
    return (
      <div className="App font">
        <Header />
        <Container fluid>
          {!this.state.huntingOpen ? (
            <Button
              className="chasseinit"
              onClick={() => this.candiesAttribution()}
            >
              Let's Hunt
            </Button>
          ) : (
            !this.state.adresseOpen &&
            (!this.state.myCandiesOpen && (
              <HomeButtons
                tabsOpeningFunction={this.tabsOpeningSystem}
                myCandies={this.state.myCandies}
              />
            ))
          )}
          {this.state.adresseOpen && (
            <AdressesListing
              backButton={this.backButton}
              selectCandy={this.selectCandy}
              adressesList={this.state.adressesAndCandies}
              myCandies={this.state.myCandies}
              keepMyBag={this.keepMyBag}
            />
          )}
          {this.state.myCandiesOpen && (
            <FullInventory
              fullBag={this.state.fullBag}
              backButton={this.backButton}
            />
          )}
        </Container>
        <footer className="footer w-100">
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
