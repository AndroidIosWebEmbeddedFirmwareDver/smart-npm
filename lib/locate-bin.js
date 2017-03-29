var path = require('path')
var fs = require('fs')

/**
 *
 * 获取 module 中 bin 文件的绝对路径
 *
 * 只能用在同一个项目中，跨项目引用 require.resolve 解析会不准确
 *
 * @private
 * @param {String} module         - 模块名称
 * @param {String} [bin = module] - 模块中 bin 的名称，如果不设置就默认为模块名称
 * @returns {string} - 解析出的 bin 文件的绝对路径
 */
module.exports = function(module, bin) {
  var main = require.resolve(module)
  var parts = main.split(path.sep)
  bin = bin || module
  var ref = parts.pop()
  while (ref && (module !== ref || parts[parts.length - 1] !== 'node_modules')) {
    ref = parts.pop()
  }
  var binFile = path.join(parts.join(path.sep), '.bin', bin)

  // 当用 yarn 安装时，如果系统已经有相同版本的 npm 了，就不会重复安装
  // 这样就导致了 require.resolve 无法解析到 npm 文件，所以这里做个简单的兼容
  try {
    fs.statSync(binFile)
    return binFile
  } catch (e) {
    return 'npm'
  }

}
