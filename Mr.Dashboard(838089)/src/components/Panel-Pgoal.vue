<template>
  <div class="panel-div">
    <transition name="toast">
      <div class="toastt-wrapper" v-if="bad">
        <div class="toastt">
          You must enter a value for the todo
        </div>
      </div>
    </transition>
    <div class="todos-left">
      <input type="text" v-model="newTodo[0]" @keypress.enter="addTodo(0)" placeholder="[General] Enter to add a new Todo...">
      <transition name="switch" mode="out-in">
        <div v-if="todos[0].length">
          <transition-group tag="ul" name="list" appear>
            <li v-for="todo in todos[0]" :key="todo.id" @click="deleteTodo(0, todo.id)">
              {{ todo.text }}
            </li>
          </transition-group>
        </div>
        <p v-else>Nothing left todo!</p>
      </transition>
    </div>
    <div class="todos-right">
      <input type="text" v-model="newTodo[1]" @keypress.enter="addTodo(1)" placeholder="[Dev] Enter to add a new Todo...">
      <transition name="switch" mode="out-in">
        <div v-if="todos[1].length">
          <transition-group tag="ul" name="list" appear>
            <li v-for="todo in todos[1]" :key="todo.id" @click="deleteTodo(1, todo.id)">
              {{ todo.text }}
            </li>
          </transition-group>
        </div>
        <p v-else>Nothing left todo!</p>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  async mounted() {
    const data = await axios({
        method: 'post',
        url: '#API_URL#/getGoal'
    });
    this.goalHandling(data);
    window.addEventListener("keypress", function(w) {
      if(String.fromCharCode(w.keyCode) == '+'){
        this.save();
      }
    }.bind(this));
  },
  setup() {
    const todos = ref([[], []]);
    const newTodo = ref(['', '']);
    const bad = ref(false);

    const goalHandling = (data) =>{
      todos.value = data.data;
    }

    const addTodo = (index) => {
      if (newTodo.value[index]) {
        const id = Math.random();
        todos.value[index] = [{ text: newTodo.value[index], id }, ...todos.value[index]];
        newTodo.value[index] = '';
      } else {
        bad.value = true;
        setTimeout(() => bad.value = false, 3000);
      }
    }

    const deleteTodo = (index, id) => {
      todos.value[index] = todos.value[index].filter(todo => todo.id != id);
    }

    const save = async() => {
      let confirmm = confirm('Are you sure to save the data?');
        if(confirmm){
          await axios({
            method: 'post',
            url: '#API_URL#/updateGoal',
            data: {
              data: todos.value
            }
          });
        }
    }

    return { todos, addTodo, deleteTodo, newTodo, bad, save, goalHandling }
  }
}
</script>

<style scoped>
.todos-left, .todos-right{
  margin: 5vh 0 0 2.5vw;
  border: 3px solid #ffffff;
  box-sizing: border-box;
  width: 44.25vw;
  height: 85vh;
}
input {
  width: 70%;
  padding: 12px;
  border: 3px solid #ffd000;
  border-radius: 15px;
  box-sizing: border-box;
  margin: 4vh 6vw;
}
p{
  margin: 0;
  color: #ffffff;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
  width: 100%;
  text-align: center;
}
.todos-left ul, .todos-right ul{
  position: relative;
  padding: 0;
  margin: 0;
}
.todos-left li, .todos-right li{
  list-style-type: none;
  display: block;
  padding: 1vh 2vw;
  background: white;
  border-radius: 10px;
  box-sizing: border-box;
  font-family: 'Comfortaa', cursive;
  font-size: 24px;
  width: fit-content;
  margin: 0 auto 1vh;
}
.todos-left li:hover, .todos-right li:hover{
  cursor: pointer;
}

.toastt-wrapper {
  position: fixed;
  width: 100%;
  top: 20px;
  z-index: 999;
}
.toastt {
  width: 25%;
  padding: 2vh 1vw;
  color: white;
  background: #ff0062;
  border-radius: 10px;
  margin: 0 auto;
  font-family: 'Comfortaa', cursive;
  font-size: 16px;
  text-align: center;
}

.switch-enter-from, .switch-leave-to{
  opacity: 0;
  transform: translateY(20px);
}
.switch-enter-active, .switch-leave-active{
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-active {
  transition: all 0.4s ease;
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-leave-active {
  transition: all 0.4s ease;
  position: absolute; /* for move transition after item leaves */
}
.list-move {
  transition: all 0.3s ease;
}
/* Set in @keyframes
.toast-enter-from{
  opacity: 0;
  transform: translateY(-60px);
}
*/
/* Set in @keyframes
.toast-enter-to{
  opacity: 1;
  transform: translateY(0);
}
*/
.toast-enter-active {
  animation: wobble 0.5s ease;
}
/* Default opacity, translateY, so this can be omited.
.toast-leave-form{
  opacity: 1;
  transform: translateY(0);
}
*/
.toast-leave-to{
  opacity: 0;
  transform: translateY(-60px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
@keyframes wobble {
  0% { transform: translateY(-100px); opacity: 0 }
  50% { transform: translateY(0px); opacity: 1 }
  60% { transform: translateX(8px); opacity: 1 }
  70% { transform: translateX(-8px); opacity: 1 }
  80% { transform: translateX(4px); opacity: 1 }
  90% { transform: translateX(-4px); opacity: 1 }
  100% { transform: translateX(0px); opacity: 1 }
}
</style>
