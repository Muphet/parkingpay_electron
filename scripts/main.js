'use strict';


<<<<<<< HEAD
	// var $host,$controls

	// $host = $('[mag-thumb="outer"]');
	// $host.mag({
	//   mode: 'outer',
	//   ratio: 1 / 1.6
	// });
=======
	var $host,$controls

	$host = $('[mag-thumb="outer"]');
	$host.mag({
	  mode: 'outer',
	  ratio: 1 / 1.6
	});
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a



var vm = new Vue({
	el: '#app',
	data: function data() {
		return {
			time: '',
			previewImgVisible: false,
			previewImgPath: '',
			message: 'hello world',
			visible: false,
			insertDisabled: false,
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


			carInSubmitLoading: false,

			noCarStorage: []
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
		const that = this;

		this.$jquery = jQuery.noConflict();
		this.initLayUi();
		this.$jquery.ajaxSetup({
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			timeout: 15000,
			error: function(xhr, status){
				console.log('errror ' + JSON.stringify(xhr) + ' code ' +status)
			}
		});

		layui.use(['layer'], function () {
			that.$layer = layui.layer;
		});

		setTimeout( () => {
<<<<<<< HEAD
			if(config){
				console.log('config loaded!')
				this.checkLogin()
				this.getLoopPlateIn();
				this.getLoopPlateOut();
				const $ = this.$jquery;
				$('img').zoomify();
			} else {
				console.log('config load fail!')
			}

			
=======
			console.log(config)
			this.checkLogin()
			this.getLoopPlateIn();
			this.getLoopPlateOut();
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
		}, 500)

	},

	methods: {
		mouseWheelInit: function(){
			const $ = this.$jquery;
			var $host;
<<<<<<< HEAD
			// $host = $('[mag-thumb="inner"]');
			// $host.mag({
			//   toggle: true
			// });
=======
			$host = $('[mag-thumb="inner"]');
			$host.mag({
			  toggle: true
			});
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
		},
		closePreview: function closePreview(){
			this.previewImgVisible = false;
		},
		imgPopup: function imgPopup( src ){
			this.previewImgVisible = true;
			this.previewImgPath = src;
		},
		checkLogin: function checkLogin(){
			var user = localStorage.getItem('user');

			if(!user){
				this.visible = false;
			} else {
				const user = JSON.parse(localStorage.getItem('user'));
				const cid = user.cid;
				this.cid  = cid;
				this.username = user.username
				this.loginTime = new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss');
				this.getTotal();
			}
		},
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

					localStorage.setItem('user', JSON.stringify(res.data))
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
			if(this.carInStorage.length > 10){
				this.carInStorage.pop()
			}
			if(this.noCarStorage.length > 10){
				this.noCarStorage.pop()
			}
			axios.get(config.cin + '?station_id=' + config.station_id).then(function (res) {

				if (res.data != '') {
<<<<<<< HEAD
					console.log('最新入场数据', res.data)
=======
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
					_this3.handlePlateInData(res.data);
				} else {}
				setTimeout(function () {
					_this3.getLoopPlateIn();
				}, 500);
			}).catch( function(){
				_this3.getLoopPlateIn();
			});
		},

		//处理获得的入场数据
		handlePlateInData: function handlePlateInData(data) {
			const _data = {};
			if(data.carNum == '无牌车'){
				_data.carNum = ['无','牌','车','','','','',''];
			} else{
				_data.carNum = data.carNum.split('');
			}
<<<<<<< HEAD

=======
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
			this.sendLEDMessage('in', data.carNum, '欢迎光临');

			_data.picture = 'data:image/jpeg;base64,' + data.picture.replace(/ /g,"+");
			_data.closeup_pic = 'data:image/jpeg;base64,' + data.closeup_pic.replace(/ /g,"+");
			_data.time = new Date(data.intime * 1000).Format('yyyy-MM-dd hh:mm:ss');
			_data.color = data.color;
			_data.insert = false;

			// 判断入场车牌号是否重复
			if( new Date(_data.time).getTime() - new Date(this.car_in.time).getTime() < 60000
						&& this.car_in.carNum
						&& _data.carNum.join('') == this.car_in.carNum.join('')) return;

			if(data.carNum == '无牌车'){
<<<<<<< HEAD

				if(!this.carInConfirmBtnDisabled){
					this.noCarStorage.push(_data)
				} else {
					this.car_in = _data;
					this.carInConfirmBtnDisabled = false
				}
			
			} else {
				this.openInGate()
				this.carInStorage.push(_data);
				
=======
				this.car_in = _data;
				this.noCarStorage.push(_data)
			} else {
				console.log('push')
				this.carInStorage.push(_data);
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
			}

			this.checkStorage();
		},
		insertCarRecord: function(){
			this.insertDisabled = true;
			this.car_in = {
				carNum: ['','','','','','','',''],
				color:'',
				time: new Date().Format('yyyy-MM-dd hh:mm:ss'),
				start_time:'',
				camera_id:'',
				picture:"",
				pid: config.pid,
				closeup_pic: '',
				station_id:config.station_id,
				insert: true
			}
			this.carInConfirmBtnDisabled = false;
		},
		checkStorage: function checkStorage() {
<<<<<<< HEAD
			// 检测无牌车以及当前正在编辑的状态
			if (this.noCarStorage.length > 0 && this.carInConfirmBtnDisabled){
				this.car_in = this.noCarStorage[0];
				this.carInConfirmBtnDisabled = false;
=======
			if (this.noCarStorage.length > 0 && this.carInConfirmBtnDisabled){
				this.car_in = this.noCarStorage[0];
				this.carInConfirmBtnDisabled = false;

				this.$nextTick( () => {
					this.mouseWheelInit()
				})
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
			} else {
				if (this.carInStorage.length > 0 && this.carInConfirmBtnDisabled) {
					this.car_in = this.carInStorage[0];
					this.carInConfirmBtnDisabled = false;
<<<<<<< HEAD
				}
			}

			this.$nextTick( () => {
				this.mouseWheelInit()
			})
=======

					this.$nextTick( () => {
						this.mouseWheelInit()
					})
				}
			}

>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
		},

		sendLEDMessage(inout, carNum, tip){
			this.$jquery.post(config.led, {
				station_id: config.station_id,
				inout: inout,
				carnum: carNum,
				tip: tip
			}, res => {
				console.log('sendLEDMessage :' + res )
			})
		},

		//入场确认
		carConfirmEnter: function carConfirmEnter() {
			this.insertDisabled = false;
			var car = this.car_in;
			var that = this;
			var time = JSON.stringify({
					'carNum': car.carNum.join(''),
					'intime': new Date(car.time).getTime() / 1000,
					'color': car.color
				})
			if(car.insert){
				this.openInGate()
			}
			console.log('入场确认参数 : ', time)

			this.carInSubmitLoading = true;
			this.$jquery.post(config.submitEnter + '?action=user_in&pid=' + config.pid + '&station_id=' + config.station_id, {
				content: time
			}, function (res) {
				console.log('submit in ', JSON.stringify(res))
				that.carInSubmitLoading = false;
				if (res.error_code == '0') {
					that.addedEnterList();
					if(that.noCarStorage.length > 0){
						that.noCarStorage.shift();
					} else {
						that.carInStorage.shift();
					}

<<<<<<< HEAD
=======
					that.openInGate();
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
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
			if(this.car_out.length > 10){
				this.car_out.pop()
			}
			axios.get(config.cout + '?station_id=' + config.station_id).then(function (res) {

				if (res.data != '') {
					console.log('最新出场纪录', res.data)

					var response = res.data;
					var _car_out = {};

					_car_out.carNum = response.carNum.split('');
					_car_out.picture = 'data:image/jpeg;base64,' + response.picture.replace(/ /g, '+');
					_car_out.closeup_pic = 'data:image/jpeg;base64,' + response.closeup_pic.replace(/ /g, '+');

					_car_out.intime = response.intime == '' ? '' : new Date(response.intime * 1000).Format('yyyy-MM-dd hh:mm:ss');
					_car_out.outtime = new Date(response.outtime * 1000).Format('yyyy-MM-dd hh:mm:ss');
					_car_out.special = false;
					_car_out.isConfirm = false;
					_car_out.color = response.color;
					_car_out.carItemOutLoading = false;
					_car_out.carOutAction = 'pre_out';

					// 判断出场车牌号是否重复 同一车牌号一分钟内提交
<<<<<<< HEAD
					console.log('length', that.car_out)
					if(
							that.car_out.length !== 0 &&
							_car_out.carNum.join('') == that.car_out[0].carNum.join('') &&
							new Date(response.outtime * 1000).getTime() - new Date(that.car_out[0].outtime).getTime() < 60000)
					{

						console.log('repeat')
=======
					if(
							that.car_out.length &&
							_car_out.carNum.join('') == that.car_out[0].carNum &&
							new Date(response.outtime * 1000).getTime() - new Date(that.car_out[0].outtime).getTime() < 60000)
					{
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
						_car_out = {};
						setTimeout(function () {
							that.getLoopPlateOut();
						}, 500);
						return
<<<<<<< HEAD
					} else {
					console.log('_b')
					console.log('__car', _car_out)
					}
=======
					}


					that.$nextTick(function () {
						that.car_out.unshift(_car_out);
					});

>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
					setTimeout( () => {
						console.log('timeout token')
						that.car_out.unshift(_car_out);
						that.getOutToken(_car_out, 0);
					}, 100)
				}

				setTimeout(function () {
					that.getLoopPlateOut();
				}, 500);
			}).catch( function(){
				that.getLoopPlateOut();
			});
		},
<<<<<<< HEAD
		getOutToken: function getOutToken(data, index) {
			var _this4 = this;
			var that   = this;
			var _data;

			if(data.intime){
				_data = JSON.stringify({
=======
		updateDateTimePicker: function updateDateTimePicker(){
			const that = this;

			this.$nextTick(function () {
				layui.use(['layer', 'laydate', 'form', 'element'], function () {
					var form = layui.form,
							laydate = layui.laydate,
							type = 'datetime';

					var ins1 = laydate.render({
						elem: '#time-edit', //指定元素
						type: type,
						change: function change(value) {
							that.updateIntime(value);
						},
						done: function done(value) {
							that.updateIntime(value);
						}
					});

					form.render('select', 'aihao');
				});
			});
		},
		getOutToken: function getOutToken(data) {
			var _this4 = this;
			var that   = this;
			if(data.intime == '') {
				this.updateDateTimePicker()
				return
			};

			this.car_out[0].carItemOutLoading = true;
			this.$jquery.post(config.outToken + '?action='+ data.carOutAction+'&pid=' + config.pid + '&station_id=' + config.station_id, {
				content: JSON.stringify({
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
					'carNum': data.carNum.join(''),
					'intime': new Date(data.intime).getTime() / 1000,
					'outtime': new Date(data.outtime).getTime()/1000,
					'color': data.color
				})
			} else {
				_data = JSON.stringify({
					'carNum': data.carNum.join(''),
					'outtime': new Date(data.outtime).getTime()/1000,
					'color': data.color
				})
			}
			console.log('request', _data)
			this.car_out[index].carItemOutLoading = true;

			this.$jquery.ajax({
				url: config.outToken + '?action='+ data.carOutAction+'&pid=' + config.pid + '&station_id=' + config.station_id,
				type: 'POST',
				data: {
					content: _data
				},
				dataType: 'json',
				success: function( res ){
					console.log('out token', res)
					that.car_out[index].carItemOutLoading = false;
					data.open = res.open;
					data.payway = res.payway;
					data.money = res.money;
					data.intime = res.intime;
					data.tip = res.tip;

					if(res.intime != ''){
						that.car_out[index].disabled = false
					}
					data.intime = res.intime
					// open 1:可以起杆 0：不起杆

<<<<<<< HEAD
					that.sendLEDMessage('out', res.carnum, res.tip);

					if (res.open == 1) {
						data.disabled = true;
						that.openOutGate();
					} else {}

					// 使用Vue提供的$set方法更新数组
					// that.$set(, data);
					that.car_out[index] = data;

				},
				error: function(){
					that.car_out[0].carItemOutLoading = false;
					that.$layer.msg('提交失败')
				}
			})
			
		},

		changeInTime: function( index ){
			const _time = this.car_out[index].intime;
			this.car_out[index].intime = new Date(_time).Format('yyyy-MM-dd hh:mm:ss');
			this.getOutToken(this.car_out[index], index)
=======
				that.sendLEDMessage('in', res.carnum, res.tip);

				if (res.open == 1) {
					data.disabled = true;
					that.openOutGate();
				} else {}

				// 使用Vue提供的$set方法更新数组

				that.$set(that.car_out[0], data);

				that.updateDateTimePicker()
			}, 'json');
		},

		updateIntime: function updateIntime(intime) {
      // 补入入场时间
			this.car_out[0].intime = new Date(intime).getTime() / 1000;
			this.getOutToken(this.car_out[0])
			console.log('intime', intime)
			const data = this.car_out[0];
			data.intime = intime;
			this.$set(this.car_out[0], data);
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
		},
		getTotal: function getTotal() {
			var that = this;
			this.$jquery.post(config.total, {
				cid: that.cid
			}, function (res) {
				if (res.error_code == '0') {
					that.total = res.data;
				} else {
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
			this.$nextTick( () => {
				this.mouseWheelInit()
			})
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
<<<<<<< HEAD
			if(this.car_out[index].intime == ""){
				this.$layer.msg('请填写入场时间')
				return
			}
			this.car_out[index].carOutAction = 'user_out';
			this.car_out[index].intime = new Date(this.car_out[index].intime).getTime();
			this.getOutToken(this.car_out[index], index)

=======
			this.car_out[index].carOutAction = 'user_out';
			this.car_out[index].intime = new Date(this.car_out[index].intime).getTime();
			this.getOutToken(this.car_out[index])
			console.log('ok', this.car_out[index].intime)
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
			this.car_out[index].isConfirm = true;
			this.car_out[index].carNum = this.car_out[index].carNum.join('');
			// this.openOutGate();
		},

		openOutGate: function openOutGate() {
			var that = this;
			this.$jquery.get(config.open_out + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('出场起竿成功');
			});
		},
		openInGate: function openInGate() {
			var that = this;
			this.$jquery.get(config.open_in + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('入场起竿成功');
			});
		},
		selectCarNum: function selectCarNum(e) {
			var num = this.car_out[0];
			num.carNum.splice(0, 1, e.target.innerText);
			this.$set(this.car_out[0], num);
			this.carSelectPanel = false;
			this.carNumber = this.catchCarNumber;
		},
		closeCarSelectPanel: function closeCarSelectPanel() {
			this.carSelectPanel = false;
			this.carNumber = this.catchCarNumber;
		}
	}
});


//# sourceMappingURL=main.js.map
