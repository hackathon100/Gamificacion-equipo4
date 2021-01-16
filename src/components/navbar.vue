<template>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  props: {
  }
}
</script>


<style scoped>
#nav {
  /*background:rgb(235, 97, 72);  Aqui Background navbar */
  padding: 10px; 
  text-align: end;  
}

#nav a {  
  margin-right: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>