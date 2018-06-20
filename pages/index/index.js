const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}



Page({

  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市',
      },
      success: res => {
        let result = res.data.result;
        this.setNow(result);
        this.setHour(result);
        this.setToday(result);
      },
      complete:()=>{
        callback&&callback();
      }
    })
  },

  onLoad(){
    this.getNow();    
  },
  data: {
    temp: '14°',
    nowweather: '阴天',
    nowWeatherBackGround:"",
    itemList:"",
    todayDate:"",
    todayTemp:"",
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh();
    });
  },

  setNow(result) {
    let tmp = result.now.temp;
    let weather = result.now.weather;

    this.setData({
      temp: tmp + "℃",
      nowweather: weatherMap[weather],
      nowWeatherBackGround: '/images/' + weather + '-bg.png',
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    });
  },

  setHour(result){
    let forcase = result.forecast;
    let itemList = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < 24; i += 3) {
      itemList.push({
        time: (i + nowHour) % 24 + '时',
        iconPath: "/images/" + forcase[i / 3].weather + "-icon.png",
        temp: forcase[i / 3].temp + "℃",
      })
    }
    itemList[0].time = "现在";
    this.setData({
      itemList: itemList
    });
  },
  setToday(result){
    let today = result.today;
    let date = new Date();
    this.setData({
      todayTemp:`${today.minTemp}° - ${today.maxTemp}°`,
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`
    })
  }
},

)
