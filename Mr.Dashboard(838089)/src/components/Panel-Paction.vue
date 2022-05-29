<template>
  <div class="panel-div">
    <div v-if="whilePassing" style="width: 100vw; height: 100vh; position: fixed; top: 0; z-index: 999; background: rgba(0, 0, 0, 0.5);"></div>
    <div class="a">
      <div class="select">
        <select v-model="mesType" class="select_selecta">
          <option value="normal" style="background: white; color: black;">Normal Message</option>
          <option value="embed" style="background: white; color: black;">Embed Message</option>
          <option value="dm" style="background: white; color: black;">DM Message</option>
        </select>
      </div>
      <div v-show="mesType=='dm'">
        <div class="message_content">
          <p>User's Id:</p>
          <input type="text" v-model="userId" :placeholder="'A Valid User\'s id Here...'" :disabled="dm_stage==2">
        </div>
        <div class="message_content" v-show="dm_stage==2">
          <p>DM Contents:</p>
          <textarea rows="4" v-model="dmContents" :placeholder="'Contents Here...'"></textarea>
        </div>
        <div class="message_button">
          <button @click="sendDM"><span v-if="dm_stage==1">Find</span><span v-else>Send</span></button>
        </div>
      </div>
      <div v-show="mesType!='dm'">
        <div class="message_content">
          <div v-show="mesType=='embed'">
            <p>Color Picker: <a href="https://g.co/kgs/71RN1a" target="blank" style="color: DodgerBlue;">LINK</a></p>
            <input type="text" v-model="color" :placeholder="'Hex Code Here...'">
            <p>Title:</p>
            <input type="text" v-model="title" :placeholder="'Title Here...'">
          </div>
          <p>Contents:</p>
          <textarea rows="4" v-model="contents" :placeholder="'Contents Here...'"></textarea>
        </div>
        <div class="message_embedExtra" v-show="mesType=='embed'">
          <label>Sinature</label>
          <input type="checkbox" value="signature" v-model="s">
          <label>Date</label>
          <input type="checkbox" value="Date" v-model="d">
        </div>
        <div class="message_button">
          <button @click="send">Send</button>
        </div>
      </div>
    </div>
    <div class="b">
      <div class="select">
        <select v-model="modType" @change="clear" class="select_selectb">
          <option value="role" style="background: white; color: black;">Role</option>
          <option value="ban" style="background: white; color: black;">Ban</option>
        </select>
      </div>
      <div class="top" v-show="modType=='role'">
        <input type="text" v-model="searchName" :placeholder="'Search a user\'s name...'">
        <button @click="search">Search</button>
        <p v-for="content in this.searchResult" :key="content" @click="move(content)">{{content[1]}}&ensp;({{content[0]}})</p>
      </div>
      <div class="bottom" v-show="modType=='role'">
        <p v-for="(contentt, index) in this.selected" :key="contentt" @click="moveOut(index)">Target{{index+1}} - {{contentt[1]}}({{contentt[0]}})</p>
        <div class="bottom_bottom" v-show="!(this.selected.length==0)">
          <select v-model="role_a" class="bottom_select">
            <option v-for="roleName in this.role" :key="roleName" :value="roleName" style="background: white; color: black;">{{roleName[1]}}</option>
          </select>
          <select v-model="role_b" class="bottom_select">
            <option value="add" style="background: white; color: black;">Add</option>
            <option value="remove" style="background: white; color: black;">Remove</option>
          </select>
          <div>
            <button @click="modifyRole">Modify</button>
          </div>
        </div>
      </div>
      <div class="bans" v-show="modType=='ban'">
        <input type="text" v-model="banID" :placeholder="'User\'s ID that you wat to ban...'">
        <button @click="ban">Ban</button>
        <p v-for="(contenttt, indexx) in this.bans" :key="contenttt">{{contenttt[1]}}&ensp;({{contenttt[0]}})&ensp;&ensp;&ensp;<button @click="removeBan(indexx)">Remove</button></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  async mounted(){
    const role = await axios({
        method: 'post',
        url: '#API_URL#/getRole'
    });
    const bans = await axios({
        method: 'post',
        url: '#API_URL#/getBans'
    });
    this.roleHandling(role.data);
    this.bansHandling(bans.data);
  },
  data(){
    return{
      whilePassing: false,
      role: [],
      mesType: 'normal',
      contents: '',
      color: '',
      title: '',
      s: false,
      d: false,
      dm_stage: 1,
      userId: '',
      dmContents: '',
      modType: 'role',
      searchName: '',
      searchResult: '',
      selected: [],
      role: null,
      role_a: '',
      role_b: '',
      bans: null,
      banID: ''
    }
  },
  methods: {
    async roleHandling(role){
      this.role = role;
    },
    async bansHandling(bans){
      this.bans = bans;
    },
    async send(){
      this.whilePassing = true;
      await axios({
        method: 'post',
        url: '#API_URL#/sendMessage',
        data: {
          mesType: this.mesType,
          title: this.title,
          contents: this.contents,
          color: this.color.slice(1),
          s: this.s,
          d: this.d
        }
      });
      this.whilePassing = false;
      this.title = '';
      this.contents = '';
      this.color = '';
      this.s = false;
      this.d = false;
    },
    async sendDM(){
      this.whilePassing = true;
      const afterRespond = await axios({
        method: 'post',
        url: '#API_URL#/sendDM',
        data: {
          dm_stage: this.dm_stage,
          userId: this.userId,
          dmContents: this.dmContents,
        }
      });
      this.whilePassing = false;
      if (afterRespond.data=='noData'){
        alert('No result!');
        this.userId = '';
      } else{
        this.dm_stage += 1;
        console.log(this.dm_stage);
      }
      if (afterRespond.data=='success'){
        this.dm_stage = 1;
        this.userId = '';
        this.dmContents = '';
      }
    },
    async search(){
      this.whilePassing = true;
      const afterRespond = await axios({
        method: 'post',
        url: '#API_URL#/search',
        data: {
          searchName: encodeURIComponent(this.searchName)
        }
      });
      this.whilePassing = false;
      this.searchResult = afterRespond.data;
    },
    async move(content){
      let n_content = Object.values(JSON.parse(JSON.stringify(content)))[0];
      let o_selected = Object.values(JSON.parse(JSON.stringify(this.selected)));
      let n_selected = [];
      for(let i=0; i<o_selected.length; i++){
        n_selected.push(o_selected[i][0]);
      }
      if (!(n_selected.includes(String(n_content)))){
        this.selected.push([content[0], content[1]]);
      }
    },
    async moveOut(index){
      this.selected.splice(index, 1);
    },
    async modifyRole(){
      if (this.role_a == '' || this.role_b == ''){
        alert('Failed!');
      } else{
        this.whilePassing = true;
        const afterRespond = await axios({
          method: 'post',
          url: '#API_URL#/modifyRole',
          data: {
            users: this.selected,
            role: this.role_a,
            type: this.role_b,
          }
        });
        this.whilePassing = false;
        alert(afterRespond.data);
      }
      this.selected = [];
      this.role_a = '';
      this.role_b = '';
    },
    async ban(){
      let confirmBan = confirm('Are you sure to ban the user?');
      if (confirmBan){
        this.whilePassing = true;
        const afterRespond = await axios({
          method: 'post',
          url: '#API_URL#/ban',
          data: {
            list: this.bans,
            id: this.banID
          }
        });
        this.whilePassing = false;
        alert('Successfully banned the user!');
        this.bans = afterRespond.data;
        this.banID = '';
      }
    },
    async removeBan(indexxx){
      let confirmRBan = confirm('Are you sure to remove this banned user?');
      if (confirmRBan){
        this.whilePassing = true;
        const afterRespond = await axios({
          method: 'post',
          url: '#API_URL#/removeBan',
          data: {
            list: this.bans,
            id: indexxx
          }
        });
        this.whilePassing = false;
        alert('Successfully removed the banned user!');
        this.bans = afterRespond.data;
      }
    }
  }
}
</script>

<style scoped>
.a{
  margin: 5vh 2.5vw;
  border: 3px solid #a0dba7;
  box-sizing: border-box;
  width: 44.25vw;
  height: 85vh;
}
.b{
  margin: 5vh 2.5vw 5vh 0;
  border: 3px solid #ffb885;
  box-sizing: border-box;
  width: 44.25vw;
  height: 85vh;
}


/* CSS about class select */
/* select_selecta select_selectb */
.select{
  padding: 5vh 0;
  text-align: center;
}
/* CSS about all the p tag */
/* Any words except Sinature and Date*/
.a p{
  margin: 0 0 1vh 0;
  padding-left: 3.5vw;
  font-family: 'Comfortaa', cursive;
  font-size: 32px;
  color: white;
}


/* CSS about class a */
/* message_content message_embedExtra message_button dm*/
.select_selecta{
  border-radius: 8px;
  padding: 1vh 1vw;
  font-size: 24px;
  background: #a0dba7;
  color: white;
}
.message_content input{
  width: 34vw;
  margin: 0 0 2vh 3.5vw;
  padding: 1vh 1vw;
}
.message_content textarea{
  width: 34vw;
  margin: 0 0 1vh 3.5vw;
  padding: 1vh 1vw;
}
.message_embedExtra label{
  margin: 0 0 0 3.5vw;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
  color: white;
}
.message_button{
  margin: 3vh 0 0 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.message_button button{
  flex: none;
  padding: 1vh 1vw;
  border: #a0dba7 solid 1px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  background: transparent;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
}
.message_button button:hover{
  background: #ffd000;
  border: #ffd000 solid 1px;
  color: black;
}


/* CSS about class b */
.select_selectb{
  border-radius: 8px;
  padding: 1vh 1vw;
  font-size: 24px;
  background: #ffb885;
  color: white;
}

.b .top, .b .bottom{
  margin: 0 5% 3vh 5%;
  border: 3px solid #ffffff;
  box-sizing: border-box;
  width: 90%;
}
.top{
  height: 25vh;
}
.bottom{
  height: 35vh;
  padding: 2vh 1vw;
}
.top input{
  width: 75%;
  margin: 1vh 2% 3vh 2%;
  padding: 1vh 1vh;
}
.top button{
  padding: 1vh 1vw;
  border: #ffffff solid 1px;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  background: transparent;
  font-family: 'Comfortaa', cursive;
}
.top button:hover{
  background: #ffffff;
  color: black;
}
.top p{
  margin: 0;
  padding: 0.2vh 1vw;
  font-size: 20;
  box-sizing: border-box;
  border: 2px solid transparent;
  color: #ffffff;
  font-family: 'Comfortaa', cursive;
  cursor: pointer;
}
.top p:hover{
  box-sizing: border-box;
  border: 2px solid #ffb885;
  transition: 0.5s ease;
}
.bottom p{
  margin: 0 0 1vh 0;
  font-size: 20;
  box-sizing: border-box;
  border: 2px solid transparent;
  color:#ffd000;
  font-family: 'Comfortaa', cursive;
  cursor: pointer;
}
.bottom_select{
  padding: 0.5vh 0.5vw;
  font-size: 24px;
  background: transparent;
  color: white;
}
.bottom_bottom{
  margin: 4vh 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bottom_bottom select{
  margin-right: 1vw;
}
.bottom_bottom button{
  padding: 1vh 1vw;
  border: #ffffff solid 1px;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  background: transparent;
  font-family: 'Comfortaa', cursive;
}
.bottom_bottom button:hover{
  background: #ffffff;
  color: black;
}
.bans input{
  width: 75%;
  margin: 0 1vw 2vh 2vw;
  padding: 1vh 1vh;
  color: crimson;
}
.bans button{
  padding: 1vh 1vw;
  border: crimson solid 1px;
  border-radius: 10px;
  color: crimson;
  cursor: pointer;
  background: transparent;
  font-family: 'Comfortaa', cursive;
}
.bans button:hover{
  background: crimson;
  color: white;
}
.bans p{
  margin: 0;
  padding: 1vh 2vw;
  font-size: 20px;
  color: crimson;
  font-family: 'Comfortaa', cursive;
}
.bans p button{
  padding: 0.5vh 0.5vw;
  border: chartreuse solid 1px;
  border-radius: 10px;
  color: chartreuse;
  cursor: pointer;
  background: transparent;
  font-family: 'Comfortaa', cursive;
}
.bans p button:hover{
  background: chartreuse;
  color: black;
}
</style>
