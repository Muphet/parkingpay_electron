const wechatPay = {
	methods: {
		MiniPro: function( state, car){
			return new Promise( function(resolve, reject){
				if(axios){
					axios({
					  url: 'http://www.parkingpay.net:9095/'+state+'?carnum='+car,
					  method: 'GET',
					  timeout: 5000,
					  headers: {
					    'Content-Type': 'application/x-www-form-urlencoded'
					  }
					}).then( res => {
						resolve(res.data)
					}).catch( res => {
						reject(res)
					})
				}
			})
		},
		reg: function( car ){
			return new Promise( (resolve, reject ) => {
				this.MiniPro('reg', car).then( res => {
					resolve( res)
				}).catch( error => {
					reject( error)
				})
			})
		},
		MiniProQuery: function( car ){
			
			return new Promise( (resolve, reject ) => {
				this.MiniPro('query', car).then( res => {
					resolve( res )
				}).catch( error => {
					reject( error)
				})
			})
		},
		MiniProDel: function( car ){
			return new Promise( (resolve, reject ) => {
				this.MiniPro('del', car).then( res => {
					resolve( res )
				}).catch( error => {
					reject( error)
				})
			})
		},

	}
}