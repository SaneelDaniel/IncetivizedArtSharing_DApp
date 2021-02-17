import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Main from "./Main";

// Declare IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // leaving out the arguments will default to these values

class App extends Component {
  async componentWillMount() {
    this.loadWeb3();
    this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });

    // Code
    const networkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];

    if (networkData) {
      const decentragram = web3.eth.Contract(
        Decentragram.abi,
        networkData.address
      );
      this.setState({ decentragram });
      const postCount = await decentragram.methods.postCount().call();
      this.setState({ postCount });
      var postlistforsorting = [];
      // Load posts
      for (var i = 1; i <= postCount; i++) {
        const post = await decentragram.methods.posts(i).call();
        postlistforsorting.push(post);
        this.setState({
          posts: [...this.state.posts, post],
        });
      }

      postlistforsorting.sort((a, b) => b.tipAmount - a.tipAmount);

      for (var i = 0; i < this.state.posts.length; i++) {
        if (i > 2) {
          break;
        }
        const post = postlistforsorting[i];
        this.setState({
          trendingPosts: [...this.state.trendingPosts, post],
        });
      }

      this.setState({ loading: false });
    } else {
      window.alert(
        "Decentragram Contract is not available on the current network"
      );
    }
  }

  //Get Post Content
  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  uploadPost = (description) => {
    console.log("Submitting file to ipfs...");

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      this.state.decentragram.methods
        .uploadPost(result[0].hash, description)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  tipPostOwner(id, tipAmount) {
    this.setState({ loading: true });
    this.state.decentragram.methods
      .tipPostOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      decentragram: null,
      posts: [],
      loading: true,
      trendingPosts: [],
    };

    this.uploadPost = this.uploadPost.bind(this);
    this.tipPostOwner = this.tipPostOwner.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  render() {
    return (
      <div className="main">
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div
            id="loader"
            className="text-center mt-5"
            style={{ backgroundColor: "lightgray" }}
          >
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            posts={this.state.posts}
            captureFile={this.captureFile}
            uploadPost={this.uploadPost}
            tipPostOwner={this.tipPostOwner}
            trendingPosts={this.state.trendingPosts}
          />
        )}
      </div>
    );
  }
}

export default App;
