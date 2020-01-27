<template>
  <div class="tracker">

    <!-- <v-container>
      <v-btn color="grey" class="mr-n3 mt-1" @click="dialog = true" float right text fab small>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
      <v-btn color="grey" class="mr-n3 mt-1" @click="dialog = true" float right text fab small>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-container> -->

    <v-row class="mt-1 mr-1 ml-1">
      <v-btn color="grey" @click="resetTiles" text fab small>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="stackIndex === 0" color="grey" @click="undo" text fab small>
        <v-icon>mdi-undo</v-icon>
      </v-btn>
      <v-btn :disabled="stackIndex === stackMax" color="grey" @click="redo" text fab small>
        <v-icon>mdi-redo</v-icon>
      </v-btn>
      <v-btn color="grey" @click="dialog = true" text fab small>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-row>
    <!-- <v-btn color="grey" class="mr-n3 mt-1" @click="dialog = true" absolute right text fab small dark>
      <v-icon>mdi-settings</v-icon>
    </v-btn> -->
    
    <v-container class="mt-n4 tile-container" :class="{dragging: dragging}">
      <draggable
        v-model="tiles"
        class="v-tabs__container"
        :delay="25"
        @start="draggingStart"
        @end="draggingEnd"
      >
        <transition-group
          name="tile-list"
          class="tile-list d-flex mx-n3"
        >
          <v-col
            class="tile-item"
            :style="{
              width: `${100 / tileCount}%`,
              left: `${i * 100 / tileCount}%`
            }"
            v-for="(tile, i) in tiles"
            :key="tile.key"
            @click="tile.selected = !tile.selected"
          >
            <Tile :tile="tile"/>
          </v-col>
        </transition-group>
      </draggable>
    </v-container>

    <v-bottom-sheet
      :value="selectedTiles.length"
      hide-overlay
      persistent
    >
      <v-sheet
        class="pa-2 text-center"
        dark
      >
        <v-row>
          <v-col
            cols="6"
          >
            <div class="set-color">
              <v-select
                :items="colors"
                v-model="color"
                label="Set Color"
                item-text="label"
                item-value="code"
                return-object
                outlined
                hide-details
                @change="setColor"
              >
                <template slot="item" slot-scope="data">
                  <v-img
                    :src="require(`../assets/${data.item.code}.png`)"
                    contain
                    max-width="40"
                  ></v-img>
                  
                  {{ data.item.label }}
                </template>
              </v-select>
            </div>
          </v-col>
          <v-col
            cols="6"
          >
            <v-select
              :items="numbers"
              v-model="number"
              label="Set Number"
              outlined
              hide-details
              @change="setNumber"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-if="selectedTiles.length === 1"
          >
            <v-btn
              outlined
              width="100%"
              color="primary"
              small
              @click="playDiscard"
            >Play / Discard</v-btn>
          </v-col>
          <!-- <v-col
          >
            <v-btn outlined width="100%" color="red" small @click="cancelSelection">Cancel</v-btn>
          </v-col> -->
          <v-col>
            <v-btn outlined width="100%" color="red" small @click="cancelSelection">Cancel</v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Options</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container>
          <v-row>
            <v-col
              cols="6"
            >
              <v-select
                :items="conventionItems"
                v-model="convention"
                label="Add Tile Convention"
                item-text="label"
                return-object
                outlined
                hide-details
              ></v-select>
            </v-col>

            <v-col
              cols="6"
            >
              <v-select
                :items="playersItems"
                v-model="players"
                label="Players"
                outlined
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { range, cloneDeep } from 'lodash'
import Tile from './Tile'
import draggable from 'vuedraggable'

export default {
  data () {
    return {
      dialog: false,
      conventionItems: [
        { label: 'Shift Right', code: 'shift-right' },
        { label: 'Shift Left', code: 'shift-left' },
        { label: 'Replace', code: 'replace' },
      ],
      convention: { label: 'Shift Right', code: 'shift-right' },
      playersItems: range(2, 6),
      players: 4,
      tiles: [],
      stack: [],
      stackIndex: null,
      tileKey: 1,
      color: null,
      number: null
    }
  },

  created () {
    this.resetTiles()
  },

  mounted () {
    // let vh = window.innerHeight * 0.01
    // document.documentElement.style.setProperty('--vh', `${vh}px`)
    // window.addEventListener('resize', () => {
    //   let vh = window.innerHeight * 0.01
    //   document.documentElement.style.setProperty('--vh', `${vh}px`)
    // });
  },

  watch: {
    tileCount () {
      this.stack = []
      this.resetTiles()
    },
  },

  computed: {
    tileCount () {
      return this.players >= 4 ? 4 : 5
    },

    selectedTiles () {
      return this.tiles.filter(tile => tile.selected)
    },

    dragging () {
      return this.tiles.some(tile => tile.dragging)
    },

    stackCurrent () {
      return this.stack[this.stackIndex]
    },

    stackMax () {
      return this.stack.length - 1
    },

    ...mapState(['colors', 'colorMulticolor', 'numbers'])
  },

  methods: {
    setNumber () {
      this.selectedTiles.forEach(tile => tile.number = this.number)
      this.tiles
        .filter(tile => !tile.number && !this.selectedTiles.includes(tile) && !tile.notNumbers.includes(this.number))
        .forEach(tile => tile.notNumbers.push(this.number))
      this.resetSelection()
      this.pushStack()
    },

    setColor () {
      this.selectedTiles.forEach(tile => {
        tile.color = tile.color && tile.color !== this.color ? this.colorMulticolor : this.color
      })
      this.tiles
        .filter(tile => !tile.color && !this.selectedTiles.includes(tile) && !tile.notColors.includes(this.color))
        .forEach(tile => tile.notColors.push(this.color))
      this.resetSelection()
      this.pushStack()
    },

    resetSelection () {
      setTimeout(() => {
        this.color = null
        this.number = null
      }, 0)
      this.tiles.forEach(tile => tile.selected = false)
    },

    resetTiles () {
      this.tiles = [...Array(this.tileCount)].map(this.getNextTile)
      this.stack = []
      this.pushStack()
    },

    getNextTile () {
      return {
        key: this.tileKey += 1,
        selected: false,
        number: null,
        color: null,
        notNumbers: [],
        notColors: [],
        dragging: false
      }
    },

    cancelSelection () {
      this.tiles.forEach(tile => tile.selected = false)
    },

    playDiscard () {
      const tile = this.selectedTiles[0]
      const index = this.tiles.indexOf(tile)
      this.tiles.splice(index, 1)

      setTimeout(() => {
        switch (this.convention.code) {
          case 'shift-right':
            this.tiles.unshift(this.getNextTile())
            break
          case 'shift-left':
            this.tiles.push(this.getNextTile())
            break
          case 'replace':
            this.tiles.splice(index, 0, this.getNextTile())
            break
        }
        this.pushStack()
      }, 0)
    },
    draggingStart (event) {
      this.tiles[event.oldIndex].dragging = true
    },
    draggingEnd (event) {
      setTimeout(() => {
        this.tiles[event.newIndex].dragging = false
      }, 0)
      if (event.oldIndex !== event.newIndex) this.pushStack()
    },
    reStack () {
      this.stack.splice(this.stackIndex + 1)
    },
    pushStack () {
      if (this.stackIndex !== this.stackMax) this.reStack()
      this.stack.push(cloneDeep(this.tiles))
      this.stackIndex = this.stackMax
    },
    undo () {
      this.stackIndex -= 1
      this.tiles = cloneDeep(this.stackCurrent)
    },
    redo () {
      this.stackIndex += 1
      this.tiles = cloneDeep(this.stackCurrent)
    }
  },

  components: {
    Tile,
    draggable
  }
}
</script>

<style lang="scss">
  // .tracker {
  //   height: 100vh;
  //   height: calc(var(--vh, 1vh) * 100);
  // }
  .tile-container {
    &:not(.dragging) {
      .tile-item {
        transition: all 1s;
        position: absolute;
      }
      .tile-list-enter {
        opacity: 0;
        transform: translateY(50%);
      }
      .tile-list-leave-to {
        transform: translateY(-130%);
        opacity: 0;
      }
    }
  }
</style>

