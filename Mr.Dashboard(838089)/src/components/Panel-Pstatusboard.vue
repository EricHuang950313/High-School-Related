<template>
  <div class="panel-div">
    <div class="a">
      <div id="chart">
        <table class="charts-css area">
          <tbody>
            <tr><td style="--start: 0.8; --size: 0.8"></td></tr>
            <tr><td style="--start: 0.8; --size: 0.8"></td></tr>
            <tr><td style="--start: 0.8; --size: 0.8"></td></tr>
            <tr><td style="--start: 0.8; --size: 0.8"></td></tr>
            <tr><td style="--start: 0.8; --size: 0.8"></td></tr>
            <tr><td style="--start: 0.8; --size: 0.8"></td></tr>
          </tbody>
        </table>
        <table class="charts-css column data-spacing-2">
          <tbody>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
            <tr><td style="--size: 0.8;"></td></tr>
          </tbody>
        </table>
        <div class="primary-axis" style="margin-top: 2vh">Messages · Total Members</div>
      </div>
    </div>
    <div class="b">
      <form class="b-form" @submit.prevent="handleBotStatus">
        <div class="b-wrap-a">
          <button class="b-btn" @click="status = 'online' ">Online</button>
        </div>
        <div class="b-wrap-a">
          <button class="b-btn" @click="status = 'idle' ">Idle</button>
        </div>
        <div class="b-wrap-a">
          <button class="b-btn" @click="status = 'dnd' ">Do Not Disturb</button>
        </div>
      </form>
      <form class="b-form" @submit.prevent="handleBotActivity">
        <div class="b-wrap-b">
          <label><b>Activity</b></label>
        </div>
        <div class="b-wrap-b">
          <textarea style="width: 80%" rows="3" v-model="activity"></textarea>
        </div>
        <div class="b-wrap-b">
          <button>Confirm</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'charts.css/dist/charts.min.css'
import 'charts.css/dist/charts.css'

export default {
  data(){
    return{
      status: null,
      activity: null,
    }
  },
  methods: {
    async handleBotStatus(){
      await axios({
        method: 'post',
        url: '#API_URL#/handler',
        data: {
          data: this.status
        }
      });
      this.status =  null;
    },
    async handleBotActivity(){
      await axios({
        method: 'post',
        url: '#API_URL#/handler',
        data: {
          data: this.activity
        }
      });
      this.activity = null;
    }
  }
}
</script>

<style scoped>
.a{
  flex: none;
  width: 70%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#chart {
  flex: none;
  margin: 0;
  display: grid;
  justify-items: center;
  grid-template-columns: 50px 1fr 50px;
  grid-template-rows: 45vh 15vh 10vh;
  grid-template-areas: 
    "data-1-axis  stocks       data-2-axis"
    "data-1-axis  volume       data-2-axis"
    "primary-axis primary-axis primary-axis";
  background-color: #323639;
  width: 65vw;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
  color: white;
}
#chart > table.area {
  grid-area: stocks;
}
#chart > table.column {
  grid-area: volume;
}
#chart > .primary-axis {
  grid-area: primary-axis;
}
#chart > table.area {
  --color: linear-gradient(#ffffff, rgba(255, 255, 255, 0));
}
#chart > table.column tr:nth-child(3n+1) {
  --color: #c996ff;
}
#chart > table.column tr:nth-child(3n+2) {
  --color: #8b1fff;
}
#chart > table.column tr:nth-child(3n+0) {
  --color: #5f14ff;
}
.b{
  flex: none;
  width: 30%;
}
.b-form{
  margin-top: 8vh;
  margin-right: 5vw;
  padding-bottom: 4vh;
}
.b-form:nth-child(2n+1){
  border: solid #ff6054 3px;
}
.b-form:nth-child(2n+0){
  border: solid #54acff 3px;
}
.b-wrap-a{
  flex: none;
  display: flex;
  justify-content: center;
}
.b-btn{
  flex: none;
  width: 40%;
  margin-top: 4vh;
  padding: 1vh 1vw;
  cursor: pointer;
  border: #ff6054 solid 1px;
  border-radius: 10px;
  background: transparent;
  color: white;
  text-align: center;
  font-family: 'Comfortaa', cursive;
}
.b-btn:hover{
  background: #ffd000;
  border: #ffd000 solid 1px;
  color: black;
}
.b-wrap-b{
  flex: none;
  display: flex;
  justify-content: center;
}
.b-wrap-b label{
  margin: 2vh 0;
  font-family: 'Comfortaa', cursive;
  color: #54acff;
  font-size: 36px;
}
.b-wrap-b button{
  margin-top: 3vh;
  padding: 1vh 1vw;
  border: #54acff solid 1px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  background: transparent;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
}
.b-wrap-b button:hover{
  background: #ffd000;
  border: #ffd000 solid 1px;
  color: black;
}
</style>