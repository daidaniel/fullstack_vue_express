<template>
  <div class="container">
    <h1>Reviews</h1>
    <form class="create-post" v-on:submit="createPost">
      <label for="user">User name: </label>
      <input type="text" id="input-user" v-model="user" placeholder="" required />
      <br>
      <label for="rating">Rating: </label>
      <input
        type="number"
        id="input-rating"
        v-model="rating"
        placeholder=""
        min="1"
        max="5"
        required
      />
      <label for="rating">/5</label>
      <br>
      <label for="create-post">Say Something: </label>
      <input type="text" id="input-text" v-model="text" placeholder="" required />
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
        <p class="text">{{ post.text }}</p>
        <p>{{ post.likes }} Likes</p>
        <label for="like">Like:</label>
        <input type="checkbox" id="input-like" v-on:click="likePost(post._id, post.likes)" />
        <br>
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
      text: "",
    };
  },
  async created() {
    try {
      this.posts = await PostService.getPosts();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async createPost() {
      await PostService.insertPost(this.user, this.rating, this.text);
      this.posts = await PostService.getPosts();
    },
    async deletePost(id) {
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
    },
    async likePost(id, likes) {
      var isChecked = document.getElementById("input-like").checked;
      await PostService.likePost(id, likes, isChecked);
      this.posts = await PostService.getPosts();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
}

p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.post {
  position: relative;
  border: 1px solid #5bd658;
  background-color: #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.created-at {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 15px 5px 15px;
  background-color: darkgreen;
  color: white;
  font-size: 13px;
}

p.text {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}
</style>
