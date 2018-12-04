import Taro, { Component, Config } from "@tarojs/taro"
import "@tarojs/async-await"
import { Provider } from "@tarojs/redux"
import "./config/taroConfig"
import "./utils/request"
import Index from "./pages/index"
import dva from './utils/dva'
import models from './models'
import './app.scss'
import { globalData } from "./utils/common"

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});

const store = dvaApp.getStore();

class App extends Component {
  config: Config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  /**
   *
   *  1.小程序打开的参数 globalData.extraData.xx
   *  2.从二维码进入的参数 globalData.extraData.xx
   *  3.获取小程序的设备信息 globalData.systemInfo
   * @memberof App
   */
  async componentDidMount() {
    // 获取参数
    const referrerInfo = this.$router.params.referrerInfo
    const query = this.$router.params.query
    !globalData.extraData && (globalData.extraData = {})
    if (referrerInfo && referrerInfo.extraData) {
      globalData.extraData = referrerInfo.extraData
    }
    if (query) {
      globalData.extraData = {
        ...globalData.extraData,
        ...query
      }
    }

    // 获取设备信息
    const sys = await Taro.getSystemInfo()
    sys && (globalData.systemInfo = sys)
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
