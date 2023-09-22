const path =  require("path");
const fs = require('fs')
/**
 * For Markdown link to path
 * @param sqlRequireFolderPath
 * @param justRelativePath
 * @returns {string}
 */
function outputFilePath({
  sqlRequireFolderPath,
  justRelativePath='',
}){
  const sqlFileArr = fs.readdirSync(sqlRequireFolderPath)
  return sqlFileArr.map((item) => {
    if(!path.extname(item).includes('js')) return null
    const allPath = path.join(sqlRequireFolderPath, item)
    const { cn_name:cn_title } = require(allPath)
    return `[${cn_title} ${item}](${justRelativePath}/${item})`
  }).filter(i=>i).reduce((total, item, index, arr) => {
    total += item
    if (arr.length - 1 >= index) total += '<br>\n'
    return total
  }, '')
}
exports.outputFilePath = outputFilePath