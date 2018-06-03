// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: {
      type: Array,
      value: []
    },
    defaultValue: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: null,
  },

  ready: function() {
    this.setData({
      current: this.data.defaultValue
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击切换
    onClickTabItem: function (e) {
      var value = e.target.dataset.current;
      if (this.data.current.key === value.key) {
        return false;
      } else {
        this.setData({
          current: value
        })
        this.triggerEvent('change', value)
      }
    }
  }
})
