import React, { Component } from "react";
import Identicon from "identicon.js";
import "./CustomListItemComponent.css";

class Main extends Component {
  async componentWillMount() {
    console.log(this.props.trendingPosts);
  }

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <main
          role="main"
          className="col-lg-12 "
          style={{ maxWidth: "500px", flexDirection: "column" }}
        >
          <p>&nbsp;</p>
          <div>
            <h2>Share post</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const description = this.postDescription.value;
                this.props.uploadPost(description);
              }}
            >
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .bmp, .gif"
                onChange={this.props.captureFile}
              />
              <div className="form-group mr-sm-2">
                <br></br>
                <input
                  id="postDescription"
                  type="text"
                  ref={(input) => {
                    this.postDescription = input;
                  }}
                  className="form-control"
                  placeholder="post description..."
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg">
                Upload!
              </button>
            </form>
          </div>
        </main>
        <p>&nbsp;</p>
        <div className="bottom_container">
          <div className="customListItemComponent__container">
            <div className="h1">
              <h1>Trending Posts</h1>
            </div>
            <div className="customComponent__container">
              {this.props.trendingPosts.map((trendingPost, key) => {
                return (
                  <div className="card " key={key}>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        width="30"
                        height="30"
                        src={`data:trendingPost/png;base64,${new Identicon(
                          trendingPost.author,
                          30
                        ).toString()}`}
                      />
                      <small className="text-muted">
                        {trendingPost.author}
                      </small>
                    </div>
                    <ul
                      id="trendingPostList"
                      className="list-group list-group-flush"
                    >
                      <li className="list-group-item">
                        <p class="text-center">
                          <img
                            src={`https://ipfs.infura.io/ipfs/${trendingPost.hash}`}
                            style={{ maxWidth: "420px", maxHeight: "340px" }}
                          />
                        </p>
                        <p>{trendingPost.description}</p>
                      </li>
                      <li
                        key={key}
                        className="list-group-item "
                        style={{
                          maxHeight: "30px !important",
                          objectFit: "contain",
                        }}
                      >
                        <small className="float-left mt-1 text-muted">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            trendingPost.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={trendingPost.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei(
                              "0.1",
                              "Ether"
                            );
                            console.log(event.target.name, tipAmount);
                            this.props.tipPostOwner(
                              event.target.name,
                              tipAmount
                            );
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="h1">
              <h1>Browse Our Gallary</h1>
            </div>
            <div className="customComponent__container">
              {this.props.posts.map((post, key) => {
                return (
                  <div className="card" key={key}>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        width="30"
                        height="30"
                        src={`data:post/png;base64,${new Identicon(
                          post.author,
                          30
                        ).toString()}`}
                      />
                      <small className="text-muted">{post.author}</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center">
                          <img
                            src={`https://ipfs.infura.io/ipfs/${post.hash}`}
                            style={{ maxWidth: "420px", maxHeight: "340px" }}
                          />
                        </p>
                        <p>{post.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            post.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei(
                              "0.1",
                              "Ether"
                            );
                            console.log(event.target.name, tipAmount);
                            this.props.tipPostOwner(
                              event.target.name,
                              tipAmount
                            );
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
