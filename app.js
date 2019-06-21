const trains = require('./config').trains,
    task = require('./controller/task'),
    //爬取全国车站信息
    stationJson = require('./controller/taskList').stationJson,
    //查询余票
    queryTickets = require('./controller/taskList').queryTickets;
const schedule = require('node-schedule');
// 定时执行（当天指定时间触发任务）
//12306每天7点更新数据我们避开这个高峰期延迟30秒后请求一下数据
// stationJson() //启动项目的时候拿一次即可[车站参考]
queryTickets() //调试使用
task({
    h: [06],
    m: [00],
    s: [00]
}, function () {
    // node定时器：每个一个小时执行一次任务 参考地址：http://nodejs.cn/api/timers.html
    // node定时器与js定时器类似【模拟可以自定时间但是时间间隔不要太短，以免出现问题】
    queryTickets()
    let time = setInterval(function () {
        queryTickets()
    }, 1000 * 5)

});

// let time = setInterval(function () {
//         queryTickets()
//     }, 2000 * 60)

// const  scheduleCronstyle = ()=>{
//     //每分钟的第30秒定时执行一次:
//     queryTickets()
//     schedule.scheduleJob('*/5 * 7-23 * * *',()=>{
//         queryTickets()
//         console.log('scheduleCronstyle:' + new Date());
//     });  
// }
    
// scheduleCronstyle();
console.log('======', '自动查票服务运行中', '======');