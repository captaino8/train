var email = require('../config.js').email;
var nodemailer = require('nodemailer');
var fs = require('fs');
// 开启一个 SMTP 连接池
var transporter = nodemailer.createTransport({
  host: email.host, // 主机
  secureConnection: true, // use SSL
  port: 465, // SMTP 端口
  auth: {
    user: email.user, // 发件人账号
    pass: email.password // 这里密码不是邮箱密码，是你设置的smtp（代理）密码
  }
});

/**
 * 发送邮件
 * @param contents
 */
module.exports = function (htmlTxt) {
  // process.cwd() 是当前执行node命令时候的文件夹地址 ——工作目录，保证了文件在不同的目录下执行时，路径始终不变
  let imgPart1 = fs.readFileSync(process.cwd()+"/data/hjm100.png"); //图片来源[保存的截屏图片]
  transporter.sendMail({
    from: email.user, // 发件地址
    to: email.toUser, // 收件列表
    subject: '余票查询提醒', // 标题
    //text和html两者只支持一种（以最下面的那个为准）
    // text: contents || 'is test!', //邮件内容
    // html:'发件人：'+email.user+'<br>'+'邮件内容：'+contents// html 内容(可以发送图片)
    html:htmlTxt,
    // Apple Watch specific HTML body 苹果手表指定HTML格式
    // watchHtml: '<b>Hello</b> to myself',
    // An array of attachments 附件
    attachments: [
      // 携带文本
      {
        filename: '使用说明.txt',
        content: fs.readFileSync(process.cwd()+"/data/readme.txt"),
        contentType: 'text/plain' // optional,would be detected from the filename 可选的，会检测文件名
      },
      //[携带图片]
      {
        filename: 'image.png', //图片名
        content: imgPart1,     //图片地址【得到的是一个buffer】
        cid: '00000001' // 图片标识[尽可能唯一]
      }
    ]
  }, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.response);
    }

    transporter.close(); // 如果没用，关闭连接池
  });
};