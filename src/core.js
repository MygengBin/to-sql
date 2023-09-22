const fs = require('fs')
const path = require('path')
function writeAllFile({ distPath='', text='' }){
  fs.appendFileSync(distPath,text)
}
function getSqlText({ allPath='' }){
  if(!allPath && !fs.existsSync(allPath)) return ''
  return fs.readFileSync(allPath,'utf8')
}
exports.build = ({
  sqlFileFolderPath = '',
  buildDist = '',
}) => {
  if(!sqlFileFolderPath || !path.join(sqlFileFolderPath)) return console.log('sqlFileFolderPath is error')
  const sqlFileArr = fs.readdirSync(path.join(sqlFileFolderPath))
  if(toString.call(sqlFileArr)!=='[object Array]' || !sqlFileArr.length) return console.log('sqlFileArr is NOT FINED')
  const writeToFile = path.join(buildDist,'dist.sql')
  fs.writeFileSync(writeToFile,'')
  sqlFileArr.forEach(item=>{
    writeAllFile({
      distPath: writeToFile,
      text: getSqlText({allPath: path.join(sqlFileFolderPath,item) })+'\n'
    })
    console.log(`${item} done`)
  })
}