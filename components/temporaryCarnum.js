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
            label="车牌号">
          </el-table-column>
          <el-table-column
            prop="intime"
            label="入场时间">
          </el-table-column>
          <el-table-column
            prop="station_id"
            label="入场口">
          </el-table-column>
          <el-table-column
            prop="plateimage_filename"
            label="车牌号图片">
            <template slot-scope="scope">
              <img :src="scope.row.plateimage_filename" class="query_img_preview zoomify">
            </template>
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
			carInQueryData: []
		}
	},
	methods: {
		handleQueryIn: function(){
			var text = this.queryInCarNum.slice(0, 1) == '临' ? this.queryInCarNum : '临' + this.queryInCarNum;
			this.$emit('temporary', text || '临' + this.placeholder)
		},
		sendMatch: function( row ){
			this.$emit('match', row)
		}
	}
})