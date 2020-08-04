<template lang="pug">
    .content
        .p-2(v-if="! matery.quiz_started")
            .text-center
              img(src="/no-quiz.svg" width="150px")
            h3.text-center Ujian Harian {{ titleCase(matery.course.title + " - " + matery.title) }}
            h3.text-center.text-warning(v-if="$moment().format('YYYY-MM-DD') < $moment(matery.quiz_enabled).format('YYYY-MM-DD')") Ujian Ini Aktif Besok
            .pv1
                strong.text-muted Catatan :
                ol
                    li Jumlah {{ matery.quizzes_count }} soal dan waktu pengerjaan 
                      strong {{ getMinute() }}.
                    li Pastikan handphone / komputer memiliki koneksi yang bagus dan baterai yang cukup.
                    li
                        strong Dilarang mencontek atau melihat jawaban dari buku, internet, dll. &nbsp;
                        | Allah maha melihat.
                    li Jika yakin dengan semua jawaban
                      strong &nbsp; silakan tekan selesai
                      | &nbsp; karena waktu termasuk penilaian.
            .text-center
              button.btn.btn-primary(@click="startQuiz()") {{ $moment().format('YYYY-MM-DD') < $moment(matery.quiz_enabled).format('YYYY-MM-DD') ? "Kembali" : "Bismillah, Mulai" }}
        .quiz(v-else-if="quizzes")
            .progress-quiz
                    .progress-value(:style="{width: (progress/duration)*100 + '%' }")
            .quiz-header
                //- .back
                .time
                    span {{ matery.quiz_ended !== null ? (duration - matery.quiz_ended) + 's' : time }}
                .menu
                    span {{ matery.quiz_ended !== null ? matery.quiz_score : Object.keys(answers).length +"/"+ quizzes.length }}
            .quiz-content.p-2
                .question(v-for="(quiz, $index) in quizzes")
                    .question-content(v-html="quiz.question")
                    label.choice(v-for="(answer, $choiceIndex) in quiz.answer" :class="{selected: answers && answers[quiz.id] === $choiceIndex}")
                        .answer-button
                            input(:disabled="matery.quiz_ended !== null" :name="'choice'+quiz.id" type="radio" @click="selectChoice($index, $choiceIndex, $event)" :checked="answers && answers[quiz.id] === $choiceIndex")
                        .answer-item
                            span {{ answer }}
                p.text-muted.text-center.mb1(v-if="matery.quiz_ended === null") Jika sudah yakin dengan jawaban, silakan tekan selesaikan.
                button.btn.btn-success.btn-block(v-if="matery.quiz_ended === null" @click="endQuiz()") Bismillah, Selesaikan
                nuxt-link.btn.btn-primary.btn-block(to="/ujian" v-if="matery.quiz_ended !== null" @click="endQuiz()") Kembali

        a.back-button(@click="$router.go(-1)" v-if="! quizzes")
            span.ti-arrow-left
</template>

<script>
export default {
  middleware: 'auth',
  async asyncData({ $axios, route }) {
    const matery = await $axios.$get("quiz/" + route.params.id);
    let duration = matery.quiz_duration;
    let paused = matery.quiz_paused;
    let reducedDuration = paused;
    let answers = {};
    let progress = matery.quiz_duration - matery.quiz_paused;

    if (matery.quiz_answers)
      answers = JSON.parse(matery.quiz_answers);

    return { matery, duration, reducedDuration, answers, progress, paused };
  },
  data() {
    return {
      time: "Memuat..",
      start: false,
      finish: false,
      quizzes: [],
      question: {},
      questionIndex: 0,
      interval: null
    };
  },
  mounted() {
    if (this.matery.quiz_started && this.matery.quiz_ended === null) this.renderTime();

    if (this.matery.quiz_started)
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
      if (this.$moment().format('YYYY-MM-DD') < this.$moment(this.matery.quiz_enabled).format('YYYY-MM-DD'))
        this.$router.go(-1);

      else if (! this.matery.quiz_started) {
          this.renderTime();
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
      this.saveDuration();
    },

    async saveDuration(end = false) {
      await this.$axios.$post("answer/"+this.matery.secret, {
        answers: this.answers,
        duration: this.reducedDuration,
        end: end
      }).then(response => {
        this.matery.quiz_ended = response.quiz_ended;
        this.matery.quiz_score = response.quiz_score;
      });
    },  

    renderTime() {
      let minute = this.paused <= 60 ? 0 : Math.ceil(this.paused / 60) - 1;
      let second = this.paused <= 60 ? this.paused : this.paused - Math.ceil(minute * 60);
      
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
      let minute = this.paused <= 60 ? 0 : Math.round(this.paused / 60) - 1;
      let second = this.paused <= 60 ? this.paused : this.paused - Math.round(minute * 60);

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
    font-weight: 400;
.quiz-header
    height: 40px
    background-color: #333
    display: grid
    grid-template-columns: 1fr 1fr
    position: fixed
    width: 100%
    top: 0
    left: 0

    .time
      border-right: 1px solid #ddd
    .time, .menu
        display: flex
        justify-content: center
        align-items: center
        span
            font-weight: bold
            font-size: 20px
            color: white
.quiz
.question
    font-size: 16px
    margin-bottom: 20px
    padding-bottom: 20px
    border-bottom: 1px solid #ddd
    overflow-x: hidden
  
.quiz-button
    display: flex
    justify-content: space-between

.mb1
  margin-bottom: 10px

.progress-quiz
    height: $progressHeight
    background-color: #ddd
    width: 100%
    position: fixed
    top: 40px
    .progress-value
        position: absolute
        top: 0
        height: $progressHeight
        background-color: #1976d2
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
      border-radius: 5px
      transition: background 300ms
</style>
