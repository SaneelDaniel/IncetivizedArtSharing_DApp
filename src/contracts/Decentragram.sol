pragma solidity ^0.5.0;

contract Decentragram {
    string public name = "DISP";

    // Store Posts
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) comments;

    // Create Posts
    struct Post {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
        uint256 commentsCount;
    }

    // Create Comments Object
    struct Comment {
        uint256 commentId;
        address commentAuthor;
        string commentDescription;
    }

    // Events Section

    // Create uploadPost event
    event postCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    // Post tipped event
    event PostTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    event CommentCreated(
        uint256 commentId,
        address commentAuthor,
        string description
    );

    // Events End

    function uploadPost(string memory _postHash, string memory _description)
        public
    {
        require(
            bytes(_description).length > 0,
            "The Post needs to have a Description "
        );
        require(bytes(_postHash).length > 0, "The post has was not found");
        require(msg.sender != address(0x0));

        postCount++;
        /*
        Post storage post = posts[postCount];

        post.id = postCount;
        post.hash = _postHash;
        post.description = _description;
        post.tipAmount = 0;
        post.author = msg.sender;
        post.commentsCount = 0;

        */
        posts[postCount] = Post(
            postCount,
            _postHash,
            _description,
            0,
            msg.sender,
            0
        );
        

        emit postCreated(postCount, _postHash, _description, 0, msg.sender);
    }

    // Tip Images
    function tipPostOwner(uint256 _id) public payable {
        // ID Validation
        require(_id > 0 && _id <= postCount);

        // Fetch the post from the blockchain
        Post memory _post = posts[_id];

        // Fetch the author
        address payable _author = _post.author;

        // Pay the author by sending them ether
        address(_author).transfer(msg.value);

        // Increment the tip tipAmount
        _post.tipAmount = _post.tipAmount + msg.value;

        // Update the post on the blockchain
        posts[_id] = _post;

        emit PostTipped(
            _id,
            _post.hash,
            _post.description,
            _post.tipAmount,
            _author
        );
    }

    // Comment on the post
    function uploadComment(uint256 _id, string memory _commentDescription)
        public
    {
        // ID Validation
        require(_id > 0 && _id <= postCount);

        // Fetch the post from the blockchain
        Post memory _post = posts[_id];

        // Fetch the author
        address payable _author = _post.author;

        // Fetch Comments & CommentsCount from the post
        //Comment[] storage _comments = _post.comments;

        uint256 commentCount = _post.commentsCount;

        /*
        // Add the Comment to the post
        commentCount++;
        _post.comments[commentCount] = Comment(
            commentCount,
            msg.sender,
            _commentDescription
        );

        // Emit CommentCreated Event
        emit CommentCreated(commentCount, msg.sender, _commentDescription);
        */
    }
}
