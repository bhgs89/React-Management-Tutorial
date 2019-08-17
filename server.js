// file에 접근 할 수 있는 library
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database.json file 읽어오기
const data = fs.readFileSync('./database.json');

// 해당 환경설정 데이터를 가져온다
const conf = JSON.parse(data);

// mysql library 이용하기
const mysql = require('mysql');

// 연결과 관련한 변수 설정
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
// 실제로 연결
connection.connect();

// 클라이언트가 server -> /api/customers 에 접속했을 때
app.get('/api/customers', (req, res) => {
  connection.query('SELECT * FROM CUSTOMER', (err, rows, fields) => {
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
