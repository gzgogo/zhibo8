//index.js
var LAST_TYPE_KEY = 'lastType';

var app = getApp()
Page({
  data: {
    currentType: null,
    gameTypes: [{
      key: 'NBA',
      name: 'NBA'
    }, {
      key: '世界杯',
      name: '世界杯'
    }, {
      key: 'basketball',
      name: '篮球'
    }, {
      key: 'football',
      name: '足球'
    }, {
      key: 'all',
      name: '全部'
    }],
    lives: [],
    liveMap: {}
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载数据'
    });

    var lastType = wx.getStorageSync(LAST_TYPE_KEY);
    this.setData({
      currentType: lastType || this.data.gameTypes[0]
    });

    this.fetchData(function () {
      wx.hideLoading();
    });
  },

  onPullDownRefresh: function() {
    this.fetchData(function() {
      wx.stopPullDownRefresh();
    });
  },

  onTypeChange: function(e) {
    var gameType = e.detail;
    this.setData({
      currentType: gameType
    });
    wx.setStorageSync(LAST_TYPE_KEY, gameType);

    // 埋点
    var app = getApp();
    app.aldstat.sendEvent('selectGamaType', {
      name: gameType.key
    }); 
  },

  onGameTap: function(e) {
    console.log('on game tap: ', e.currentTarget.dataset.url);
  },

  fetchData: function(cb) {
    var self = this;
    
    wx.request({
      url: 'https://7nlpua3m.qcloud.la/weapp/zhibo', //仅为示例，并非真实的接口地址
      success: function (res) {
        console.log(res.data);
        self.extract(res.data);
        wx.setStorageSync('data', res.data);

        typeof cb === 'function' && cb();
      },
      fail: function() {
        try {
          var value = wx.getStorageSync('data')
          if (value) {
            self.extract(res.data);
          }
        } catch (e) {

        }

        typeof cb === 'function' && cb();
      }
    })
  },

  extract(data) {
    var self = this;
    var map = {};    
    var gameTypes = this.data.gameTypes;

    gameTypes.forEach(function(gameType) {
      map[gameType.key] = self.extractByType(data, gameType);
    });

    console.log('map: %o', map);
    this.setData({
      livesMap: map
    });
  },

  extractByType(data, gameType) {
    var typeData = [];

    if (Array.isArray(data)) {
      data.forEach(function(item) {
        var live = {
          formatDate: item.formatDate,
          date: item.date,
          list: []
        };

        item.list.forEach(function(game) {
          if ([game.type, game.label].join().indexOf(gameType.key) > -1) {
            live.list.push(game)
          }
        })

        if (live.list.length > 0) {
          typeData.push(live);
        }
      })
    }

    return typeData;
  }
})
