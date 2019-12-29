<template>
  <div>
    <v-card
      class="tile-wrapper"
      :class="classes"
      :elevation="tile.selected ? 8 : 0"
    >
      <v-card
        class="tile-main pa-3"
        height="109px"
        :style="{
          'border-style': tile.color ? 'solid' : 'dashed',
          'border-color': tile.color && tile.color.color 
        }"
        outlined
      >

        <div class="number">
          <div v-if="tileNumber">
            <TilePips
              :number="tileNumber"
              :color="tileColor"
            />
          </div>
          <div v-else class="unknown">
            ?
          </div>
        </div>
      </v-card>
    </v-card>

    <template v-if="!tileColor">
      <v-chip v-for="color in tile.notColors" :key="color.code" style="width:100%;" class="my-1" :color="color.color" small outlined>
        <v-icon small left>mdi-cancel</v-icon>
        Not {{ color.label }}
      </v-chip>
    </template>

    <template v-if="!tileNumber">
      <v-chip v-for="number in tile.notNumbers" :key="number" style="width:100%;" class="my-1" small outlined>
        <v-icon small left>mdi-cancel</v-icon>
        Not {{ number }}
      </v-chip>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TilePips from './TilePips'

export default {
  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  computed: {
    classes () {
      return {
        selected: this.tile.selected
      }
    },
    
    decidedNumber () {
      return this.tile.notNumbers.length === this.numbers.length - 1 ?
        this.numbers.find(number => !this.tile.notNumbers.includes(number)) :
        null
    },
    
    decidedColor () {
      return this.tile.notColors.length === this.colors.length - 1 ?
        this.colors.find(number => !this.tile.notColors.includes(number)) :
        null
    },

    tileNumber () {
      return this.tile.number || this.decidedNumber
    },

    tileColor () {
      return this.tile.color || this.decidedColor
    },

    ...mapState(['colors', 'numbers'])
  },

  components: {
    TilePips
  }
}
</script>

<style lang="scss" scoped>
  .tile-wrapper {
    transition: all 0.5s;
    border: 4px solid #333;

    .tile-main {
      border-width: 2px !important;
      // border-style: dashed !important;
      text-align: center;
      font-size: 40pt;
      cursor: pointer;

      .number {
        font-weight: 100;

        .unknown {
          color: #777;
          font-weight: 300;
        }
      }
    }

    &.selected {
      border: 4px solid #111;

      // .tile-main {
      //   border-style: solid !important;
      // }
    }

  }
</style>