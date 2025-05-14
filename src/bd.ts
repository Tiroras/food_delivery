import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testConnect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Успешное подключение к MySQL');
    connection.release();
  } catch (error: any) {
    console.error('Ошибка подключения к MySQL:', error.message);
    process.exit(1);
  }
}

testConnect();

export default pool;