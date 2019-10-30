const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')
const compression = require('compression')
const fs = require('fs')

const proxy = async () => {
  var app = express()

  app.use(compression())

  var settings = JSON.parse(fs.readFileSync('proxy.json'))

  var keys = Object.keys(settings)
  keys.forEach(key => {
    console.log(`Using api server: ${key}`)

    app.use(
      settings[key].path,
      proxyMiddleware({
        target: settings[key].target,
        changeOrigin: true
      })
    )
  })

  app.use('/', proxyMiddleware('http://localhost:1234'))

  app.listen(3800)
}

module.exports = function(bundler) {
  proxy()
}