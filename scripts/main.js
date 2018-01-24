'use strict';

var config = {
	station_id: 2,
	pid: 1,
	cin: 'http://127.0.0.1:8110/cin',
	cout: 'http://127.0.0.1:8110/cout',
	outToken: 'https://www.parkingpay.net/api_v2.php',
	total: 'https://www.parkingpay.net/api/charge_amount.php',
	open_in: 'http://127.0.0.1:8110/open_in',
	bupai: 'http://127.0.0.1:8110/recap',
	open_out: 'http://127.0.0.1:8110/open_out',
	submitEnter: 'https://www.parkingpay.net/api_v2.php',
	login: 'https://www.parkingpay.net/api/login.php'
};

var vm = new Vue({
	el: '#app',
	data: function data() {
		return {
			visible: false,
			form: {
				name: '',
				password: ''
			},
			rules: {
				name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
			},
			charge_detail: false,
			car_in: {
				picture: '',
				time: '',
				carNum: '',
				type: ''
			},
			alreadyEntered: [],
			carInStorage: [],
			total: {
				total_amount: '0.00',
				online: '0.00',
				offline: '0.00'
			},
			carInConfirmBtnDisabled: true,
			switch_car: true,
			carShouldEnter: false,
			car_out: [
				// {
				// 	isConfirm: true,
				// 	special: false,
				// 	money: '0.00',
				// 	carNum: '------',
				// 	intime: '--:--:--',
				// 	outtime: '--:--:--',
				// }
			],
			carSelectPanel: false,
			username: '',
			loginTime: '',


			carInSubmitLoading: false
		};
	},

	computed: {},

	watch: {
		'car_in.carNum': function(oldValue, newValue){
			if(oldValue !== newValue){
				this.car_in.carInConfirmBtnDisabled = false
			} else {
				this.car_in.carInConfirmBtnDisabled = true
			}
		}
	},

	mounted: function mounted() {
		var that = this;
		this.$jquery = jQuery.noConflict();
		this.initLayUi();
		this.getLoopPlateIn();
		this.getLoopPlateOut();
		this.getTotal();
		this.$jquery.ajaxSetup({
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			timeout: 15000,
			error: function(xhr, status){
				console.log('errror ' + xhr + ' code ' +status)
			}
		});

		layui.use(['layer'], function () {
			that.$layer = layui.layer;
		});
	},

	methods: {
		submitForm: function submitForm(formName) {
			var _this = this;

			this.$refs[formName].validate(function (valid) {
				if (valid) {
					_this.tollCollectorLogin();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		// 换班
		changeShift: function changeShift() {
			this.visible = true;
		},

		outCarComfirmed: function outCarComfirmed(car) {
			console.log(car);
		},

		//收费员登录
		tollCollectorLogin: function tollCollectorLogin() {
			const _this2 = this;
			const that = this;

			this.$jquery.post(config.login, {
				username: that.form.name,
				password: that.form.password,
				station_id: config.station_id,
				pid: config.pid
			}, function (res) {
				if (res.error_code == 0) {
					_this2.$message({
						type: 'success',
						message: '登录成功'
					});
					_this2.visible = false;
					_this2.username = res.data.username;
					_this2.loginTime = new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss');
					_this2.cid = res.data.cid;
					_this2.getTotal();
				} else {
					_this2.$message({
						type: 'error',
						message: res.msg
					});
				}
			}, 'json');
		},

		ExpandDetail: function ExpandDetail() {
			this.charge_detail = !this.charge_detail;
		},
		switch_car: function switch_car() {},

		initLayUi: function initLayUi() {
			setTimeout(function () {
				//我们强烈推荐你在代码最外层把需要用到的模块先加载
				layui.use(['layer', 'laydate', 'form', 'element'], function () {
					var layer = layui.layer,
					    form = layui.form,
					    element = layui.element,
					    laydate = layui.laydate,
					    type = 'datetime';

					//执行一个laydate实例
					laydate.render({
						elem: '#time-edit', //指定元素
						type: type
					});
					form.render('select');
				});
			}, 100);
		},
		getLoopPlateIn: function getLoopPlateIn() {
			var _this3 = this;

			axios.get(config.cin + '?station_id=' + config.station_id).then(function (res) {
				if (res.data != '') {
					if(res.data.carNum !== '无牌车'){
						_this3.handlePlateInData(res.data);
					}
				} else {}
				setTimeout(function () {
					_this3.getLoopPlateIn();
				}, 500);
			});
		},

		//处理获得的入场数据
		handlePlateInData: function handlePlateInData(data) {
			const _data = {};

			_data.carNum = data.carNum.split('');
			_data.picture = 'data:image/jpeg;base64,' + data.picture.replace(/ /g,"+");
			_data.closeup_pic = 'data:image/jpeg;base64,' + data.closeup_pic.replace(/ /g,"+");
			_data.time = new Date(data.intime * 1000).Format('yyyy-MM-dd hh:mm:ss');
			_data.color = data.color;

			// 判断入场车牌号是否重复
			if( new Date(_data.time).getTime() - new Date(this.car_in.time).getTime() < 60000
						&& this.car_in.carNum
						&& _data.carNum.join('') == this.car_in.carNum.join('')) return;

			this.carInStorage.push(_data);
			this.checkStorage();
		},

		checkStorage: function checkStorage() {
			if (this.carInStorage.length > 0 && this.carInConfirmBtnDisabled) {
				this.car_in = this.carInStorage[0];
				this.carInConfirmBtnDisabled = false;
			}
		},

		//入场确认
		carConfirmEnter: function carConfirmEnter() {

			var car = this.car_in;
			var that = this;
			this.carInSubmitLoading = true;
			this.$jquery.post(config.submitEnter + '?action=user_in&pid=' + config.pid + '&station_id=' + config.station_id, {
				content: JSON.stringify({
					'carNum': car.carNum.join(''),
					'intime': new Date(car.time).getTime() / 1000,
					'color': car.color
				})
			}, function (res) {
				that.carInSubmitLoading = false;
				if (res.error_code == '0') {
					that.addedEnterList();
					that.carInStorage.shift();
					that.openInGate();
					that.$layer.msg(res.error_msg);
					that.carInConfirmBtnDisabled = true;
					that.checkStorage();
				} else {
					that.carInConfirmBtnDisabled = false;
					that.carConfirmEnter();
					console.log('提交失败， 再次提交中');
				}
			}, 'json');
		},


		// 添加至进场确认列表
		addedEnterList: function addedEnterList() {

			if(this.alreadyEntered.length == 0){
				this.alreadyEntered.push({
					num: this.car_in.carNum.join(''),
					time: this.car_in.time
				});
			} else {
				this.alreadyEntered.unshift({
					num: this.car_in.carNum.join(''),
					time: this.car_in.time
				});
			}

		},


		getLoopPlateOut: function getLoopPlateOut() {
			var that = this;
			axios.get(config.cout + '?station_id=' + config.station_id).then(function (res) {

				if (res.data != '') {
					var response = res.data;
					var _car_out = {};

					_car_out.carNum = response.carNum.split('');
					_car_out.picture = 'data:image/jpeg;base64,' + response.picture.replace(/ /g, '+');
					_car_out.closeup_pic = 'data:image/jpeg;base64,' + response.closeup_pic.replace(/ /g, '+');

					console.log('最新出场纪录', response)

					if(response.intime == ''){
						_car_out.disabled = true;
					} else {
						_car_out.disabled = false;
					}
					_car_out.intime = response.intime == '' ? '' : new Date(response.intime * 1000).Format('yyyy-MM-dd hh:mm:ss');
					_car_out.outtime = new Date(response.outtime * 1000).Format('yyyy-MM-dd hh:mm:ss');
					_car_out.special = false;
					_car_out.isConfirm = false;
					_car_out.color = response.color;
					_car_out.carItemOutLoading = false;

					// 判断出场车牌号是否重复
					if(that.car_out.length && new Date(response.outtime * 1000).getTime() - new Date(that.car_out[0].outtime).getTime() < 60000){

						setTimeout(function () {
							that.getLoopPlateOut();
						}, 500);
						return
					}
					if(that.car_out.length && that.car_out[0].carNum && _car_out.carNum.join('') == that.car_out[0].carNum){
						_car_out = {};
						setTimeout(function () {
							that.getLoopPlateOut();
						}, 500);
						return;
					}
					console.log(_car_out)
					that.$nextTick(function () {
						that.car_out.unshift(_car_out);
					});

					setTimeout( () => {
						that.getOutToken(_car_out);
					}, 200) 
				}

				setTimeout(function () {
					that.getLoopPlateOut();
				}, 500);
			});
		},

		getOutToken: function getOutToken(data) {
			var _this4 = this;
			var that = this;

			this.car_out[0].carItemOutLoading = true;
			this.$jquery.post(config.outToken + '?action=user_out&pid=' + config.pid + '&station_id=' + config.station_id, {
				content: JSON.stringify({
					'carNum': data.carNum.join(''),
					'intime': data.intime || '',
					'outtime': new Date(data.outtime).getTime()/1000,
					'color': data.color
				})
			}, function (res) {
				that.car_out[0].carItemOutLoading = false;
				data.open = res.open;
				data.payway = res.payway;
				data.money = res.money;
				data.tip = res.tip;
				if(res.intime != ''){
					that.car_out[0].disabled = false
				}
				data.intime = res.intime
				// open 1:可以起杆 0：不起杆

				if (res.open == 1) {
					data.disabled = true;
					that.openOutGate();
				} else {}

				// 使用Vue提供的$set方法更新数组

				that.$set(that.car_out[0], data);

				_this4.$nextTick(function () {

					layui.use(['layer', 'laydate', 'form', 'element'], function () {
						var form = layui.form,
						    laydate = layui.laydate,
						    type = 'datetime';
						var ins1 = laydate.render({
							elem: '#time-edit', //指定元素
							type: type,
							change: function change(value) {
								console.log('layer change', value)
								that.updateIntime(value);
							},
							done: function done(value) {
								console.log('layer done', value)
								that.updateIntime(value);
							}
						});
						form.render('select', 'aihao');
					});
				});
			}, 'json');
		},
		updateIntime: function updateIntime(intime) {
      // 补入入场时间
			this.car_out[0].intime = new Date(intime).getTime() / 1000;
			this.getOutToken(this.car_out[0])

			const data = this.car_out[0];
			data.intime = intime;
			this.$set(this.car_out[0], data);
		},
		getTotal: function getTotal() {
			var that = this;
			this.$jquery.post(config.total, {
				cid: that.cid
			}, function (res) {
				if (res.error_code == '0') {
					that.total = res.data;
				} else {
					console.log(res.msg)
					that.$layer.msg(res.msg);
				}
			}, 'json');
		},

		//收费总额
		handleChargeTotal: function handleChargeTotal(data) {
			this.total = data;
		},
		switch_car_handle: function switch_car_handle() {
			// 如果照片不存在则不触发切换
			if (this.car_in.picture == '' || this.car_in.closeup_pic == '') {
				return;
			};
			this.switch_car = !this.switch_car;
		},

		specialToCharges: function specialToCharges(index) {

			this.car_out[index].special = true;
			this.$nextTick(function () {
				layui.use(['form'], function () {
					var form = layui.form;
					form.render('select');
				});
			});
		},

		specialCancel: function specialCancel(index) {
			this.car_out[index].special = false;
		},

		specialConfirm: function specialConfirm(index) {
			this.car_out[index].special = false;
			this.car_out[index].isConfirm = true;
			this.car_out[index].carNum = this.car_out[index].carNum.join('');
			this.openOutGate();
		},

		// 车辆补拍
		bupai: function bupai() {
			var that = this;
			this.$jquery.get(config.bupai + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('补拍成功');
			});
		},

		// 车辆确认
		carConfirmed: function carConfirmed(index) {
			this.car_out[index].isConfirm = true;
			this.car_out[index].carNum = this.car_out[index].carNum.join('');
			this.openOutGate();
		},
		openOutGate: function openOutGate() {
			var that = this;
			that.$layer.msg('出场起竿成功');
			this.$jquery.get(config.open_out + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('起竿成功');
			});
		},
		openInGate: function openInGate() {
			var that = this;
			that.$layer.msg('测试起竿成功');
			this.$jquery.get(config.open_in + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('起竿成功');
			});
		},
		selectCarNum: function selectCarNum(e) {
			var num = this.car_out[0];
			console.log(num.carNum);
			num.carNum.splice(0, 1, e.target.innerText);
			this.$set(this.car_out[0], num);
			this.carSelectPanel = false;
			this.carNumber = this.catchCarNumber;
		},
		closeCarSelectPanel: function closeCarSelectPanel() {
			console.log('a');
			this.carSelectPanel = false;
			this.carNumber = this.catchCarNumber;
		}
	}
});

Date.prototype.Format = function (fmt) {
	//author: meizz
	var o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		'S': this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	}return fmt;
};

Vue.directive('numberOnly', {
	bind: function(){
		this.handler = function(){
			this.el.value = this.el.value.replace(/\D+/, '')
		}.bind(this);
		this.el.addEventListener('input', this.handler)
	},
	unbind: function(){
		this.el.removeEventListener('input', this.handler)
	}
})
//# sourceMappingURL=main.js.map
