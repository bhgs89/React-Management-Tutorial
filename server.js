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

const multer = require('multer');
// upload 폴더 설정
const upload = multer({ dest: './upload' });

// 클라이언트가 server -> /api/customers 에 접속했을 때, data 가져오기
app.get('/api/customers', (req, res) => {
  connection.query('SELECT * FROM CUSTOMER', (err, rows, fields) => {
    res.send(rows);
  });
});

// 업로드 폴더 공유 => 이미지 폴더에서 해당 업로드 폴더 접근 가능
app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
  let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?)';
  let image = '/image/' + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  let params = [image, name, birthday, gender, job];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
