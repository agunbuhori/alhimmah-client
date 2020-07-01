<template lang="pug">
    .content
        .p2(v-if="! matery.quiz_started")
            h2 Ujian Harian {{ titleCase(matery.course.title + " : " + matery.title) }}
            .pv1
                h3.text-muted Catatan :
                ol
                    li Jumlah {{ matery.quizzes_count }} soal dan waktu pengerjaan {{ getMinute() }}.
                    li Pastikan handphone / komputer memiliki koneksi yang bagus dan baterai yang cukup.
                    li
                        strong Dilarang mencontek atau melihat jawaban dari buku, internet, dll. &nbsp;
                        | Allah maha melihat.
            button.blue(@click="startQuiz()") Bismillah, Mulai
        .quiz(v-else-if="quizzes")
            .quiz-header
                .back
                .time
                    span {{ matery.quiz_ended !== null ? "Selesai" : time }}
                .menu
            .progress-quiz
                    .progress-value(:style="{width: (progress/duration)*100 + '%' }")
            .quiz-content.p2
                .question(v-for="(quiz, $index) in quizzes")
                    .question-content(v-html="($index+1)+'. '+quiz.question")
                    label.choice(v-for="(answer, $choiceIndex) in quiz.answer" :class="{selected: answers && answers[quiz.id] === $choiceIndex}")
                        .answer-button
                            input(:disabled="matery.quiz_ended !== null" :name="'choice'+quiz.id" type="radio" @click="selectChoice($index, $choiceIndex, $event)" :checked="answers && answers[quiz.id] === $choiceIndex")
                        .answer-item
                            span {{ answer }}
                button.green(@click="endQuiz()") Selesai

        a.back-button(@click="$router.go(-1)" v-if="! quizzes")
            span.ti-arrow-left
</template>

<script>
export default {
  async asyncData({ $axios, route }) {
    const matery = await $axios.$get("quiz/" + route.params.id);
    let duration = matery.quiz_paused;
    let reducedDuration = duration;
    let answers = {};

    if (matery.quiz_answers)
      answers = JSON.parse(matery.quiz_answers);

    return { matery, duration, reducedDuration, answers };
  },
  data() {
    return {
      time: "Memuat..",
      start: false,
      finish: false,
      quizzes: [],
      question: {},
      progress: 0,
      questionIndex: 0,
      interval: null
    };
  },
  mounted() {
    if (this.matery.quiz_started && this.matery.quiz_ended === null) this.renderTime();

    this.getQuizzes();

  },
  methods: {
    titleCase(str) {
      let result = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      });

      return result;
    },
    paddy(num, padlen, padchar) {
      var pad_char = typeof padchar !== "undefined" ? padchar : "0";
      var pad = new Array(1 + padlen).join(pad_char);
      return (pad + num).slice(-pad.length);
    },

    startQuiz() {
      this.renderTime();
       
       if (! this.matery.quiz_started) {
          this.$axios.$put("start_quiz/" + this.matery.secret).then(response => {
            if (response.quiz_started) {
              this.matery.quiz_started = response.quiz_started;
              this.getQuizzes();
            }
          });
        }
    },

    getQuizzes() {
      if (this.matery.quiz_started)
        this.$axios.$post("quizzes/"+this.matery.secret, {
          quizzes: this.matery.quiz_questions
        }).then(response => {
          
          this.quizzes = response.map(item => {
            return {
                ...item, 
                answer: JSON.parse(item.answer), 
                selected: null
              };
          });
        })
    },

    selectChoice(questionIndex, choiceIndex, event) {
      let questionNode = event.target.parentNode.parentNode.parentNode;
      let choices = questionNode.querySelectorAll('.choice');

      choices.forEach(choice => {
        if (choice.classList.contains('selected'))
          choice.classList.remove('selected');
      });

      event.target.parentNode.parentNode.classList.add('selected');

      this.answers[this.quizzes[questionIndex].id] = choiceIndex;
    },

    async saveDuration(end = false) {
      await this.$axios.$post("answer/"+this.matery.secret, {
        answers: this.answers,
        duration: this.reducedDuration,
        end: end
      }).then(response => {
        this.matery.quiz_ended = response.quiz_ended;
      });
    },  

    renderTime() {
      this.duration++;

      let minute = this.duration <= 60 ? 0 : Math.ceil(this.duration / 60) - 1;
      let second = this.duration <= 60 ? this.duration : this.duration - Math.ceil(minute * 60);
      
      this.interval = setInterval(() => {
        second--;
        this.reducedDuration--;
        this.progress++;

        if (this.reducedDuration%5 === 0) {
          this.saveDuration();
        }

        if (second === -1 && minute > 0) {
          minute--;
          second = 59;
        } else if (second === 0 && minute === 0) {
          this.reducedDuration = 0;
          this.saveDuration(true);
          clearInterval(this.interval);
        }

        this.time = this.paddy(minute, 2, 0) + ":" + this.paddy(second, 2, 0);
      }, 1000);

      
    },

    endQuiz() {
      clearInterval(this.interval);

      if (this.matery.quiz_ended === null)
        this.saveDuration(true);
    },

    getMinute() {
      let minute = this.duration <= 60 ? 0 : Math.round(this.duration / 60) - 1;
      let second = this.duration <= 60 ? this.duration : this.duration - Math.round(minute * 60);

      if (minute === 0) return second + " detik";
      else if (minute > 0 && second == 0) return minute + " menit";

      return `${minute} menit ${second} detik`;
    }
  }
};
</script>

<style lang="sass" scoped>
$progressHeight: 5px
.content
    background-color: white
ol
    padding: 15px
    font-weight: 500;
.quiz-header
    height: 60px
    background-color: #333
    display: grid
    grid-template-columns: 60px 1fr 60px
    position: fixed
    width: 100%
    top: $progressHeight
    left: 0

    .time
        display: flex
        justify-content: center
        align-items: center
        span
            font-weight: bold
            font-size: 25px
            color: white
.quiz
    margin-top: 68px
.question
    font-size: 18px
    margin-bottom: 20px
    padding-bottom: 20px
    border-bottom: 1px solid #ddd
.green
    width: 100%
    padding: 10px 15px
    border-radius: 20px
    border: none
    color: white
    background-color: #3ca59d
.blue
  width: 100%
  padding: 10px 15px
  border-radius: 20px
  border: none
  color: white
  background-color: #2980b9

  &:disabled
    opacity: 0.3

  &:active
    background-color: #1980a9
.quiz-button
    display: flex
    justify-content: space-between

.progress-quiz
    height: $progressHeight
    background-color: #ddd
    width: 100%
    position: fixed
    top: 0
    .progress-value
        position: absolute
        top: 0
        height: $progressHeight
        background-color: #2980b9
        transition: width 300ms
.question-content
    margin-bottom: 15px
.choice
    font-weight: normal
    display: grid
    grid-template-columns: 30px 1fr
    .answer-item
        display: flex
        align-items: flex-start
    &.selected
      background-color: #d1ecf1
      margin-left: -5px
      margin-right: -5px
      padding-left: 5px
      border-radius: 5px
      transition: background 300ms
</style>
