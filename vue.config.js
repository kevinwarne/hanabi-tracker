const path = require('path');

module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],

  publicPath: '/hanabi-tracker/',

  outputDir: path.resolve(__dirname, './docs')
}