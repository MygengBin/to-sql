const fs = require('fs')
const path = require('path')
const currentTimestamp = '';/**new Date().getTime() */
const procedureName = 'customAddColumnSql_'+ currentTimestamp
const PreExistsDeleteProcedureSql = `DROP PROCEDURE IF EXISTS ${procedureName};\n`
const { makeColumnObj, makeInitInsert } = require('./sqlColumn')
class main{
  fullSql=''
  cn_name=''
  databaseName=''
  tableName=''
  columnArr=[]
  changeDataSql=''
  outputSqlPath=''
  isInit= true
  initProcedure(){
    const createProcedureSql = `CREATE PROCEDURE ${procedureName} ( IN databaseName LONGTEXT, IN tableName LONGTEXT, IN columnName LONGTEXT, IN sqlType LONGTEXT ) 
    BEGIN
      SET @SQL1 = "SELECT COUNT( COLUMN_NAME ) INTO @countNum FROM INFORMATION_SCHEMA.COLUMNS WHERE ";
      SET @selectAllSql = CONCAT( @SQL1, 'TABLE_SCHEMA = "', databaseName, '" AND TABLE_NAME = "', tableName, '" AND column_name ="', columnName, '";' );
      PREPARE stmt FROM @selectAllSql;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
      SET @operateSql = 'MODIFY';
      IF @countNum = 0 THEN SET @operateSql = "ADD"; END IF;
      SET @changeSql = CONCAT( "ALTER TABLE \`", databaseName, '\`.\`', tableName, '\` ', @operateSql, ' COLUMN \`', columnName, '\` ', sqlType );
      PREPARE stmt2 FROM @changeSql;
      EXECUTE stmt2;
      DEALLOCATE PREPARE stmt2;
    END;`
    return PreExistsDeleteProcedureSql + '\n' + createProcedureSql + '\n';
  }
  buildFun(){
    let str= `CREATE TABLE IF NOT EXISTS ${this.tableName}(\n`
    str+=`  id BIGINT PRIMARY KEY AUTO_INCREMENT UNIQUE NOT NULL\n`
    str+=');\n'
    /* str+= this.callProcedure({
      databaseName: this.databaseName,
        tableName: this.tableName,
        columnName: 'id',
        sqlType: 'BIGINT PRIMARY KEY AUTO_INCREMENT UNIQUE NOT NULL',
    }) */
    this.columnArr.forEach(item=>{
      str += this.callProcedure({
        databaseName: this.databaseName,
        tableName: this.tableName,
        columnName: item.columnName,
        sqlType: item.sqlType,
      })
    })
    return str
  }
  callProcedure({
    databaseName,
    tableName,
    columnName,
    sqlType,
  }){
    return `CALL ${procedureName} ('${databaseName}','${tableName}','${columnName}',"${sqlType.replace(/"/g,'\\\"')}");\n`
  }
  constructor({ cn_name='', databaseName='', tableName ='', columnArr=[], changeDataSql, outputSqlPath, isInit }){
    this.cn_name = cn_name
    this.databaseName = databaseName
    this.tableName = tableName
    this.columnArr = columnArr
    this.changeDataSql = changeDataSql
    this.outputSqlPath = outputSqlPath
    this.isInit = isInit
    this.run()
  }
  run(){
    this.fullSql = ''
    this.fullSql += this.firstComment()
    this.fullSql += this.initProcedure()
    this.fullSql +=this.buildFun()
    this.fullSql += PreExistsDeleteProcedureSql
    if(this.isInit && this.changeDataSql) this.fullSql += this.changeDataSql
    fs.writeFileSync(path.join(this.outputSqlPath,`${this.tableName}.sql`),this.fullSql)
    console.log(`${this.tableName}.sql done`)
  }
  firstComment(){
    return `-- ${this.cn_name}\n`;
  }
}
function getSqlFileArr({jsSqlPath}){
  if(!jsSqlPath) return []
  return fs.readdirSync(jsSqlPath)
}

/**
 * it will make sql js output a sql file
 * @param databaseName
 * @param jsSqlPath
 * @param outputSqlPath
 * @param isInit is init, if init and exists data then will merge
 */
module.exports = ({
  databaseName='',
  jsSqlPath='',
  outputSqlPath='',
  isInit= true,
}) => {
  getSqlFileArr({jsSqlPath}).forEach(item=>{
    if(!path.extname(item).includes('js')) return
    const { cn_name, columnArr, changeDataSql, insertColumn } = require(path.join(jsSqlPath,item))
    const tableName = item.replace(/\..*/g,'')
    new main({
      cn_name,
      tableName,
      databaseName,
      columnArr: makeColumnObj(columnArr),
      changeDataSql: makeInitInsert({
        columnArr: insertColumn?insertColumn:columnArr.map(i=>i[0]),
        insertArr: changeDataSql,
        tableName,
      }),
      outputSqlPath,
      isInit,
    })
  })
  console.log('Run finished!')
}
