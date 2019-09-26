const express = require('express');
const http = require("http");
const https = require("https");
const fs = require("fs");
const mongoose = require('mongoose'); //用来操作数据库
const bodyParser = require('body-parser');
const passport = require('passport'); //和token相关
const path = require('path');

const app = express();

//引入api 路由 users.js
//然后使用router
const users = require('./routes/api/users.js'); //注册和登录的路由，也称api接口

const infos = require('./routes/api/info') //信息接口

const navigat = require('./routes/api/navigation') //导航栏接口

const logoImg = require('./routes/api/logoImg') //logo接口

const imgconfig = require('./routes/api/shuffling') //轮播图

const news = require('./routes/api/news') //文章接口

const product = require('./routes/api/product') //动态接口

const client = require('./routes/api/client') //客户服务接口

const basisbottom = require('./routes/api/basisbottom') //底部合作配置

const btominfo = require('./routes/api/btominfo') //底部信息配置

const recruitment = require('./routes/api/recruitment') //招聘

const company = require('./routes/api/company') //公司简介

const productshow = require('./routes/api/productshow') //动态展示

const permissions = require('./routes/api/administrator') //添加管理员接口

// 连接数据库
// 引入分离的mongodb地址
const db = require('./config/keys.js')

// 引入body-parser进行post请求
// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// // 配置静态资源目录 整一个文件夹 通过域名能访问
// app.use(express.static(path.join(__dirname,"../static")))
app.use(express.static("public"));
mongoose.set('useFindAndModify', false) //findOneAndUpdate()内部会使用findAndModify驱动，驱动即将被废弃，所以弹出警告！
mongoose.connect(db.mongoURI,
    { useNewUrlParser: true } //去掉提醒
)
    .then(() => {
        console.log('Mongodb连接成功');
    })
    .catch(err => {
        console.log(err);
    })

// 初始化passport
app.use(passport.initialize());
// app.use(passport.session());
require("./config/passport")(passport); //passport更具路径传到指定的页面里

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//使用router
app.use('/api/users',users); //使用中间件，登陆和注册接口

app.use('/api/info',infos); //信息接口

app.use('/api/navigat',navigat) //导航栏接口

app.use('/api/logoimg',logoImg) //logo接口

app.use('/api/imgconfig',imgconfig) //轮播图接口

app.use('/api/news',news) //文章接口

app.use('/api/product',product) //动态接口

app.use('/api/client',client) //客户服务

app.use('/api/basisbottom',basisbottom) //底部合作配置

app.use('/api/btominfo',btominfo) //底部信息配置

app.use('/api/recruitment',recruitment) //招聘

app.use('/api/company',company) //公司简介

app.use('/api/productshow',productshow)//产品展示

app.use('/api/permissions',permissions) //添加管理员

// const port = process.env.PORT || 3030; //设置服务器端口号

// app.listen(port, () => { 
//     console.log(`服务器已启动${port}`);
// })

const httpsOption = {
    key : fs.readFileSync("./https/2625936_mangguoinfo.key"),
    cert: fs.readFileSync("./https/2625936_mangguo.pem")
}

var httpsServer = https.createServer(httpsOption,app);

//https监听3000端口
httpsServer.listen(3030);
//http监听3001端口

