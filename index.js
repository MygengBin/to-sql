const fs = require('fs')
const path = require('path')
module.exports = class {
  sqlFileArr=[]
  sqlRequireFolderPath=''
  buildDist=''
  justRelativePath=''
  getSqlFileArr(){
    return fs.readdirSync(this.sqlRequireFolderPath)
  }
  getSqlText({ allPath='' }){
    if(!allPath && !fs.existsSync(allPath)) return ''
    return fs.readFileSync(allPath,'utf8')
  }
  writeAllFile({ distPath='', text='' }){
    fs.appendFileSync(distPath,text)
  }
  constructor({
    sqlRequireFolderPath,
    buildDist,
    justRelativePath,
  }){
    this.sqlRequireFolderPath = sqlRequireFolderPath
    this.sqlFileArr = this.getSqlFileArr()
    this.buildDist = buildDist
    this.justRelativePath = justRelativePath
    this.initDir()
  }
  build(){
    if(toString.call(this.sqlFileArr)!=='[object Array]' || !this.sqlFileArr.length) return console.log('sqlFileArr is NOT FINED')
    const writeToFile = path.join(this.buildDist,'dist.sql')
    fs.writeFileSync(writeToFile,'')
    this.sqlFileArr.forEach(item=>{
      this.writeAllFile({
        distPath: writeToFile,
        text: this.getSqlText({allPath: path.join(this.sqlRequireFolderPath,item) })+'\n'
      })
      console.log(`${item} done`)
    })
  }
  initDir(){
    const distPath = path.join(this.buildDist)
    if(!fs.existsSync(distPath)) fs.mkdirSync(distPath)
    fs.writeFileSync(path.join(distPath,'dist.sql'), '')
  }
}