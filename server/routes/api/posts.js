const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Posts
router.get("/", async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

// Add Post
router.post("/", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({
    user: req.body.user,
    rating: req.body.rating,
    text: req.body.text,
    likes: req.body.likes,
    createdAt: new Date(),
  });
  res.status(201).send();
});

// Delete Post
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

// Update Post (Likes)
router.put("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.updateOne(
    { _id: new mongodb.ObjectID(req.params.id) },
    { $set: { likes: req.body.newLikes } }
  );
  res.status(201).send();
});

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://daniel:090502@vue-express.z8cvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );

  return client.db("vue-express").collection("posts");
}

module.exports = router;
