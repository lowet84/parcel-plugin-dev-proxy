const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')
const compression = require('compression')
const fs = require('fs')

const proxy = async () => {
  var app = express()

  app.use(compression())

  var settings = JSON.parse(fs.readFileSync('proxy.json'))

  settings.forEach(setting => {
    console.log(`Using api server: ${setting.path} -> ${setting.target}`)

    app.use(
      setting.path,
      proxyMiddleware({
        target: setting.target,
        changeOrigin: true
      })
    )
  })

  app.use('/', proxyMiddleware('http://localhost:1234'))

  console.log('Running proxy on: http://localhost:3800')
  app.listen(3800)
}

module.exports = function(bundler) {
  if (!process.argv.includes('build')) proxy()
}
