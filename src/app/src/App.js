import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import {LoadingContainer} from "drizzle-react-components";
import { Router } from 'react-router';

import "./App.css";
import drizzleOptions from "./drizzleOptions";
import store, {history} from "./store";
import Home from "./Home";

import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAjQAoc785iVH4wrK2EuAkoQ42JI1482hE",
  authDomain: "auction-dapp.firebaseapp.com",
  databaseURL: "https://auction-dapp.firebaseio.com",
  projectId: "auction-dapp",
  storageBucket: "auction-dapp.appspot.com",
  messagingSenderId: "869897458910",
  appId: "1:869897458910:web:d3f4713c909dbdc0"
};
firebase.initializeApp(firebaseConfig);


class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions} store={store}>
        <LoadingContainer>
            <Router history={history}>
                <Home/>
            </Router>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
