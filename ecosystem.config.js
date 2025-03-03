module.exports = {
  apps : [{
    script: './dist/src/app.js',
    name: 'challengezone',
    env_production: {
      NODE_ENV: "production"
    }
  }]
}