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
        <div class="title">
          <h3>{{ post.rating }} / 5 {{ post.title }}</h3>
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
          <input
            type="checkbox"
            id="input-like"
            v-on:click="likePost(post._id, post.likes)"
          />
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
      var isChecked = document.getElementById("input-like").checked;
      await PostService.likePost(id, likes, isChecked);
      this.posts = await PostService.getPosts();
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
