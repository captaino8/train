const request = require('superagent');
const sendEmail = require('./sendEmail');
const puppeteer = require('puppeteer');
const fs = require('fs');

const trains = require('../config.js').trains;
const parse = require('../public.js').parse;
const insertStr = require('../public.js').insertStr;
const exist = require('../public.js').exist;

/**
 *爬取12306的车次信息
 */
//爬取全国车站信息并生成JSON文件(便于生成余票使用)
let stationJson = () => {
    console.log('======', '爬取全国车站信息运行中', '======')
    request
        .get('https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.9035')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
        .end(function (err, request) {
            // try-catch 处理出错，如果try中有错误就执行catch中的内容，如果没有就一直执行try中的内容
            try {
                var re = /\|[\u4e00-\u9fa5]+\|[A-Z]{3}\|\w+\|\w+\|\w+@\w+/g;
                var stationMap = {};
                var stationArray = [];
                var temp = request.text.match(re);
                [].forEach.call(temp, function (item, i) {
                    var t = item.split("|");
                    stationArray.push(t[3]);
                    stationMap[t[3]] = {
                        name: t[1],
                        code: t[2],
                        pinyin: t[3],
                        suoxie: t[4],
                        other: t[5]
                    }
                });
                //将信息保存下来
                fs.writeFile('./data/station.json', JSON.stringify({
                    stationInfo: stationMap
                }));
            } catch (err) {
                console.log(err);
                return null;
            }
        })
}
//查询余票
let queryTickets = () => {
    //获取config.js中的设置信息
    // 模拟定时任务
    console.log('我是' + new Date() + '调用的')
    //将github的首页通过截屏保存到文件中
    // async 函数返回一个 Promise,当你需要像同步函数那样调用时，需要使用 await。
    // { headless: false }开启窗口模式，默认为不开启窗口
    async function run() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //在下次保存截屏之前可以先清空一下这个图片防止同名之间的错误
        await fs.unlink('./data/hjm100.png', function (err) {
            console.log('-----删除图片成功-----')
        })
        //乘车时间：trains.train_date
        //出发地车站代码:trains.from_station
        //出发地车站代码:trains.end_station
        //出发地车站:trains.from_station_name
        //目的地车站:trains.end_station_name 
        //查询上海到北京2018年1月03日的查票
        //接口链接：https://kyfw.12306.cn/otn/leftTicket/init?_json_att=&leftTicketDTO.from_station_name=上海&leftTicketDTO.to_station_name=北京&leftTicketDTO.from_station=SHH&leftTicketDTO.to_station=BJP&leftTicketDTO.train_date=2018-01-03&back_train_date=2018-01-03&flag=dc&purpose_code=ADULT&pre_step_flag=index
        //接口链接参数配置https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2019-06-21&leftTicketDTO.from_station=XFN&leftTicketDTO.to_station=CSQ&purpose_codes=ADULT
        // let url = 'https://kyfw.12306.cn/otn/leftTicket/query?' +
        //     '&leftTicketDTO.train_date=' + trains.train_date +
        //     '&leftTicketDTO.from_station=' + trains.from_station +
        //     '&leftTicketDTO.to_station=' + trains.end_station +
        //     '&purpose_codes=' + trains.purpose_codes;
        let url = 'https://kyfw.12306.cn/otn/leftTicket/init?_json_att=' +
            '&leftTicketDTO.from_station_name=' + trains.from_station_name +
            '&leftTicketDTO.to_station_name=' + trains.end_station_name +
            '&leftTicketDTO.from_station=' + trains.from_station +
            '&leftTicketDTO.to_station=' + trains.end_station +
            '&leftTicketDTO.train_date=' + trains.train_date +
            '&back_train_date=2018-01-03&flag=dc&purpose_code=ADULT&pre_step_flag=index';
        console.log(url)
        await page.goto(url);
        // await page.goto('http://hjm100.gitee.io/me/'); //测试链接[以防频繁请求ip被封]
        //保存截图以备数据出错
        await page.screenshot({
            path: './data/hjm100.png'
        });
        //爬取页面数据t-list
        const T_list = '#t-list';
        const THEAD = 'thead'
        const QUERY_LEFT_TABLE = '#queryLeftTable';
        const datas = await page.evaluate((sInfo, sThead, sTable) => {
            return Array.prototype.slice.apply(document.querySelectorAll(sInfo))
                .map($queryLeftTable => {
                    //表头
                    const title = $queryLeftTable.querySelector(sThead).innerText;
                    // 余票查询
                    const query = $queryLeftTable.querySelector(sTable).innerText;
                    return {
                        title,
                        query,
                    };
                })
        }, T_list, THEAD, QUERY_LEFT_TABLE);

        //关闭连接
        browser.close();
        //解析表头数据

        // 数据便利
        let title = parse(datas[0].title, 0);
        let query = parse(datas[0].query, 1);
        //遍历数据
        var titlehtml = '',
            queryhtml = '',
            trainshtml = '';
        //设置表格说明
        trainshtml =
            `<p style="font-family:'微软雅黑',Helvetica,Arial,sans-serif;font-size:14px;text-align: center;">
        ${trains.train_date} ${trains.from_station_name}--${trains.end_station_name} 火车余票提醒</p>`
        //设置表头
        titlehtml =
            ` <tr>
            <td> ${title[0].train_number}</td>
            <td> ${title[0].time}</td>
            <td> ${title[0].lishi}</td>
            <td> ${title[0].ying_wo}</td>
            <td> ${title[0].ying_zuo}</td>
            <td> ${title[0].wu_zuo}</td>
        </tr>`
        //筛选有用车次
        for (let i = 0; i < query.length; i++) {
            //判断车次是否有用
            // if (query[i].ying_wo !== '无' && query[i].ying_wo !== '--' || query[i].ying_zuo !== '无' && query[i].ying_zuo !==
            //     '--'||query[i].wu_zuo !== '无' && query[i].wu_zuo !== '--') {
            //     queryhtml +=
            //         `<tr style="${exist(trains.train_num,query[i].train_number)}">
            //     <td style="color:#f00"> ${query[i].train_number}</td>
            //     <td style="color:#00f"> ${insertStr(query[i].time,5,' - ')}</td>
            //     <td style="color:#00f"> ${query[i].lishi}</td>
            //     <td style="color:#0f0"> ${query[i].ying_wo}</td>
            //     <td style="color:#0f0"> ${query[i].ying_zuo}</td>
            //     <td style="color:#0f0"> ${query[i].wu_zuo}</td>
            // </tr>`
            // }
            if (query[i].train_number === 'K535' && query[i].ying_wo !== '候补' && query[i].ying_wo !== '无' && query[i].ying_wo !== '--') {
                queryhtml +=
                    `<tr style="${exist(trains.train_num,query[i].train_number)}">
                <td style="color:#f00"> ${query[i].train_number}</td>
                <td style="color:#00f"> ${insertStr(query[i].time,5,' - ')}</td>
                <td style="color:#00f"> ${query[i].lishi}</td>
                <td style="color:#0f0"> ${query[i].ying_wo}</td>
                <td style="color:#0f0"> ${query[i].ying_zuo}</td>
                <td style="color:#0f0"> ${query[i].wu_zuo}</td>
                </tr>`
            }
        }
        //检测数据发邮件
        if (queryhtml) {
            let html =
                `${trainshtml}
            <table border="0" style="font-family:'微软雅黑',Helvetica,Arial,sans-serif;font-size:14px;text-align: center;" width="100%">
                <tbody style="background:#ccc;">
                    ${titlehtml}
                </tbody>
                <tbody>
                    ${queryhtml}
                </tbody>
            </table>
            <img src="cid:00000001" id="00000001">`
            //爬取数据后发送邮件
            sendEmail(html)
        } else {
            console.log('已经没票了，再等等吧！！！')

        }
    }
    run();
}

module.exports = {
    stationJson,
    queryTickets
};