const path = require('path');

module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],

  publicPath: process.env.NODE_ENV === 'production'
    ? '/hanabi-tracker/'
    : '/',

  outputDir: path.resolve(__dirname, './docs')
}