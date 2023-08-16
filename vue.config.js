// Inside vue.config.js
module.exports = {
  publicPath:'',
  pwa: {
    name: 'Markeer',
    themeColor: '#32b6e6',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      start_url: '/'
    },
  }
}
