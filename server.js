"http://kxtny8.natappfree.cc"
"http://157.245.87.120:8088"
	
const test_url = "http://112.74.102.80:8088"
const $ = (item) => document.getElementById(item);

window.onload = function() {
		href(window.location.hash||"#fans"); // 页面加载时的hash判断 默认显示 task
    	checkout(localStorage.token)
    }

//从外部传入token
function checkout(token) {
	// let token = localStorage.token;
	if (!token) {
		layer.open({
		  type: 0,
		  closeBtn: 2,
		  btn: ['你好'],
		  title: '请先登录',
		  content: '<div><input type="password" name="title" id="get-password" placeholder="请输入密码" autocomplete="off" class="layui-input"> </div> ', //这里content是一个普通的String
		   yes: function(index, layero){
		   	fetch(`${test_url}/token/get`, {
		   		headers: {"access-token": $('get-password').value}
		   	}).then(res => res.json())
		   	.then(res => {
		   		if (res.code == 200) {
		   			layer.msg("登录成功")
		   			localStorage.setItem('token', res.data)
		   			setTimeout(() => window.location.reload(), 1000)
		   		} else {
		   			layer.msg("登录出错，请重试");
		   			setTimeout(() => window.location.reload(), 1000)
		   		}
		   	}).catch(err => {
		   		layer.msg("请求超时");
		   		// setTimeout(() => window.location.reload(), 1000)
		   	})
		  }
		});
	}
}

testForm = (arr, content) => {
	for (var i = 1; i <= arr.length; i++) {
		if(content.search(arr[i]) > -1) {
			return arr[i];
		}
	}
}

function taskTable() {
	var table = layui.table;
	var tasktable = table.render({
	 		elem: '#task-table', //指定原始表格元素选择器（推荐id选择器）
	 		height: 800,  //容器高度
	 		toolbar: '#toolbarDemo',
	 		url: `${test_url}/task/get`,
	 		method: "get",
	 		headers: { "access-token": localStorage.getItem('token')||""},
	 		parseData: function(res){ //res 即为原始返回的数据
	 			for (var i = 0; i < res.data.length; i++) {
	 				res.data[i].index = i+1;
	 			}
		    	return {
		    	  "code": res.code==200?0:res.status, //解析接口状态
		    	  "msg": res.message, //解析提示文本
		    	  "count": res.data.length, //解析数据长度
		    	  "data": res.data //解析数据列表
		    	};
			},
	 		cols: [[
	 			{type: 'checkbox', fixed: 'left'},
	 			{field: 'index', title: '序号', width: 60, fixed: "left"},
	 			{field: 'douyinId', title: '抖音ID', minWidth: 150},
	 		]]
	});
	var checkStatus = table.checkStatus('task-table');	
	table.on('toolbar(task-table)', function(obj){
	  var checkStatus = table.checkStatus(obj.config.id);
	  switch(obj.event){
	    case 'add':
	      layer.prompt({
			  formType: 2,
			  value: '',
			  title: '请输入对应id 自动识别分隔符',
			  area: ['800px', '100px'] //自定义文本域宽高
			}, function(value, index, elem){
			  if(value) {
			  	let arr = ["auto", " ", ",", "\n"];
				// let act = arr[$("inForm").value-1];
				let content = value;
				let result = content.split(testForm(arr, content))
			  	fetch(`${base_url}/task/add`, {
			  		method: 'post',
			  		headers: 
			  		{ "access-token": "1",
	    	  		"Content-Type": "application/json;charset=utf-8"
	    	  		},
	    	  	body: JSON.stringify(result)
			  	}).then(res => res.json())
			  	.then(res => {
			  		if (res.code == 200) {
			  			layer.msg(res.message)
			  		}
			  		table.reload('task-table');
			  	}).catch(err => console.log(err))
			  }
			  layer.close(index);
			});break;
	    case 'del':
	  		let del_list = [];
	  		console.log(checkStatus)
	  		checkStatus.data.forEach((item, index) => {
	  			// del_list += ("\""+item.douyinId+"\"")
	  			// if (index!=checkStatus.data.length-1) {
	  			// 	del_list += ","
	  			// }
	  			del_list.push(item.douyinId)
	  		}) //获取选中行的数据
	  		
	    	layer.confirm('是否确认删除所选行', function(index){
	    	  fetch(`${base_url}/task/delete`, {
	    	  	method: 'post',
	    	  	headers: 
	    	  	{ "access-token": "1",
	    	  		"Content-Type": "application/json;charset=utf-8"
	    	  	},
	    	  	body: JSON.stringify(del_list)
	    	  }).then(res => res.json())
				  	.then(res => {
				  		if (res.code == 200) {
				  			layer.msg(res.message)
				  		}
				  		table.reload('task-table');
				  	}).catch(err => console.log(err))
	    	  layer.close(index);
	    	  //向服务端发送删除指令
	    	});break;
	  };
		});
	}

function settingFans() {
				let getfollower = $('settingFans').value;

				if (getfollower>0 && getfollower<60 && getfollower%1===0) {
					fetch(`${test_url}/task/changeTime`, {
						method: 'post',
						headers: {"access-token": localStorage.token, "Content-Type": "application/json"},
						body: JSON.stringify({task: "getFollower", time: getfollower})
					}).then(res => res.json())
					.then(res => {
						layer.msg(res.message)
					})
				} else {
					layer.msg("请输入1-59以内的整数")
				}
				$('settingFans').value = "";
			}

			function settingIncrease() {
				let settingIncrease = $('settingIncrease').value;
				if (settingIncrease>0 && settingIncrease<60 && settingIncrease%1===0) {
					fetch(`${test_url}/task/changeTime`, {
						method: 'post',
						headers: {"access-token": localStorage.token, "Content-Type": "application/json"},
						body: JSON.stringify({task: "removeGrow", time: settingIncrease})
					}).then(res => res.json())
					.then(res => {
						layer.msg(res.message)
					})
				} else {
					layer.msg("请输入1-59以内的整数")
				}
				$('settingIncrease').value = '';
			}

   // 自定义后台参数
function setting() {
   	layer.open({
   		type: 1,
   		title: "设置参数",
   		area: '600px',
   		content: `<div class="layui-form-item" style="padding: 15px 15px 0">
    		<label class="layui-form-label">粉丝刷新</label>
    		<div class="layui-input-block">
    		  <input type="text" name="title" id="settingFans" placeholder="请输入设置的分钟数" autocomplete="off" class="layui-input">  
    		  <button style="margin: 10px 0 10px 0;" onclick="settingFans()" class="layui-btn layui-btn-sm">设置</button>
    		</div>
    		<label class="layui-form-label">清空增长</label>
    		<div class="layui-input-block">
    		  <input type="text" name="title" id="settingIncrease" placeholder="请输入设置的分钟数" autocomplete="off" class="layui-input">  
    		  <button style="margin: 10px 0 10px 0;" onclick="settingIncrease()" class="layui-btn layui-btn-sm">设置</button>
    		</div>
		</div>`
   	})
}
   // 下载文件方法
var funDownload = function (content, filename) {
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content], {type: "text/plain;charset=GB2312"});
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};
var douyinid_list = [];
if ('download' in document.createElement('a')) {
    // 作为test.html文件下载
    let value = "";
    eleButton.addEventListener('click', function () {
    	if (douyinid_list != []) {
    		for (var i = 0; i < douyinid_list.length; i++) {
    			value += `${douyinid_list[i]}\r\n\n`;
    		}
    	}
        funDownload(value, 'share.txt');    
    });
} else {
    eleButton.onclick = function () {
        alert('浏览器不支持');    
    };
}

// 清空近期增长数
function clearNum() {
	fetch(`${base_url}/grow/remove`, {
		headers: { "access-token": `1`}
	}).then(res => res.json())
	.then(res => {
		layer.msg(res.message)
	}).catch(err => console.log(err))
}

// 获取user-tabe数据以及自动刷新
  
auto_fresh = null;

    		function fansTable() {
				var count = 1; // 刷新次数
    			var form = layui.form;
				form.on('switch(auto)', function(data){
					if(data.elem.checked) {
						table.reload('user-table')
					} else {
						clearTimeout(auto_fresh)
					}
				});  
    			var table = layui.table;
				table.render({
				  	elem: '#user-table', //指定原始表格元素选择器（推荐id选择器）
				  	height: 800,  //容器高度
				  	// url: "${base_url}/user/get",
				  	url: `${test_url}/user/get`,
				  	method: "post",
				  	// toolbar: '#toolbar-user',
				  	headers: { "access-token": localStorage.getItem('token')},
				  	parseData: function(res){ //res 即为原始返回的数据
				  		for (var i = 0; i < res.data.length; i++) {
				  			// res.data[i].share_url = "https://www.iesdouyin.com/share/user/"+res.datai].uid;
				  			res.data[i].updateTime = 
				  						new Date(res.data[i].updateTime).toLocaleDateString()
				  						.replace(/\//g, "-") + " "+
				  						new Date(res.data[i].updateTime).toTimeString().substr(0, 8);
				  			res.data[i].index = i+1;

				  			douyinid_list[i] = res.data[i].douyinId; // 读取douyinId到单独的数组
				  			
				  		}
					    return {
					      "code": res.code==200?0:res.code, //解析接口状态
					      "msg": res.message, //解析提示文本
					      "count": res.data.length, //解析数据长度
					      "data": res.data //解析数据列表
					    };
					},
				  	cols: [[
				  		{type: 'checkbox', fixed: 'left'},
				  		{field: 'index', title: '序号', width: 60},
				  		{field: 'douyinId', title: '抖音ID', minWidth: 350},
				  		{field: 'followerCount', title: '当前粉丝', width: 100},
				  		{field: 'followerCountLast', title: '上一次粉丝', width: 100},
				  		{field: 'growCount', title: '粉丝变化', width: 120, sort: true},
				  		{field: 'uid', title: '近期增长总和', width: 130, sort: true},
				  		{field: 'updateTime', title: '更新时间', width: 150},
				  		// {field: 'share_url', title: '分享链接', minWidth: 350}
				  	]],
				  	done: function(res, curr, count){
	 					auto_fresh = setTimeout(() => table.reload('user-table'), 10000)
					}
				  	//,…… //更多参数参考右侧目录：基本参数选项
				});
				table.on('toolbar(user-table)', function(obj){
				  var checkStatus = table.checkStatus(obj.config.id);
				});
    		}
    		function hrefSwitch(hash) {
        		let nodes = $("body").childNodes
        		for (var i = nodes.length - 1; i >= 0; i--) {
        			if (nodes[i].id != hash && nodes[i].nodeType == 1) {
        				nodes[i].style.display = "none"
        			}
        		}
        		$(hash).style.display = "block";
        	}
        	function href(hash) {
        		window.location.hash = hash;
        		switch(hash) {
        			case "#fans": {hrefSwitch("fans");fansTable()};break;
        			case "#task": {hrefSwitch("task");taskTable()};break;
        			default: hrefSwitch("task")
        		}
        	}