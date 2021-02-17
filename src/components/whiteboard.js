<div className="customComponent__container">
              {this.props.trendingPosts.map((trendingPost, key) => {
                return (
                  <div className="customVideo__container" key={key}>
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
                      <small className="text-muted">{trendingPost.author}</small>
                    </div>
                    <ul id="trendingPostList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center">
                          <img
                            src={`https://ipfs.infura.io/ipfs/${trendingPost.hash}`}
                            style={{ maxWidth: "420px", maxHeight: "340px" }}
                          />
                        </p>
                        <p>{trendingPost.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
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
                            this.props.tiptrendingPostOwner(
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