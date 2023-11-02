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
  filterExtName='js',
  setExtName='sql',
}){
  const sqlFileArr = fs.readdirSync(sqlRequireFolderPath)
  return sqlFileArr.map((item) => {
    const { name, ext } = path.parse(item)
    if(ext.substring(1)!==filterExtName) return null
    const allPath = path.join(sqlRequireFolderPath, item)
    const { cn_name:cn_title } = require(allPath)
    const newName = `${name}.${setExtName}`
    return `[${cn_title} ${newName}](${justRelativePath}/${newName})`
  }).filter(i=>i).reduce((total, item, index, arr) => {
    total += item
    if (arr.length - 1 >= index) total += '<br>\n'
    return total
  }, '')
}
exports.outputFilePath = outputFilePath