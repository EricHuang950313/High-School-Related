<template>
  <div class="blackk"></div>
  <div v-if="show">
    <SideBar @render="render" class="n" />
    <Pstatusboard v-show="statusboard" class="n" />
    <Paction v-show="action" class="n" />
    <Plog v-show="log" class="n" />
    <Pgoal v-show="goal" class="n" />
  </div>
  <p v-else-if="show===null" style="width:100%; text-align: center;">Loading...</p>
  <p v-else style="width:100%; text-align: center;">404 / Visit without authority</p>
</template>

<script>
import axios from 'axios'
import SideBar from '@/components/Panel-sidebar.vue'
import Pstatusboard from '@/components/Panel-Pstatusboard.vue'
import Paction from '@/components/Panel-Paction.vue'
import Plog from '@/components/Panel-Plog.vue'
import Pgoal from '@/components/Panel-Pgoal.vue'

export default {
  name: 'Panel',
  components: { SideBar, Pstatusboard, Paction, Plog, Pgoal },
  async mounted() {
    const afterRespond = await axios({
        method: 'post',
        url: '#API_URL#/panelauth',
        data: {
          data: this.$route.query.authentication
        }
    });
    if (afterRespond.data == 'success'){
      this.show = true;
    } else {
      this.show = false;
    }
    this.timeOut = setTimeout(async() => {
      alert('Login timeout expired (Auto Logout)');
      await axios({
        method: 'post',
        url: '#API_URL#/authDelete',
        data: {
          data: this.$route.query.authentication
        }
      }).then(
        this.$router.push('/login')
      );  
    }, 600000);
  },
  data() {
    return {
      show: null,
      statusboard: true,
      action: false,
      log: false,
      goal: false,
      timeOut: null
    }
  },
  methods: {
    async render(a){
      switch (a.innerHTML) {
        case 'Status':
          this.clear();
          this.statusboard = true;
          break;
        case 'Action':
          this.clear();
          this.action = true;
          break;
        case 'Log':
          this.clear();
          this.log = true;
          break;
        case 'Goal':
          this.clear();
          this.goal = true;
          break;
        case 'Leave':
          let confirmOut = confirm('Are you sure to sign out?');
          if (confirmOut){
            await axios({
              method: 'post',
              url: '#API_URL#/authDelete',
              data: {
                data: this.$route.query.authentication
              }
            }).then(
              this.$router.push('/login')
            );        
          }
          break;
        default:
          break;
      }
    },
    clear(){
      this.statusboard = false;
      this.action = false;
      this.log = false;
      this.goal = false;
    }
  }
}
</script>

<style>
</style>