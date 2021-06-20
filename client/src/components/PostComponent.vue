<template>
  <div class="container">
    <div class="product-container">
      <div class="product-img-container">
        <img class="product" alt="switch" src="../assets/switch.jpg" />
      </div>
      <div class="product-text">
        <h2>Nintendo Switch with Neon Blue and Neon Red Joy‑Con</h2>
        <h3>
          ★
          {{ avgRating > 1.5 ? "★" : "☆" }}
          {{ avgRating > 2.5 ? "★" : "☆" }}
          {{ avgRating > 3.5 ? "★" : "☆" }}
          {{ avgRating > 4.5 ? "★" : "☆" }}&ensp;{{ avgRating }} out of 5
        </h3>
        <p>
          Introducing Nintendo Switch, the new home video game system from
          Nintendo. In addition to providing single and multiplayer thrills at
          home, the Nintendo Switch system can be taken on the go so players can
          enjoy a full home console experience anytime, anywhere. The mobility
          of a handheld is now added to the power of a home gaming system, with
          unprecedented new play styles brought to life by the two new Joy-Con
          controllers.
        </p>
      </div>
    </div>
    <hr />
    <h1>Reviews</h1>
    <div class="write-review">
      <form class="create-post" v-on:submit="createPost">
        <h3>Write a review</h3>
        <div>
          <label for="user">Your name:&ensp;</label>
          <input
            type="text"
            id="input-user"
            v-model="user"
            placeholder=""
            required
          />
          <label class="rating" for="rating">Rating:&ensp;</label>
          <input
            type="number"
            id="input-rating"
            v-model.number="rating"
            placeholder=""
            min="1"
            max="5"
            required
          />
          <label for="rating"> out of 5</label>
        </div>
        <div>
          <label for="create-post">Add a title:&ensp;</label>
          <input
            type="text"
            id="input-title"
            v-model="title"
            placeholder=""
            required
          />
        </div>
        <div>
          <label for="create-post">Your review:&ensp;</label>
          <input
            type="text"
            id="input-text"
            v-model="text"
            placeholder=""
            required
          />
        </div>
        <div class="submit">
          <input type="submit" />
        </div>
      </form>
    </div>
    <p class="error" v-if="error">{{ error }}</p>
    <div class="posts-container">
      <div
        class="post"
        v-for="(post, index) in posts"
        v-bind:item="post"
        v-bind:index="index"
        v-bind:key="post._id"
      >
        <div class="title">
          <h3>
            ★
            {{ post.rating >= 2 ? "★" : "☆" }}
            {{ post.rating >= 3 ? "★" : "☆" }}
            {{ post.rating >= 4 ? "★" : "☆" }}
            {{ post.rating == 5 ? "★" : "☆" }}&ensp;{{ post.title }}
          </h3>
        </div>
        <div class="userdate">
          <p>
            Reviewed by {{ post.user }} on
            {{
              `${
                post.createdAt.getMonth() + 1
              }/${post.createdAt.getDate()}/${post.createdAt.getFullYear()}`
            }}
          </p>
        </div>
        <div class="text">
          <p>{{ post.text }}</p>
        </div>
        <div class="helpful">
          <p>
            {{ post.likes }} {{ post.likes === 1 ? "person" : "people" }} found
            this helpful.
          </p>
          <h3>|</h3>
          <label for="like">Was this helpful? </label>
          <button
            type="checkbox"
            id="input-like"
            v-on:click="likePost(post._id, post.likes)"
          >Yes</button>
          <button
            type="checkbox"
            id="input-unlike"
            v-on:click="unlikePost(post._id, post.likes)"
          >No</button>
        </div>
        <div class="delete">
          <button v-on:click="deletePost(post._id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostService from "../PostService";

export default {
  name: "PostComponent",
  data() {
    return {
      posts: [],
      error: "",
      user: "",
      rating: "",
      title: "",
      text: "",
      likedPosts: new Set(),
      avgRating: "",
      numPosts: "",
    };
  },
  async created() {
    try {
      this.posts = await PostService.getPosts();
      this.calcAvgRating();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async createPost() {
      console.log(this.rating);
      await PostService.insertPost(
        this.user,
        this.rating,
        this.title,
        this.text
      );
      this.posts = await PostService.getPosts();
      this.calcAvgRating();
    },
    async deletePost(id) {
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
      this.calcAvgRating();
    },
    async likePost(id, likes) {
      if (this.likedPosts.has(id)) {
        console.log("Post " + id + " already voted as helpful.")
      } else {
        this.likedPosts.add(id);
        await PostService.likePost(id, likes);
        this.posts = await PostService.getPosts();
      }
    },
    async unlikePost(id, likes) {
      if (this.likedPosts.has(id)) {
        this.likedPosts.delete(id);
        await PostService.unlikePost(id, likes);
        this.posts = await PostService.getPosts();
      } else {
        console.log("Post " + id + " has not been voted as helpful.")
      }
    },
    async calcAvgRating() {
      this.avgRating = 0;
      this.numPosts = 0;
      this.posts.forEach((post) => {
        this.avgRating += post.rating;
        this.numPosts++;
      });
      if (this.numPosts > 0) {
        this.avgRating /= this.numPosts;
        this.avgRating = Math.round(this.avgRating * 10) / 10;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "./PostComponent.css";
</style>
