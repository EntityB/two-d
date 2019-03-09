const { lstatSync, readdirSync, existsSync } = require('fs')
const { join, resolve } = require('path')

const isFile = source => existsSync(source) && lstatSync(source).isFile()

const getEntries = source =>
  readdirSync(source).reduce((result, item) => {
    if (isFile(join(source, item, 'index.js'))) {
      result[item] = resolve(__dirname, join(source, item, 'index.js'))
    }
    return result
  }, {})

const entries = getEntries('examples')
console.log("\nCreating files for following examples: \n", entries, "\n\n")


const config = {
  mode: 'none',
  // example data format:
  // { 
  //   'hello-world': '/path/examples/hello-world/index.js',
  //   scenegraph: '/path/examples/scenegraph/index.js' 
  // }
  entry: entries,
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'preview'),
    libraryTarget: 'global'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}

module.exports = config;