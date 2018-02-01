Vue.component('preview-img', {
  template: `
    <div class="imgPopup">
      <div class="operation_bar">
        <div class="close" @click="closePreviewC"></div>
        <img :src="src" class="img-center"/>
      </div>
    </div>
  `,
  props: {
    src: {
      type: String
    }
  },
  data: function(){
    return {

    }
  },
  methods: {
    closePreviewC: function(){
      console.log('closePreview')
      this.$emit('close')
    }
  }
})
