<template>
  <div class="home">

    <quiz/>

  </div>  
</template>

<script>
// @ is an alias to /src
import quiz from '@/components/quiz.vue'

export default {
  name: 'Home',
  components: {
    quiz
  }
}
</script>
