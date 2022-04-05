const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: 'http://craigdanielharris.com:3500'
  }
}
