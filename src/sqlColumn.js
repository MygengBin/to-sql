exports.makeColumnObj = arr => arr.map(i=>({
  columnName: i[0],
  sqlType: i[1]
}))
exports.makeInitInsert = ({
  columnArr=[],
  insertArr=[],
  tableName='',
}) => {
  if(!insertArr || toString.call(insertArr)!=='[object Array]') return ''
  return insertArr.reduce((total, item, index, arr)=>{
    let str = ''
    if(index==0) str+=`INSERT INTO ${tableName}(${columnArr.map(i=>`\`${i}\``).join(',')}) VALUES`
    str += item.reduce((total, item, index,arr )=>{
      if(index===0) total += `(`
      total += toString.call(item)==='[object Number]'?item:`'${item.replace(/\'/g,'\\\'')}'`
      total += arr.length -1 ===index?')':','
      return total
    },'')
    str += arr.length -1 ===index?';':',\n'
    total+=str
    return total
  },'')
}