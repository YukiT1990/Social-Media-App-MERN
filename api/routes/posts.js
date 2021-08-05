const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// router.get("/", (req, res) => {
//   console.log("post page");
//   res.send("hey its post page");
// })

// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (post.userId === req.body.userId) {
    //   await post.deleteOne();
    //   res.status(200).json("the post has been deleted");
    // } else {
    //   res.status(403).json("you can delete only your post");
    // }
    await post.deleteOne();
    res.status(200).json("the post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// like a post
router.put("/:id/like", async (req, res) => {
  try {
    // id in params is the post id
    const post = await Post.findById(req.params.id);
    // userId belongs to whome likes or dislikes the post
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// search posts by a keyword
router.get("/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const results = await Post.find({ desc: { $regex: keyword, $options: "i" } });
    // const results = await Post.find({ desc: keyword });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    // the user currently using the app
    const currentUser = await User.findById(req.params.userId);
    // all posts from the user
    const userPosts = await Post.find({ userId: currentUser._id });
    // all posts from friends the user follows
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;