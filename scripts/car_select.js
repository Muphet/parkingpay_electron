let catchNum = ''
Vue.component('car-select', {
	template: `<div class="number_plate" v-outside="handleClose">

					<div class="input">
						<input
							@keyup="checkKeyCode($event, index)"
							@click="plateFocus($event, index)"
							@change="plateChange"
							ref="input"
							:placeholder="sub"
							maxlength="1"
							class="plate_character" type="text" v-for="(sub, index) in data" :value="sub" name="">
					</div>
					<transition name="el-zoom-in-top">
						<div class="dropdown" v-if="carDropdown">
							<div class="province_select_container" v-if="!provinceDisabled">
								<button @click="checkInputKeyCode" :disabled="provinceDisabled" class="button" :data-key="item.value" v-for="item in car_in.carNumber">{{item.value}}</button>
							</div>
							<div class="letter_select_container" v-if="!letterDisabled">
								<button @click="checkInputKeyCode" :disabled="letterDisabled" class="button" :data-key="item" v-for="item in car_in.ABC">{{item}}</button>
							</div>
							<div class="number_select_container" v-if="!numberDisabled">
								<button @click="checkInputKeyCode" :disabled="numberDisabled" class="button" :data-key="item" v-for="item in car_in.car_number_token">{{item}}</button>
							</div>
						</div>
					</transition>
				</div>`,
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	data: function(){
		return {
			carDropdown: false,
			input_index: undefined,
			car_in: {
				carNumber: [{'key':'J','value':'京'},{'key':'L','value':'临'},{'key':'J','value':'津'},{'key':'H','value':'沪'},{'key':'Y','value':'渝'},{'key':'J','value':'冀'},{'key':'Y','value':'豫'},{'key':'Y','value':'云'},{'key':'L','value':'辽'},{'key':'H','value':'黑'},{'key':'X','value':'湘'},{'key':'W','value':'皖'},{'key':'L','value':'鲁'},{'key':'S','value':'苏'},{'key':'G','value':'赣'},{'key':'Z','value':'浙'},{'key':'Y','value':'粤'},{'key':'E','value':'鄂'},{'key':'G','value':'桂'},{'key':'G','value':'甘'},{'key':'J','value':'晋'},{'key':'M','value':'蒙'},{'key':'S','value':'陕'},{'key':'J','value':'吉'},{'key':'M','value':'闽'},{'key':'G','value':'贵'},{'key':'Q','value':'青'},{'key':'Z','value':'藏'},{'key':'C','value':'川'},{'key':'N','value':'宁'},{'key':'X','value':'新'},{'key':'Q','value':'琼'}],
				carCatchNumber: [{'key':'J','value':'京'},{'key':'L','value':'临'},{'key':'J','value':'津'},{'key':'H','value':'沪'},{'key':'Y','value':'渝'},{'key':'J','value':'冀'},{'key':'Y','value':'豫'},{'key':'Y','value':'云'},{'key':'L','value':'辽'},{'key':'H','value':'黑'},{'key':'X','value':'湘'},{'key':'W','value':'皖'},{'key':'L','value':'鲁'},{'key':'S','value':'苏'},{'key':'G','value':'赣'},{'key':'Z','value':'浙'},{'key':'Y','value':'粤'},{'key':'E','value':'鄂'},{'key':'G','value':'桂'},{'key':'G','value':'甘'},{'key':'J','value':'晋'},{'key':'M','value':'蒙'},{'key':'S','value':'陕'},{'key':'J','value':'吉'},{'key':'M','value':'闽'},{'key':'G','value':'贵'},{'key':'Q','value':'青'},{'key':'Z','value':'藏'},{'key':'C','value':'川'},{'key':'N','value':'宁'},{'key':'X','value':'新'},{'key':'Q','value':'琼'}],
				ABC: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
				car_number_token: [1,2,3,4,5,6,7,8,9,0]
			},
			provinceDisabled: true,
			letterDisabled: true,
			numberDisabled: true,
			catch: ''
		}
	},
	mounted(){
		this.$jquery = jQuery.noConflict();
		catchNum = this.data
	},
	computed: {
		getDataDiff: {
			get: function(){
				return this.data;
			},
			set: function( value ){
				console.log(value)
			}
		}
	},
	watch: {
	},
	directives: {
        outside: {
          bind: function(el, binding, vnode){

            function documentHandler( e ){
              if(el.contains(e.target)){
                return false
              }

              if(binding.expression){
                binding.value(e)
              }
            }

            el.__vueClickOutside__ = documentHandler;

            document.addEventListener('click', documentHandler)
          },
          unbind: function(el, binding){
            document.removeEventListener('click', el.__vueClickOutside__)
            delete el.__vueClickOutside__
          }
        }
    },
    methods:{
		plateChange(){

		},
		checkKeyCode(e, index){
			console.log(e.keyCode)
			if(
				(e.keyCode >= 65 && e.keyCode <= 90) ||
				(e.keyCode >= 48 && e.keyCode <= 57) ||
				(e.keyCode >= 96 && e.keyCode <= 105)
			){

				// 键盘直接输入
				if(index > 0 && e.keyCode >= 35 && e.keyCode <= 45 ){
					this.data[index] = '';
					console.log(e.keyCode, e.key)
					this.data.splice(index, 1, e.key)
					console.log(this.$refs.input[index++])
					if(index == this.data.length) return;
					this.$refs.input[index++].focus()
				} else if( index > 0){
					this.data[index] = '';
					this.data.splice(index, 1, e.key.toUpperCase())
					console.log(this.$refs.input[index++])
					if(index == this.data.length) return;
					this.$refs.input[index++].focus()
				}

				const filteredProvinceList = this.car_in.carNumber.filter( item => {
					return item.key == e.key.toUpperCase() && item.key;
				})

				this.car_in.carNumber = filteredProvinceList;

				if(index == 0 && filteredProvinceList.length == 1){
					this.data.splice(0, 1, filteredProvinceList[0].value)
					this.input_index++;
					this.$refs.input[this.input_index].focus()
				}

			}

			if(e.keyCode == 8 || e.key == 'Backspace'){
				this.car_in.carNumber = this.car_in.carCatchNumber
			}

		},
		plateFocus(e, index){
			this.input_index = index;
			this.carDropdown = true
			if(index == 0){
				this.provinceDisabled = false;
				this.letterDisabled = true;
				this.numberDisabled = true;
			} else {
				this.provinceDisabled = true;
				this.letterDisabled = false;
				this.numberDisabled = false;
			}

			this.$emit('edit')
		},
		handleClose(){
			this.carDropdown = false
			this.car_in.carNumber = this.car_in.carCatchNumber
		},
		checkInputKeyCode(e){
			this.data[this.input_index] = e.target.dataset.key
			this.data.splice(this.input_index, 1, e.target.dataset.key)
			this.carDropdown = false;
			this.input_index++;
			this.$refs.input[this.input_index].focus()
			this.$emit('selected', this.data)
		}
	}
})

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
	};
	return fmt;
};

Vue.directive('preview', {
	bind: function(el, binding, vnode){
		var s = JSON.stringify;

		function documentHandler( e ){
			// if(el.contains(e.target)){
			// 	return false
			// }

			if(binding.expression){
				binding.value(el.src)
			}
		}


		el.__vueClickOutside__ = documentHandler;

		document.addEventListener('click', documentHandler, false)
	},

	unbind: function(el, binding){
		document.removeEventListener('click', el.__vueClickOutside__);
		delete el.__vueClickOutside__;
	}
})
