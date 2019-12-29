import Vue from 'vue'
import Vuex from 'vuex'
import { range } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    colors: [
      { code: 'blue', label: 'Blue', color: 'rgb(147, 244, 246)'},
      { code: 'green', label: 'Green', color: 'rgb(138, 250, 77)'},
      { code: 'multicolor', label: 'Multicolor', color: 'pink'},
      { code: 'red', label: 'Red', color: 'rgb(244, 50, 35)'},
      { code: 'white', label: 'White', color: 'white'},
      { code: 'yellow', label: 'Yellow', color: 'rgb(249, 248, 86)'},
    ],

    numbers: range(1, 6)
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
