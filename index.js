const oracledb = require('oracledb')
const DB_CONFIG = {
  user: 'fcvs',
  password: 'fcvs',
  connectString: '39.101.173.227:1521/helowin' // 数据库地址：{IP:PORT/数据库名称}
}

try {
  oracledb.initOracleClient({ libDir: 'F:\\oraclevmware\\instantclient_12_2' })
  oracledb.getConnection(
    DB_CONFIG,
    function(err, connection) {
      if (err) {
        console.error(err.message)
        return
      }
      const sql = 'SELECT LOWER(TABLE_NAME) "tablename",NVL(COMMENTS,\'无描述\') "comments" FROM(SELECT a.TABLE_NAME,b.COMMENTS FROM user_tables a,user_tab_comments b WHERE  a.TABLE_NAME=b.TABLE_NAME ORDER BY  TABLE_NAME)'
      connection.execute(sql, {}, { outFormat: oracledb.OBJECT }, (e, result) => {
        console.log(e)
        console.log(result)
      })
    })
} catch (err) {
  console.error('Whoops!')
  console.error(err)
  process.exit(1)
}
