<template>
  <div v-if="whilePassing" style="width: 100vw; height: 100vh; position: fixed; top: 0; z-index: 999; background: rgba(0, 0, 0, 0.5);"></div>
  <div :style="bgc">
    <form @submit.prevent="handleSubmit">
      <h1>83 80 89 - Login</h1>
      <label>Administrator ID:</label>
      <input required v-model="id">
      <div v-if="idError" class="error">{{ idError }}</div>
      <label>Password:</label>
      <input type="password" required v-model="password">
      <div v-if="passwordError" class="error">{{ passwordError }}</div>
      <div class="submit">
        <button>Log In</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import NodeRSA from 'node-rsa';

export default {
  data () {
    return {
      whilePassing: false,
      id: '',
      password: '',
      idError: '',
      passwordError: '',
      bgc:{
            backgroundColor: '#000e30',
            overflow: 'auto',
            height: '100vh'
          }
    }
  },
  methods: {
    async handleSubmit(){
      this.whilePassing = true;
      this.idError = '';
      this.passwordError = '';
      const getPublicKeyRespond = await axios({
        method: 'post',
        url: '#API_URL#/getKey'
      });
      const publicKey = getPublicKeyRespond.data;
      const encrypted = this.encrypt(this.id+','+this.password, publicKey);
      const afterRespond = await axios({
        method: 'post',
        url: '#API_URL#/passSecret',
        data: {
          data: encrypted
        }
      });
      if (afterRespond.data === 'failed-a'){
        this.whilePassing = false;
        this.idError = 'AdministratorID Error';
      } else if (afterRespond.data === 'failed-p'){
        this.whilePassing = false;
        this.passwordError = 'password Error';
      } else{
        this.id = '';
        this.password = '';
        this.whilePassing = false;
        this.$router.push(`/${afterRespond.data}`);
      }
    },
    encrypt(content, publicKey){
      let clientKey = new NodeRSA({b: 512});
      var publicKey = publicKey;
      clientKey.importKey(publicKey);
      let encrypted = clientKey.encrypt(content, 'base64');
      return encrypted;
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: 'Comfortaa', cursive;
  text-align: center;
  color: #fcc203;
}
form {
  max-width: 420px;
  margin: 10vh auto;
  padding: 40px;
  border: solid 2px #00ebe7;
  border-radius: 10px;
  background: #000e30;
  text-align: left;
}
label {
  font-family: 'Comfortaa', cursive;
  display: inline-block;
  margin: 25px 0 15px;
  color: #ffffff;
  text-transform: uppercase;
  font-size: 12.8px;
  letter-spacing: 1px;
  font-weight: bold;
}
input {
  width: 100%;
  display: block;
  box-sizing: border-box;
  padding: 10px 6px;
  border: none;
  border-bottom: 1px solid #ffffff;
  background-color: #000e30;
  color: #ffffff;
}
button {
  margin-top: 40px;
  padding: 10px 20px;
  border: solid 2px #00ebe7;
  border-radius: 20px;
  background: transparent;
  color: white;
}
button:hover{
  color: black;
  background: #00ebe7;
  cursor: pointer;
}
.submit {
  text-align: center;
  }
.error {
  margin-top: 10px;
  color: #ff0062;
  font-size: 12.8px;
  font-weight: bold;
}
</style>
