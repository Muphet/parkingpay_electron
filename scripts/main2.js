var carInUpdate = {
	intime: '',
	carNum: '',
	md5: ''
};
var carOutUpdate = {
	outtime: '',
	carNum: '',
	md5: ''
};

var vm = new Vue({
	el: '#app',
	data: function(){
		return {
			queryInVisible: false,
			queryInCarNum: '',
			carInQueryData: [],
			queryInLoading: false,

			page_numer_specified:1,
			logData: [],
			querycarno: '',
			page_numer: 1,
			nextDisabled: false,
			chargeDetailPanelVisible: false,
			visible: false,
			charge_detail: false,
			insertDisabled: false,			
			carInSubmitLoading: false,
			switch_car: false,
			preInserting: false,
			total: {},
			cid: undefined,
			form: {
				name: '',
				password: ''
			},
			rules: {
				name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
			},
			username: '',
			loginTime: '',
			carIn: [],
			carOut: [],
			specialType: '',
			revenue: '',		//特殊实收金额
			carInTypeOption: [{
          value: '1',
          label: '小型车'
        }, {
          value: '2',
          label: '大型车'
        }],
     	carInType: '1',
     	pickerOptions: {
     		disabledDate(time) {
          return time.getTime() > Date.now();
        }
     	},
     	alreadyEntered: [],
     	signLoading: false,
     	passwordFocus: false
		}
	},
	watch: {

	},
	computed: {
		carInConfirmBtnDisabled: function(){
			return this.carIn.length == 0;
		}
	},
	mounted(){
		const that = this;
		this.$jquery = jQuery.noConflict();
		
		layui.use(['layer'], function () {
			that.$layer = layui.layer;
		});
		

		setTimeout( () => {
			if(config){
				console.log('config loaded!')
				this.checkLogin()
				this.In('');
				this.Out('');
				const $ = this.$jquery;
				$('.zoomify').zoomify();
			} else {
				console.log('config load fail!')
			}
		}, 500)

	},
	methods: {
		tabInput: function(){
			this.$refs['passwordFocus'].focus();
		},
		Out: function( last ){
			const that = this;
			axios.get(config.cout + '?station_id=' + config.station_id + '&last=' + last).then(function (res) {

				setTimeout( () => {
					that.Out(carOutUpdate.md5)
				}, 500)

				if(that.carOut.length > 20){
					that.carOut.pop();
				}

				if(res.data == '') return;

				// if(that.carOut.length > 0 && that.carOut[0].isConfirm == false) return;
				if(that.carOut.length !== 0 && that.carOut[0].isConfirm == false) return;

				carOutUpdate.md5 = res.data.md5;

				if(carOutUpdate.carNum == res.data.carNum && that.diffDate(carOutUpdate.outtime * 1000, res.data.outtime * 1000)) {
					console.log('car out number repeat')
					return;
				} else {
					carOutUpdate.outtime = res.data.outtime;
					carOutUpdate.carNum = res.data.carNum;
				}
				if(res.data.outtime == ''){
					res.data.carOuttimeReadonly = false;
				} else {
					res.data.carOuttimeReadonly = true;
				}
				that.preOut({
					carNum: res.data.carNum,
					outtime: res.data.outtime,
					color:   res.data.color
				}, 0)

				if(res.data.carNum == '无牌车'){
					res.data.carNum = ['无','牌', '车', '','','','']
				} else {
					res.data.carNum = res.data.carNum.split('')
				}	
				res.data.picture = ''
				res.data.closeup_pic = ''
				that.getImg(res.data.fullimage_filename).then( res2 => {
					that.carOut[0].picture = config.server + '/img?uri='+res.data.fullimage_filename
				})
				that.getImg(res.data.plateimage_filename).then( res2 => {
					that.carOut[0].closeup_pic = config.server + '/img?uri='+res.data.plateimage_filename
				})

				res.data.intime = new Date(parseInt(res.data.intime) * 1000).Format('yyyy-MM-dd hh:mm:ss');
				res.data.outtime = new Date(parseInt(res.data.outtime) * 1000).Format('yyyy-MM-dd hh:mm:ss');
				res.data.isConfirm = false;
				res.data.switch_car = false;
				res.data.special = false;

				that.carOut.unshift(res.data)

				that.$nextTick( function(){
					that.$jquery('.zoomify').zoomify();
				})
			}).catch( res => {
				setTimeout(() => {
					that.Out(carOutUpdate.md5)
				}, 500);
			})
		},
		getImg: async function(url){
			return new Promise( function(resolve, resject)  {
				axios.get(config.img+'?uri='+url)
					.then( res => {
						resolve( res)
					})
					.catch( res => {
						reject( res )
					})
			})
		},
		preOut: function( preData, index ){
			const that = this;
			const content = preData;
			this.$jquery.ajax({
				url: config.preout + '&pid=' + config.pid + '&station_id=' + config.station_id,
				type: 'POST',
				data: {
					content: JSON.stringify(content)
				},
				timeout: 5000,
				dataType: 'json',
				success: function( res ){
					console.log('preout response data :' + JSON.stringify(res));
					that.carOut[index].intime = res.intime == '' ? '' : new Date(res.intime);
					that.carOut[index].money = res.money;
					that.carOut[index].payway = res.payway;
					that.carOut[index].stay = res.stay;
					that.carOut[index].tip = res.tip;
					if(res.intime == ''){
						that.carOut[index].carIntimeReadonly = false;
					} else {
						that.carOut[index].carIntimeReadonly = true;
					}
					if (res.open == 1) {
						that.carOut[index].disabled = true;
						that.carOut[index].isConfirm = true;
						that.carOut[index].carNum = that.carOut[index].carNum.join('');
						that.carConfirmedOut(0);
						that.openOutGate();
						window.removeEventListener('keydown', that.hotKeyBoard)
					} 

					that.sendLEDMessage('out', res.carnum, res.tip);
					window.addEventListener('keydown', that.hotKeyBoard)
				}, 
				error: function(xhr, status){
					if(xhr.readyState == 0 || xhr.statusText == 'timeout'){
						that.$layer.msg('连接超时！')
					}
					console.log('request preout Api timeout!')
				}
			})
		},
		hotKeyBoard: function(event){
			if(event.key == 'Enter' || event.keyCode == 13 || event.key == ' ' || event.keyCode == 32 && this.carOut[0].isConfirm){
				event.preventDefault();
				this.carConfirmedOut(0)
			}
		},
		specialToCharges: function(index) {
			this.carOut[index].special = true;
		},
		specialCancel: function( index ){
			this.carOut[index].special = false;
		},
		specialConfirm: function( index ){
			this.carConfirmedOut( index );
		},
		switchItemPreview: function( index){
			this.carOut[index].switch_car = !this.carOut[index].switch_car;
		},
		carConfirmedOut: function(index) {
			const that = this;

			if(this.carOut[index].intime == ""){
				this.$layer.msg('请填写入场时间')
				return
			}
			var carnum = this.carOut[index].carNum;
			if(isArray(carnum)){
				carnum = this.carOut[index].carNum.join('')
			} else {
				carnum = this.carOut[index].carNum;
			}
			const content = {
				"carNum": carnum,
				"outtime":new Date(this.carOut[index].outtime).getTime() / 1000,
				"color": 	this.carOut[index].color,
				"money":  this.revenue,
				"reason": this.specialType
			}

			this.$jquery.ajax({
				url: config.out + '&pid=' + config.pid + '&station_id=' + config.station_id,
				type: 'POST',
				timeout: 5000,
				data: {
					content: JSON.stringify(content)
				},
				dataType: 'json',
				success: function( res ){
					that.carOut[index].intime = new Date(res.intime);
					that.carOut[index].money = res.money;
					that.carOut[index].payway = res.payway;
					that.carOut[index].carNum = carnum;
					that.carOut[index].isConfirm = true;
					that.carOut[index].special = false;
					that.revenue = ''
					that.specialType = ''
					that.openOutGate()
					window.removeEventListener('keydown', that.hotKeyBoard)
					that.getTotal();
				}, 
				error: function(xhr, status){
					console.log('time out', status)
				}
			})
		},

		changeInTime: function( index ){
			this.preOut({
				carNum: this.carOut[index].carNum.join(''),
				intime: new Date(this.carOut[index].intime).getTime() / 1000,
				outtime: new Date(this.carOut[index].outtime).getTime() / 1000,
				color:  this.carOut[index].color
			}, index)
		},

		In: function(last){
			const that = this;
			axios.get(config.cin + '?station_id=' + config.station_id + '&last='+last).then(function (res) {
				setTimeout(() => {
					that.In(carInUpdate.md5)
				}, 500);

				if(res.data){

					if(res.data.carNum == '无牌车'){
						res.data.carNum = ['无','牌', '车', '','','',''];
					} else {
						res.data.carNum = res.data.carNum.split('')
						that.openInGate()
					}

					carInUpdate.md5 = res.data.md5;
					if(carInUpdate.carNum == res.data.carNum.join('') && that.diffDate(carInUpdate.intime * 1000, res.data.intime * 1000)) {
						console.log('car in number repeat')
						return;
					} else {
						carInUpdate.intime = res.data.intime;
						carInUpdate.carNum = res.data.carNum.join('');
					}	

					res.data.closeup_pic = '';
					res.data.picture = '';


					that.sendLEDMessage('in', res.data.carNum.join(''), '欢迎光临');
					
					that.getImg(res.data.fullimage_filename).then( res2 => {
						that.carIn[0].picture = config.server + '/img?uri='+res.data.fullimage_filename
					})

					that.getImg(res.data.plateimage_filename).then( res2 => {
						that.carIn[0].closeup_pic = config.server + '/img?uri='+res.data.plateimage_filename
					})

					res.data.intime = new Date(parseInt(res.data.intime) * 1000).Format('yyyy-MM-dd hh:mm:ss');

					if(that.preInserting){
						that.carIn.splice(1, 0, res.data)
					} else{
						that.carIn.unshift(res.data)
					}

					that.$nextTick( function(){
						that.$jquery('.zoomify').zoomify();
					})

					setTimeout( () => {
						that.$jquery('.zoomify').zoomify();
					}, 1000)
				}
			}).catch( res => {
				setTimeout(() => {
					that.In(carInUpdate.md5)
				}, 500);
			})
		},
		editingCarNum: function(){
			console.log('正在编辑')
			this.editing = true;
		},

		changeShift: function changeShift() {
			this.visible = true;
		},
		carConfirmEnter: function(){
			const that = this;
			const car = this.carIn[0]

			const validVehicleNumber  = this.isVehicleNumber(car.carNum.join(''));
			if(!validVehicleNumber){
				this.$layer.msg('请输入正确的车牌号')
				return;
			};

			var requestParams = JSON.stringify({
				'carNum': car.carNum.join(''),
				'intime': new Date(car.intime).getTime() / 1000,
				'color': car.color
			})

			console.log('car enter submit confirmed params ' + requestParams)

			this.carInSubmitLoading = true;

			this.$jquery.ajax({
				url: config.submitEnter + '?action=user_in&pid=' + config.pid + '&station_id=' + config.station_id,
				type: "POST",
				data: {
					content: requestParams
				},
				timeout: 5000,
				dataType: 'json',
				success: function(res){
					that.carInSubmitLoading = false;
					if (res.error_code == '0') {
						that.addedEnterList();
						that.$layer.msg(res.error_msg);
						if(that.carIn.length !== 0){
							that.carInConfirmBtnDisabled = false;
						} else {
							that.carInConfirmBtnDisabled = true;
						}
						if(that.preInserting){
							that.openInGate()
						}
						that.preInserting = that.preInserting == true ? false : false;
						that.carIn.shift()
					} else {
						that.carInConfirmBtnDisabled = false;
						that.carConfirmEnter();
						console.log('提交失败， 再次提交中');
					}
				},
				error: function(xhr, status){
					that.carInSubmitLoading = false;
					if(xhr.readyState == 0 || xhr.statusText == 'timeout'){
						that.$layer.msg('连接超时！')
					}
					console.log('user in submit error' + JSON.stringify(xhr), status)
				}
			})

		},
		insertCarRecord: function(){
			this.preInserting = true;
			this.carIn.unshift({
				carNum: ['','','','','','','',''],
				color:'蓝色',
				intime: new Date().Format('yyyy-MM-dd hh:mm:ss'),
				start_time:'',
				camera_id:'',
				picture:"",
				pid: config.pid,
				closeup_pic: '',
				station_id:config.station_id,
				insert: true
			})
		},
		alreadyEntered: function(){},
		switch_car_handle: function(){
			this.switch_car = !this.switch_car;
		},
		diffDate: function(s, e){
			return new Date(e).getTime() - new Date(s).getTime() <= 60000
		},
		// 添加至进场确认列表
		addedEnterList: function addedEnterList() {

			if(this.alreadyEntered.length == 0){
				this.alreadyEntered.push({
					num: this.carIn[0].carNum.join(''),
					time: this.carIn[0].intime
				});
			} else {
				this.alreadyEntered.unshift({
					num: this.carIn[0].carNum.join(''),
					time: this.carIn[0].intime
				});
			}

		},

		// 车辆补拍
		bupai: function bupai() {
			var that = this;
			this.$jquery.get(config.bupai + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('补拍成功');
			});
		},
		closeCarSelectPanel: function closeCarSelectPanel() {
			this.carSelectPanel = false;
			this.carNumber = this.catchCarNumber;
		},
		updatePreOutNumber: function(val, index){
			console.log('update select out number ' + val + ' and index ' + index)
			this.preOut({
				carNum: val.join(''),
				outtime: new Date(this.carOut[index].outtime).getTime() / 1000,
				color:   this.carOut[index].color
			}, index)
		},
		openOutGate: function openOutGate() {
			var that = this;
			this.$jquery.get(config.openOut + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('出场起竿成功');
			});
		},
		ExpandDetail: function ExpandDetail() {
			this.charge_detail = !this.charge_detail;
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
		switchCarHandler: function( index ){
			console.log(index)
		},
		checkLogin: function checkLogin(){
			var user = sessionStorage.getItem('user');

			if(!user){
				this.visible = true;
			} else {
				const user = JSON.parse(sessionStorage.getItem('user'));
				const cid = user.cid;
				this.cid  = cid;
				this.username = user.username
				this.loginTime = new Date(Date.now()).Format('yyyy-MM-dd hh:mm:ss');
				this.getTotal();
			}
		},
		tollCollectorLogin: function tollCollectorLogin() {
			const _this2 = this;
			const that = this;
			this.signLoading = true;
			this.$jquery.post(config.login, {
				username: that.form.name,
				password: that.form.password,
				station_id: config.station_id,
				pid: config.pid
			}, function (res) {
				that.signLoading = false;
				if (res.error_code == 0) {
					_this2.$message({
						type: 'success',
						message: '登录成功'
					});

					sessionStorage.setItem('user', JSON.stringify(res.data))
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
		sendLEDMessage: function(inout, carNum, tip){
			console.log('sendLEDMessage :', inout, carNum, tip)
			this.$jquery.post(config.led, {
				station_id: config.station_id,
				inout: inout,
				carnum: carNum,
				tip: tip
			}, res => {
				console.log('sendLEDMessage :' + res )
			})
		},
		openInGate: function openInGate() {
			var that = this;
			this.$jquery.get(config.open_in + '?station_id=' + config.station_id, function (res) {
				that.$layer.msg('入场起竿成功');
			});
		},
		inConfirm: function(){
			alert('confirm')
		},
		isVehicleNumber: function(vehicleNumber) {
			var result = false;
			if (vehicleNumber.length <= 8){
			  var express = /^[测临京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/;
			  result = express.test(vehicleNumber);
			}
			return result;
		},
		cancelInsert: function(){
			console.log('cancel')
		},
		checkChargeDetaiVisible: function(){
			this.chargeDetailPanelVisible = true;
			this.log(this.cid, 1)
		},
		page: function( direction ){
			if(direction == 'prev')
			{
				this.page_numer--
			} else {
				this.page_numer++
			};

			this.log(this.cid, this.page_numer)
		},
		viewSpecifiedPage: function(){
			this.log(this.cid, this.page_numer_specified)
		},
		handleQuerycarno: function(){
			this.log(this.cid, this.page_numer, this.querycarno)
		},
		log: function(cid, page, carno){
			const that = this;
			this.$jquery.ajax({
				url: config.api+'/api/parking_log.php',
				type: 'POST',
				timeout: 5000,
				data: {
					cid: cid,
					carno:carno,
					page: page
				},
				dataType: 'json',
				success: function(res){
					console.log(res.data)
					if(res.error_code == '0'){

						that.logData = res.data;
						that.page_numer = page;
						that.nextDisabled = res.data.length ? false : true;
					} else {
						that.$layer.msg(res.msg)
					}
					
				},
				error: function(xhr){
					if(xhr.readyState == 0 || xhr.statusText == 'timeout'){
						that.$layer.msg('连接超时！')
						that.logData = [];
					}
				}
			})
		},
		queryIn: function(){
			this.queryInVisible = true;
		},
		handleQueryIn: function( page ){
			const that = this;
			var page = 1;
			if(this.queryInCarNum == ''){
				this.$layer.msg('请输入要查询的车牌号')
				return;
			}

			this.queryInLoading = true;
			this.$jquery.ajax({
				url:config.carin,
				type: 'POST',
				data: {
					pid: config.pid,
					carno: that.queryInCarNum,
					page: page
				},
				dataType: 'json',
				success: function(res){
					that.queryInLoading = false;
					if(res.error_code == '0'){
						that.carInQueryData = res.data
					} else {
						that.$layer.msg(res.error_msg)
					}
				},
				error: function(xhr, status){
					that.queryInLoading = false;
					if(xhr.readyState == 0 || xhr.statusText == 'timeout'){
						that.$layer.msg('连接超时！')
					}
					console.log('request preout Api timeout!')
				}
			})
		},
		loginOpenAutoFocus: function(){
			this.$nextTick( function(){
				this.$refs['usernameFocus'].focus();
			})
		}
	}
})

function isArray( arr ){
	return Object.prototype.toString.call(arr) == '[object Array]'
}

function isObject( object ){
	return Object.prototype.toString.call( object ) == '[object Object]'
}

function trim( str ){
	return str.replace(/\s+$/).replace(/\/2/g, '').replace(/ /g,"+").replace(/[^=](=.*$)$/g, '==');
}
