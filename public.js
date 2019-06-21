// 公共方法

/**封装数据解析函数
 * data 为转化的数据为字符串
 * type 数据类型 0:title 1:query
 * 调用  parse(arr[0].title,0)
 */
let parse = (data, type) => {
    let stationMap = {};
    let stationArr = [];
    let arr, arrs;
    //处理车次
    if (type === 1) arrs = data.replace(/列车停运|列车运行图调整,暂停发售|预订/g, '分割').split("\t分割\n"); //第一层拆分[拆分车次信息]
    //处理title换行:
    else arrs = data.replace(/出发站\n到达站/g, '出发站\t到达站').replace(/历时/g, '历时\t到站').replace(/\n/g, '/').split();
    //遍历数据对象
    arrs.forEach(function (d, i) {
        if (d !== '') arr = d.replace(/\n+|\t+/g, '|').split("|");
        else return false;
        stationMap = {
            train_number: arr[0],
            from_station_name: arr[1],
            end_station_name: arr[2],
            time: arr[3],
            lishi: arr[4],
            daozhan: arr[5],
            shang_wu: arr[6],
            yi_deng: arr[7],
            er_deng: arr[8],
            gao_ji: arr[9],
            ruan_wo: arr[10],
            dong_wo: arr[11],
            ying_wo: arr[12],
            ruan_zuo: arr[13],
            ying_zuo: arr[14],
            wu_zuo: arr[15],
            qi_ta: arr[16]
        }
        stationArr.push(stationMap)
    })
    return stationArr
}

/**向字符串特定位置添加字符串
 * str1  原字符串变量
 * n     要插入的位置
 * str2  要插入的字符串
 * 调用 console.log(insertStr(url,4,'s')) //https://hjm100.cn
 */
let insertStr = (str1, n, str2) => {
    if (str1.length < n) return str1 + str2;
    else {
        let s1 = str1.substring(0, n);
        let s2 = str1.substring(n, str1.length);
        return s1 + str2 + s2;
    }
}

/**判断某个值是否在数组中
 * arr   数组
 * str  字符串
 * 调用 console.log(exist(['1461','T109'],'T109')) //background:rgb(204,153,204)
 */
// let exist = (arr,str) => {
//     let condition = arr.indexOf(str);
//     if(condition === -1) return 'background:rgb(231, 131, 16)';
//     else return 'background:rgb(204,153,204)' //理想数据
//  }
let exist = (arr,str) => {
    let condition = arr.indexOf(str);
    if(condition === -1) return false;
    else return true //理想数据
 }

module.exports = {
    parse,
    insertStr,
    exist
};