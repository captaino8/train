module.exports = {
	// 查询车次的信息
	"trains": {        
    train_date:'2019-06-21',        // 单程票出发时间
    back_train_date: '2017-01-24',  // 单程票返还时间
    from_station:'XFN',             // 出发地车站代码
		end_station:'CSQ',              // 目的地车站代码
		from_station_name:'襄阳',       // 出发地车站
		end_station_name:'长沙',        // 目的地车站
    train_num:['K535'],      // 车次 [] 粉红色为理想车次
    purpose_codes:'ADULT'           //用途：ADULT：普通，0X00：学生
    // 时间段 （发车时间，到达时间）【后期补上】
    },
	// 邮件账户
	"email": {
		"host": 'smtp.163.com',         //发件服务器
		"user": 'ibertliu@163.com',    //发件邮箱【如果不想自己开启pop3可以直接使用我注册的】
		"password": 'qaz4415',  //发件邮箱密码(授权码:开通pop3)
		"toUser": '809143962@qq.com,liutian@kdanmobile.com' //收件服务器
		// "toUser": 'amj100@126.com,hjm100@126.com,ahj100@126.com' //多的收件服务器
	}
};