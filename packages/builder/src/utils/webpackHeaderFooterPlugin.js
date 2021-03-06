// We need to do a bit of magic to allow the es6 module syntax to work

const { ConcatSource } = require('webpack-sources')

// expose the context as a global so that polyfills can use it
// without passing it all the way down
const header = `var that = this;
function __skpm_run (key, context) {
  that.context = context;
`
// exports is defined here by webpack
const footer = definedKeys => `  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
${definedKeys
  .map(k => {
    if (k === 'onRun') {
      return `that['${k}'] = __skpm_run.bind(this, 'default')`
    }
    if (k === 'run') {
      return `that['${k}'] = __skpm_run.bind(this, 'default')`
    }
    return `that['${k}'] = __skpm_run.bind(this, '${k}')`
  })
  .join(';\n')}
`

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
module.exports = function WebpackFooterPlugin(definedKeys) {
  return {
    apply(compiler) {
      compiler.plugin('compilation', compilation => {
        compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
          chunks.forEach(chunk => {
            if (!chunk.isInitial()) return
            chunk.files.forEach(file => {
              compilation.assets[file] = new ConcatSource(
                header,
                '\n',
                compilation.assets[file],
                '\n',
                footer(definedKeys)
              )
            })
          })
          callback()
        })
      })
    },
  }
}
