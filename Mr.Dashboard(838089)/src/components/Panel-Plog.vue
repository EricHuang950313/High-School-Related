<template>
  <div class="panel-div">
    <div style="width: 100%">
      <div class="log">
        <textarea id="" cols="30" rows="10" v-model="data"></textarea>
      </div>
      <div class="save">
        <button @click="sendLog()">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  async mounted() {
    const afterRespond = await axios({
        method: 'post',
        url: '#API_URL#/getLog',
    });
    this.data = afterRespond.data.data;
  },
  data(){
    return{
      data: ''
    }
  },
  methods: {
    async sendLog(){
      await axios({
        method: 'post',
        url: '#API_URL#/sendLog',
        data: {
          data: this.data
        }
      });
    }
  }
}
</script>

<style scoped>
.log{
  width: 100%;
  height: 85vh;
  margin: 2.5vh 0 2.5vh 0;
  display: flex;
  justify-content: center;
}
.log textarea{
  flex: none;
  width: 95%;
}
.save{
  width: 100%;
  height: 10vh;
  margin: 0;
  display: flex;
  justify-content: center;
}
.save button{
  flex: none;
  width: 15vw;
  height: 8vh;
  cursor: pointer;
  border: #d5abff solid 1px;
  border-radius: 10px;
  background: transparent;
  color: white;
  text-align: center;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
}
.save button:hover{
  background: #ffd000;
  border: #ffd000 solid 1px;
  color: black;
}
</style>
