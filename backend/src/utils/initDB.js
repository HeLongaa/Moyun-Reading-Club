/**
 * 数据库初始化脚本
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { queryConfig } = require('./index');

// 获取配置信息
const dbInfo = queryConfig('Database');
const adminInfo = queryConfig('Admin');

// 创建命令行交互接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 询问root密码
rl.question('请输入MySQL root用户密码：', async (rootPassword) => {
  console.log('>>---------------------------------------初始化数据库---------------------------------------<<');
  
  try {
    // 连接数据库
    const connection = await mysql.createConnection({
      host: dbInfo.Host,
      port: dbInfo.Port,
      user: 'root',
      password: rootPassword
    });
    
    console.log('数据库连接成功，正在使用root账户初始化数据库');
    
    // 创建数据库
    try {
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS ${dbInfo.Database} DEFAULT CHARSET utf8 COLLATE utf8_general_ci;`
      );
      console.log(`数据库 ${dbInfo.Database} 创建成功`);
    } catch (error) {
      console.error('数据库创建失败，请检查数据库名称是否合法:', error);
      process.exit(-1);
    }
    
    // 创建数据库管理员账户
    try {
      await connection.query(
        `CREATE USER IF NOT EXISTS '${dbInfo.Account}'@'${dbInfo.Host}' IDENTIFIED BY '${dbInfo.Password}';`
      );
      console.log(`用户'${dbInfo.Account}'@'${dbInfo.Host}'创建成功，密码: ${dbInfo.Password}`);
    } catch (error) {
      // 密码太简单，尝试降低安全级别再创建用户
      try {
        await connection.query('SET global validate_password.policy = 0;');
        await connection.commit();
        await connection.query(
          `CREATE USER IF NOT EXISTS '${dbInfo.Account}'@'${dbInfo.Host}' IDENTIFIED BY '${dbInfo.Password}';`
        );
        console.warn(`密码级别过低，已降低密码安全级别`);
        console.log(`用户'${dbInfo.Account}'@'${dbInfo.Host}'创建成功，密码: ${dbInfo.Password}`);
      } catch (innerError) {
        console.error('用户创建失败:', innerError);
        process.exit(-1);
      }
    }
    
    // 为数据库管理员账户授权
    await connection.query(
      `GRANT ALL PRIVILEGES ON ${dbInfo.Database}.* TO '${dbInfo.Account}'@'${dbInfo.Host}';`
    );
    console.log(`用户'${dbInfo.Account}'@'${dbInfo.Host}'授权成功`);
    await connection.commit();
    
    // 导入DDL
    const ddlPath = path.join(process.cwd(), 'ddl.sql');
    if (!fs.existsSync(ddlPath)) {
      console.error('找不到DDL文件:', ddlPath);
      process.exit(-1);
    }
    
    const ddlContent = fs.readFileSync(ddlPath, 'utf8');
    try {
      // 切换到目标数据库
      await connection.query(`USE ${dbInfo.Database};`);
      
      // 分割SQL语句并执行
      const sqlStatements = ddlContent.split(';').filter(stmt => stmt.trim());
      for (const stmt of sqlStatements) {
        if (stmt.trim()) {
          await connection.query(stmt);
        }
      }
      console.log('数据库模板导入成功');
    } catch (error) {
      console.error('数据库模板导入失败:', error);
      process.exit(-1);
    }
    
    console.log('>>---------------------------------------创建平台管理员---------------------------------------<<');
    
    // 创建平台管理员账户
    try {
      // 生成密码哈希
      const passwordHash = await bcrypt.hash(adminInfo.Password, 10);
      
      // 检查用户是否已存在
      const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [adminInfo.ID]);
      
      if (rows.length > 0) {
        console.log(`管理员账户 ID:${adminInfo.ID} 已存在，跳过创建`);
      } else {
        await connection.query(
          'INSERT INTO user(id,account,password,signature,email,telephone,role) VALUES (?,?,?,?,?,?,?)',
          [
            adminInfo.ID,
            adminInfo.Account,
            passwordHash,
            adminInfo.Signature,
            adminInfo['E-Mail'],
            adminInfo.Telephone,
            'admin'
          ]
        );
        console.log(`管理员账户 ${adminInfo.Account} 创建成功，密码: ${adminInfo.Password}`);
      }
    } catch (error) {
      console.error('管理员账户创建失败:', error);
      process.exit(-1);
    }
    
    console.log('数据库初始化完成');
    process.exit(0);
    
  } catch (error) {
    console.error('数据库连接失败，请检查MySQL服务是否正常，或root用户的密码是否正确:', error);
    process.exit(-1);
  }
}); 