// require all test files using special webpack feature
// https://webpack.github.io/docs/context.html#require-context

var testsContext = require.context('.', true, /\AlertSpec$/)
testsContext.keys().forEach(testsContext)