<template>
  <div>
    <v-row>
      <v-col v-if="[3, 4, 5].includes(number)">
        <div class="circle" :style="pipStyle"></div>
      </v-col>

      <v-col v-if="[4, 5].includes(number)">
        <div class="circle" :style="pipStyle"></div>
      </v-col>
      <v-col v-else></v-col>
    </v-row>
    <v-row>
      <v-col v-if="[2].includes(number)">
        <div class="circle" :style="pipStyle"></div>
      </v-col>
      <v-col v-if="[1, 2, 3, 5].includes(number)">
        <div class="circle" :style="pipStyle"></div>
      </v-col>
      <v-col v-else></v-col>
    </v-row>
    <v-row>
      <v-col v-if="[4, 5].includes(number)">
        <div class="circle" :style="pipStyle"></div>
      </v-col>
      <v-col v-else></v-col>

      <v-col v-if="[3, 4, 5].includes(number)">
        <div class="circle" :style="pipStyle"></div>
      </v-col>
    </v-row>
  </div>

  <!-- <svg
    class="tile-pips"
  >
    <circle>
    </circle>
  </svg> -->
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      required: true
    },
    color: {
      type: Object
    }
  },

  computed: {
    pipStyle () {
      return {
        background: this.color ? this.color.color : '#777'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // svg {
  //   width: 100%;
  //   height: 79px;
  // }

  // .row {
  //   height: 28px;
  // }

  .col {
    // height: 20px;
    padding: 0;
    margin: 4px 0px;
    width: 20px;
    height: 20px;
  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #777;
    margin: auto;
  }
</style>