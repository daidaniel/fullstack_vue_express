<template>
  <div class="container">
    <h1>Reviews</h1>
    <p>{{ avgRating }} / 5</p>
    <form class="create-post" v-on:submit="createPost">
      <label for="user">User name: </label>
      <input
        type="text"
        id="input-user"
        v-model="user"
        placeholder=""
        required
      />
      <br />
      <label for="rating">Rating: </label>
      <input
        type="number"
        id="input-rating"
        v-model.number="rating"
        placeholder=""
        min="1"
        max="5"
        required
      />
      <label for="rating">/5</label>
      <br />
      <label for="create-post">Title: </label>
      <input
        type="text"
        id="input-title"
        v-model="title"
        placeholder=""
        required
      />
      <br />
      <label for="create-post">Say Something: </label>
      <input
        type="text"
        id="input-text"
        v-model="text"
        placeholder=""
        required
      />
      <input type="submit" />
    </form>
    <hr />
    <p class="error" v-if="error">{{ error }}</p>
    <div class="posts-container">
      <div
        class="post"
        v-for="(post, index) in posts"
        v-bind:item="post"
        v-bind:index="index"
        v-bind:key="post._id"
      >
        {{
          `${
            post.createdAt.getMonth() + 1
          }/${post.createdAt.getDate()}/${post.createdAt.getFullYear()}`
        }}
        <p>{{ post.user }}</p>
        <p>{{ post.rating }} / 5</p>
        <p>{{ post.title }}</p>
        <p class="text">{{ post.text }}</p>
        <p>{{ post.likes }} Likes</p>
        <label for="like">Like:</label>
        <input
          type="checkbox"
          id="input-like"
          v-on:click="likePost(post._id, post.likes)"
        />
        <br />
        <button v-on:click="deletePost(post._id)">Delete</button>
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
      avgRating: 0,
      numPosts: 0,
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
      var isChecked = document.getElementById("input-like").checked;
      await PostService.likePost(id, likes, isChecked);
      this.posts = await PostService.getPosts();
    },
    async calcAvgRating() {
      this.avgRating = 0;
      this.numPosts = 0;
      this.posts.forEach((post) => {
        this.avgRating += parseInt(post.rating);
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
