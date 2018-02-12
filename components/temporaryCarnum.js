const template = `
<div>
        <div>
          车牌号:
          <el-input v-model="queryInCarNum" :autofocus="true" :placeholder="placeholder" @keyup.enter.native="handleQueryIn">
            <el-button slot="append"  @click="handleQueryIn">查询</el-button>  
          </el-input>
        </div>
        <br>
        <el-table border :data="data" stripe v-loading="queryInLoading" element-loading-text='正在查询...'>
          <el-table-column
            prop="carno"
            width="120"
            label="车牌号">
          </el-table-column>
          <el-table-column
            prop="intime"
            width="170"
            label="入场时间">
          </el-table-column>
          <el-table-column
            prop="station_id"
            width="100"
            label="入场口">
          </el-table-column>
          <el-table-column
            prop="fullimage_filename"
            label="车辆图片">
            <template slot-scope="scope">
              <img :src="scope.row.fullimage_filename" class="query_img_preview zoomify">
            </template>
          </el-table-column>
          <el-table-column
            prop="station_id"
            width="120"
            label="操作">
            <template slot-scope="scope">
             <el-button size="small" type="primary" @click="sendMatch(scope.row)">匹配入场记录</el-button>
            </template>
          </el-table-column>
        </el-table>
     </div>
`
Vue.component('temporaryCarnum', {
	template: template,
	props: {
		queryInVisible: {
			type: Boolean,
			default: false
		},
		data: {
			type: Array
		}
	},
	data: function(){
		return {
			queryInCarNum: '',
			placeholder: '临',
			queryInLoading: false,
			carInQueryData: [],
      resetData: []
		}
	},
  mounted(){
    console.log(this.data)
    setTimeout( () => {
      this.getQueryInImg()
    }, 300)
  },
	methods: {
    getImg: async function(url){
      return new Promise( function(resolve, reject)  {
        axios.get(config.img+'?uri='+url)
          .then( res => {
            resolve( res)
          })
          .catch( res => {
            reject( res )
          })
      })
    },
    getQueryInImg: function( ){
      const that = this;
      
     
      this.resetData = this.data;
    },
		handleQueryIn: function(){
			var text = this.queryInCarNum.slice(0, 1) == '临' ? this.queryInCarNum : '临' + this.queryInCarNum;
			this.$emit('temporary', text || '临' + this.placeholder)
		},
		sendMatch: function( row ){
			this.$emit('match', row)
		}
	}
})