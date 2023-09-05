const path =  require("path");
const fs = require("fs");

function outputFilePath({
  sqlRequireFolderPath,
  sqlFileArr=[],
}){
  return sqlFileArr.map((item) => {
    const allPath = path.join(sqlRequireFolderPath, item)
    const text = fs.readFileSync(allPath, 'utf8')
    const cn_title = text.split(/\r?\n/)[0].replace('-- ', '')
    return `[${cn_title} ${item}](./src/sql/${item})`
  }).reduce((total, item, index, arr) => {
    total += item
    if (arr.length - 1 >= index) total += '<br>\n'
    return total
  }, '')
}
exports.outputFilePath = outputFilePath