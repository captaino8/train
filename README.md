
# 基于node的12306预查票系统(12306 precheck system)

## 使用场景
1. 爬取12306制定城市到制定城市的车次信息
2. 邮件通知，提醒你有余票
3. 定时任务（每一个小时程序自动查一次）

## 版本信息
### v1.0.0（针对单程票） 【已完成】
0. |_ 爬取全国车站信息并生成JSON文件（方便以后使用） 【已完成】
0. |_ 查询指定日期余票（硬座，硬卧，无座）信息       【已完成】
0. |_ 查询满足后发发送邮件通知                     【已完成】
0. |_ 每天上午7:00:30与每隔1个小时后自动请求一次数据 【已完成】
0. |_ 添加理想车次筛选[表格背景色为粉红色]  【已完成】

### v1.0.1（待定...）
1. |_ 添加前端页面用于储存用户信息
1. |_ 满足查询机制以及多用户使用
1. |_ 优化数据可配置


## 准备工作

1. superagent，   客户端请求代理模块  参考地址：http://cnodejs.org/topic/5378720ed6e2d16149fa16bd
2. nodemailer，   发送邮件           参考地址：http://blog.fens.me/nodejs-email-nodemailer/
3. later，        定时执行任务        参考地址：http://blog.fens.me/nodejs-cron-later/
4. cheerio，      抓取网页数据        参考地址：http://cnodejs.org/topic/5203a71844e76d216a727d2e
5. fs，           储存文件系统        参考地址：http://nodejs.cn/api/fs.html
6. puppeteer      高级爬虫           参考地址：https://csbun.github.io/blog/2017/09/puppeteer/
7. *async|await， 排队完成任务（可选，某些任务有先后顺序）
8. Supervisor，   使用Node Supervisor实现监测文件修改并自动重启应用  [注意：必须要全局安装才可以]

## 目录规划

```
.
|—— app.js               // 程序入口
|—— config.js            // 账号配置信息等
|—— .gitignore           // 限制git上传文件
|—— data                 // 数据存放点
|   |—— hjm100.png       // 截屏测试     [程序生成不需要提交]
|   |—— station.json     // 全国车站信息 [程序生成不需要提交]
|   |—— readme.txt       // 使用说明
|—— controller           // 控制器
|   |—— taskList.js      // 任务清单
|   |—— sendEmail.js     // 发送邮件
|   |—— task.js          // 定时任务
|—— public.js            // 公共方法
|—— package.json         // 本地npm管理文件  
|—— README.md            // 项目说明
.

2 directories, 12 files
```
## 项目运行

1. 在终端打开项目：执行一下命令 
1. npm install
1. node app
1. 注：如果npm安装缓慢或者安装出错请使用 cnpm
1. 如何使用cnpm： 
1. 全局安装淘宝镜像
1. $ npm install -g cnpm --registry=https://registry.npm.taobao.org
1. 使用cnpm 安装模块即可

## 项目解构

### 配置账号信息（config.js控制文件）

1. 将项目中用到的变量通过配置进行（达到随时可以修改的目的）
2. 配置文件分块：（详细请查看config.js文件）
3. |_ trains 火车配置信息
4. |_ email  用户邮箱信息

### 发送邮件（controller/sendEmail.js）

1. 发送邮件使用的是nodemailer模块
2. 使用方法在项目中都有相关注释
3. 使用地点（查询到有车票的时候给你发送邮件）

### 任务清单（controller/taskList.js）
1. stationJson  爬取全国车站信息并生成JSON文件(便于生成余票使用)
2. queryTickets 查询余票
3. 由于12306接口有所改整（接口采用加密方式）所以改用puppeteer高级爬虫
4. puppeteer针对动态更新资源爬取并可以生成屏幕快照

### 定时任务（task.js）
1. 定时任务使用later模块
2. 开启服务后每隔一个小时候请求一下车次数据
3. 注意：不可请求过度频繁（可能会封ip奥）

### 入口文件（app.js） 
1. 将项目串起来（开启奇妙之旅吧）

## 附录：

1. 全国车站信息接口：https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.9035
2. 车次查询接口：https://kyfw.12306.cn/otn/leftTicket/init?_json_att=&leftTicketDTO.from_station_name=上海&leftTicketDTO.to_station_name=北京&leftTicketDTO.from_station=SHH&leftTicketDTO.to_station=BJP&leftTicketDTO.train_date=2017-12-29&back_train_date=2017-12-27&flag=dc&purpose_code=ADULT&pre_step_flag=index
2. 车次查询需要有

