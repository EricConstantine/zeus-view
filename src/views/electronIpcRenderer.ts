// 测试MySQL连接
// 数据库相关
const mysql = require('mysql')
const oracledb = require('oracledb')
// let oraclesrc = localStorage.getItem("oraclesrc")
// if(oraclesrc){
//   oracledb.initOracleClient({libDir: 'F:\\oraclevmware\\instantclient_12_2'});
//
// }

let evt: any
export const sqlLink = async(event: any, args: any) => {
  evt = event
  // 初始化mysql参数
  const arr = args.split(',')
  const _dbHost = arr[0]
  const _dbUser = arr[1]
  const _dbPassword = arr[2]
  const _dbPort = arr[3]
  const _dbName = arr[4]
  const _dbType = arr[5]
  const querySql = 'select 1 from DUAL'
  // 初始化模块列表
  if (_dbType == 1) {
    const connection = mysql.createConnection({
      host: _dbHost,
      user: _dbUser,
      password: _dbPassword,
      port: _dbPort,
      database: _dbName
    })
    connection.connect()
    const mySqlIs = await new Promise(resolve => {
      connection.query(querySql, [], function(err: any, result: any) {
        if (err) {
          resolve({ isNot: false, message: 'MySQL数据库连接：失败！' })
        } else {
          resolve({ isNot: true, message: 'MySQL数据库连接：成功！' })
        }
      })
    })
    connection.end()
    return mySqlIs
  } else {
    const DB_CONFIG = {
      user: _dbUser,
      password: _dbPassword,
      // IP:PORT/数据库名称}
      connectString: _dbHost + ':' + _dbPort + '/' + _dbName
    }
    const connection = await oracledb.getConnection(DB_CONFIG)
    let finalResult = { isNot: false, message: 'ORACLE数据库连接：失败！' }
    try {
      const result = await connection.execute(querySql, {}, {})
      console.log('oracle查询结果result>>')
      console.log(result)
      if (result) {
        finalResult = { isNot: true, message: 'ORACLE数据库连接：成功！' }
      }
    } catch (e) {
      console.log('报错了')
    } finally {
      await connection.close()
      return finalResult
    }
  }
}

export const initOracleClient = async(event: any, args: any) => {
  console.log('args====', args)
  const result = await new Promise(resolve => {
    try {
      oracledb.initOracleClient({ libDir: args })
      resolve({ isNot: true, message: 'ORACLE数据库初始化成功！' })
    } catch (err) {
      console.error('Whoops!')
      console.error(err)
      process.exit(1)
      resolve({ isNot: true, message: 'ORACLE数据库初始化失败' })
    }
  })
  return result
}

// 查询模块列表
export const initModels = async(event: any, args: any) => {
  console.log('args====', args)
  if (args.dbtype == 1) {
    const connection = mysql.createConnection({
      host: args.host,
      user: args.user,
      password: args.password,
      port: args.port,
      database: args.database
    })
    connection.connect()
    const sql = 'SELECT LOWER(table_name) tablename,IFNULL(table_comment,"无描述") comments FROM information_schema.tables WHERE table_schema="' + args.database + '" AND table_type="base table"' // AND LOCATE("model_",table_name)>0
    const sqlList = await new Promise(resolve => {
      connection.query(sql, [], function(err: any, result: any) {
        if (err) {
          resolve({ isNot: false, data: result, message: 'MySQL数据库获取失败' })
        } else {
          resolve({ isNot: true, data: result, message: 'MySQL数据库获取成功' })
        }
      })
    })
    connection.end()
    return sqlList
  } else {
    const DB_CONFIG = {
      user: args.user,
      password: args.password,
      connectString: args.host + ':' + args.port + '/' + args.database
    }
    const connection = await oracledb.getConnection(DB_CONFIG)
    let finalResult = { isNot: false, data: null, message: 'RACLE数据库获取失败' }
    try {
      const querySql = 'SELECT TABLE_NAME "tablename",NVL(COMMENTS,\'无描述\') "comments" FROM(SELECT a.TABLE_NAME,b.COMMENTS FROM user_tables a,user_tab_comments b WHERE  a.TABLE_NAME=b.TABLE_NAME ORDER BY  TABLE_NAME)'
      const result = await connection.execute(querySql, {}, { outFormat: oracledb.OBJECT })
      console.log('oracle查询结果result')
      console.log(result)
      if (result) {
        finalResult = { isNot: true, data: result.rows, message: 'ORACLE数据库获取成功' }
      }
    } catch (e) {
      console.log('报错了')
      console.log(e)
    } finally {
      await connection.close()
      return finalResult
    }
  }
}

// 查询模块内容
export const initContents = async(event: any, args: any) => {
  if (args.dbtype == 1) {
    const connection = mysql.createConnection({
      host: args.host,
      user: args.user,
      password: args.password,
      port: args.port,
      database: args.database
    })
    connection.connect()
    const sql = 'SELECT LOWER( column_name ) columnName,data_type AS dataType,\n' +
      'CASE WHEN data_type = \'int\' THEN \'11\' WHEN data_type = \'tinyint\' THEN \'4\'  WHEN data_type = \'bigint\' THEN \'20\' ELSE CAST( IFNULL( character_maximum_length, \'\' ) AS CHAR ) END AS columnLen, column_comment AS commentName,\n' +
      'CASE WHEN column_key = \'PRI\' THEN \'Y\' ELSE \'N\' END AS isKey,CASE WHEN is_nullable = \'YES\' THEN \'N\' ELSE \'Y\' END AS nullable,table_name tableName,numeric_scale scale,column_default defalutValue\n' +
      'FROM Information_schema.COLUMNS  WHERE table_Name = \'' + args.modelname + '\' AND table_schema = \'' + args.database + '\''
    const sqlList = await new Promise(resolve => {
      connection.query(sql, [], function(err: any, result: any) {
        if (err) {
          resolve({ isNot: false, data: result, message: 'MySQL数据库获取失败' })
        } else {
          resolve({ isNot: true, data: result, message: 'MySQL数据库获取成功' })
        }
      })
    })
    connection.end()
    return sqlList
  } else {
    const DB_CONFIG = {
      user: args.user,
      password: args.password,
      connectString: args.host + ':' + args.port + '/' + args.database
    }
    const connection = await oracledb.getConnection(DB_CONFIG)
    let finalResult = { isNot: false, data: null, message: 'RACLE数据库获取失败' }
    try {
      const querySql = 'SELECT atc.COLUMN_NAME "columnName", atc.DATA_TYPE "dataType", atc.DATA_SCALE "scale", atc.DATA_LENGTH "columnLen",  \n' +
        '    CASE atc.NULLABLE WHEN \'N\' THEN \'Y\' ELSE \'N\' END AS "nullable",atc.DATA_DEFAULT "defalutValue", acc.COMMENTS "commentName", \n' +
        '    atc.TABLE_NAME "tableName",  \n' +
        '    CASE atc.COLUMN_NAME WHEN  ( SELECT col.column_name FROM all_constraints con  \n' +
        '    LEFT JOIN all_cons_columns col ON con.table_name = col.table_name  \n' +
        '    AND con.OWNER = col.OWNER AND con.CONSTRAINT_NAME = col.CONSTRAINT_NAME  \n' +
        '    WHERE con.constraint_type = \'P\'  \n' +
        '    AND col.table_name = \'' + args.modelname + '\' AND col.column_name = atc.COLUMN_NAME )  \n' +
        '    THEN \'Y\' ELSE \'N\' END AS "isKey"  \n' +
        '    FROM ALL_TAB_COLUMNS atc  \n' +
        '    LEFT JOIN ALL_COL_COMMENTS acc  \n' +
        '    ON acc.TABLE_NAME = atc.TABLE_NAME AND acc.COLUMN_NAME = atc.COLUMN_NAME  \n' +
        '    AND acc.OWNER = atc.OWNER  \n' +
        '    WHERE atc.TABLE_NAME = \'' + args.modelname + '\'  \n' +
        '    ORDER BY atc.COLUMN_ID'
      console.log('querySql')
      console.log(querySql)
      const result = await connection.execute(querySql, {}, { outFormat: oracledb.OBJECT })
      console.log('oracle查询结果result')
      console.log(result)
      if (result) {
        finalResult = { isNot: true, data: result.rows, message: 'ORACLE数据库获取成功' }
      }
    } catch (e) {
      console.log(e)
      console.log('报错了')
    } finally {
      await connection.close()
      // eslint-disable-next-line no-unsafe-finally
      return finalResult
    }
  }
}
