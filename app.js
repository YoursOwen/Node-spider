const https = require('https');
//这是一个将字符串转换为可用jquery方式操作的插件
const cheerio = require('cheerio')
//下载文件插件
const fs = require('fs');
const download = require('download');

let page = 1;
let maxPage = 50;

function getPhotos() {
  const options = {
    hostname: 'www.haha.mx',
    port: 443,
    path: '/good/day/'+page,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    // console.log('状态码：', res.statusCode);
    // console.log('请求头：', res.headers);

    let results = "";
    res.on('data', (d) => {
      // 字符串 “+” 其他数据类型，会隐式转换
      results += d;

    });

    //如果我们使用http.request方法时没有调用end方法，服务器将不会收到信息
    res.on('end',()=>{
      console.log("正在获取第"+page+"页")


      const $ = cheerio.load(results);

      let imgs = [];
      $('.joke-list-item .joke-main-content img').each((index,value) => {
        //修改爬到的数据
        imgs.push('https:'+$(value).attr("data-original").replace('normal','middle'))
      })
     //download下载处理后链接
     Promise.all(imgs.map(x => download(x, 'dist'))).then(() => {
      console.log('files downloaded!');
      if(page < maxPage) {
        page++;
        getPhotos();
      }
  });
    })
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}
getPhotos();