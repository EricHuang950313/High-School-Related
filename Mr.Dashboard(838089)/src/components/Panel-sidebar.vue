<template>
  <div class="black" v-show="!collapsed" @click="toggleSideBar"></div>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <button class="link_button" style="width: 100%" v-for="(icon, index) in baricon" :key="index">
      <div class="link_icon">
        <i :class="icon" style="color: black;"></i>
      </div>
      <div class="link_text">
        <p class="link_text_text" @click="handle" v-show="!collapsed">{{ bartext[index] }}</p>
      </div>
    </button>
    <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSideBar">
      <i class="fas fa-angle-double-left"></i>
    </span>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/js/all'
import { ref, computed } from '@vue/reactivity'

export default {
  emit: ['render'],
  setup(props, { emit }) {
    const collapsed = ref(true);
    const baricon = ref(['fas fa-chart-line', 'fas fa-location-arrow', 'fas fa-calendar-day', 'fas fa-clipboard-list', 'fas fa-arrow-right']);
    const bartext = ref(['Status', 'Action', 'Log', 'Goal', 'Leave']);
    const handle = (event) => {collapsed.value = !collapsed.value; emit('render', event.target)};
    const toggleSideBar = () => (collapsed.value = !collapsed.value);
    const SIDEBAR_WIDTH = 12;
    const SIDEBAR_WIDTH_COLLAPSED = 3;
    const sidebarWidth = computed(
      () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}vw`
    );
    return{ collapsed, baricon, bartext, handle, toggleSideBar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED, sidebarWidth};
  }
}
</script>

<style>
.black{
  position: fixed;
  z-index: 799;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
:root {
  --sidebar-bg-color: #bdbdbd;
  --sidebar-font-color: #323639;
}
.sidebar {
  position: fixed;
  z-index: 899;
  float: left;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: var(--sidebar-bg-color);
  color: var(--sidebar-font-color);
  transition: 0.2s ease;
}
@media only screen and (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
.link_button{
  flex: none;
  display: flex;
  margin-top: 2vh;
  border: 0;
  padding: 0;
  background: transparent;
}
.link_icon{
  flex: none;
  width: 3vw;
}
.link_text{
  flex: none;
  width: 80%;
  height: 100%;
  display: flex;  
  align-items: center;
  cursor: pointer;
}
.link_text_text{
  flex: none;
  width: 100%;
  margin: 0;
  font-family: 'Comfortaa', cursive;
  font-size: 16px;
  text-align: left;
  color: #323639;
}
.collapse-icon{
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  transition: 0.2s linear;
}
.rotate-180{
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>