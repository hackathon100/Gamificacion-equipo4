<template>
  <div>
 <div class="gameOver" v-if="!gameStarted">
      <h1>Welcome to Trivia!</h1>
      <h4 v-if="numQuestions">Previous Score: {{ getScore() }}%</h4>
      <h3>Pick a Category</h3>
      <label>
        Comics
        <input type="radio" v-model="category" name="category" value="29">
      </label>
      <label>
        Video Games
        <input type="radio" v-model="category" name="category" value="15">
      </label>
      <label>
        Computers
        <input type="radio" v-model="category" name="category" value="18">
      </label>
      <br>
      <br>
      <button @click="getQuestions">Click to Begin!</button>
    </div>
    <div class="questionAndAnswers" v-if="gameStarted">
      <h2 class="question" v-html="question">
        
      </h2>
      <ul class="answers mt-5" v-if="asking && gameStarted">
        <li v-for="answer of choices" :key="answer.id" class="answer"
            @click="checkAnswer" v-html="answer">          
        </li>
      </ul>
      <div class="result" v-if="!asking && gameStarted">
        <div class="row center-y center-x">
          <h3>Your Choice: </h3>
          <p v-html="chosen"></p>
        </div>
        <div class="row center-y center-x">
          <h3>Correct Answer: </h3>
          <p v-html="answer"></p>
        </div>
        <h3>{{ numCorrect }} / {{ numQuestions }}</h3>
        <h2>{{ chosen == answer ? "Well Done!" : "Incorrect!"}}</h2>
        <button @click="nextQuestion">Next Question</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
    category: 29,
    asking: false,
    gameStarted: false,
    questions: [],
    currentQuestionNum: 0,
    question: '',
    answer: '',
    choices: [],
    chosen: '',
    numCorrect: 0,
    numQuestions: null
    }
  },

  methods: {
    getQuestions() {
      fetch(`https://opentdb.com/api.php?amount=10&category=${this.category}`)
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        this.gameStarted = true;
        this.currentQuestionNum = 0;
        this.questions = res.results;
        this.numCorrect = 0;
        this.numQuestions = res.results.length;
        this.nextQuestion();
      })
      .catch(err => console.log(err))
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
      this.choices = choices.sort(() => Math.random() - 0.5)
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
      return Math.trunc(this.numCorrect / this.numQuestions * 100, 2);
    }
  }
}
</script>

<style scope>
* {
  text-align: center;
}

.row, .column {
  display: flex;
}

.center-x {
  justify-content: center;
}

.center-y {
  align-items: center;
}

.row>p {
  margin: 10px;
}

.answers {
  display: grid;
  width: 560px;
  height: 300px;
  margin: auto;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
}

.answer {
  list-style: none;
  border: 3px darkblue solid;
  text-align: center;
  padding: 50px 10px;
  cursor: pointer;
  background-color: cornflowerblue;
  transition: background-color 0.2s
}

.answer:hover {
  background-color: rebeccapurple;
  color: white;
}
</style>