<template>
  <div>
    <div class="gameOver" v-if="!gameStarted">
      <h1>Welcome to Trivia!</h1>
      <h4 v-if="numQuestions">Previous Score: {{ getScore() }}%</h4>
      <h3>Pick a Category</h3>
      <label>
        Comics
        <input type="radio" v-model="category" name="category" value="29" />
      </label>
      <label>
        Video Games
        <input type="radio" v-model="category" name="category" value="15" />
      </label>
      <label>
        Computers
        <input type="radio" v-model="category" name="category" value="18" />
      </label>
      <br />
      <br />
      <button @click="getQuestions">Click to Begin!</button>
    </div>
    <div class="questionAndAnswers" v-if="gameStarted">
      <h6 class="question text-center px-5" v-html="question"></h6>
      <ul
        class="answers mt-5 row justify-content-center"
        v-if="asking && gameStarted"
      >
        <li
          class="text-center justify-content-center mx-1 my-1 px-1"
          v-for="answer of choices"
          :key="answer.id"
          @click="checkAnswer"
        >
          <button class="button-answer" v-html="answer"></button>
        </li>
      </ul>
      <div class="result" v-if="!asking && gameStarted">
        <div class="row text-center justify-content-center">
          <h3>Your Choice:</h3>
          <p v-html="chosen"></p>
        </div>
        <div class="row text-center justify-content-center">
          <h5>Correct Answer:</h5>
          <p v-html="answer"></p>
        </div>
        <h5>{{ numCorrect }} / {{ numQuestions }}</h5>
        <h5>{{ chosen == answer ? "Well Done!" : "Incorrect!" }}</h5>
        <button @click="nextQuestion">Next Question</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      category: 29,
      asking: false,
      gameStarted: false,
      questions: [],
      currentQuestionNum: 0,
      question: "",
      answer: "",
      choices: [],
      chosen: "",
      numCorrect: 0,
      numQuestions: null
    };
  },

  methods: {
    getQuestions() {
      fetch(`https://opentdb.com/api.php?amount=10&category=${this.category}`)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          this.gameStarted = true;
          this.currentQuestionNum = 0;
          this.questions = res.results;
          this.numCorrect = 0;
          this.numQuestions = res.results.length;
          this.nextQuestion();
        })
        .catch(err => console.log(err));
    },
    nextQuestion() {
      this.asking = true;
      if (this.currentQuestionNum === this.questions.length) {
        this.gameStarted = false;
        this.asking = false;
        return;
      }
      const qNum = this.currentQuestionNum;
      //let question = this.questions[qNum]
      this.question = this.questions[qNum].question;
      this.answer = this.questions[qNum].correct_answer.trim();
      const choices = this.questions[qNum].incorrect_answers;
      choices.push(this.answer);
      this.choices = choices.sort(() => Math.random() - 0.5);
      this.currentQuestionNum = this.currentQuestionNum + 1;
    },
    checkAnswer(e) {
      this.asking = false;
      this.chosen = e.target.textContent.trim();
      // console.log(this.chosen, this.answer)
      if (this.chosen === this.answer) {
        this.numCorrect++;
        // console.log(this.numCorrect)
      }
    },
    getScore() {
      return Math.trunc((this.numCorrect / this.numQuestions) * 100, 2);
    }
  }
};
</script>

<style scope>
.button-answer {
  height: 50px;
  list-style: none;
  border: 1px darkblue solid;
  background-color: rgb(152, 177, 223);
  padding: 15px;
  font-size: 14px;
  transition: background-color 0.2s;
}
.answers {
  list-style: none;
}

.button-answer:hover {
  background-color: rgb(176, 146, 206);
  color: white;
}
</style>