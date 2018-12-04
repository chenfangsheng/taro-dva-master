
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { IndexProps, IndexState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

@connect(({ index }) => ({
  ...index,
}))

class Index extends Component<IndexProps, IndexState> {
  config: Config = {
    navigationBarTitleText: 'Taro + dva demo'
  }
  constructor(props: IndexProps) {
    super(props)
    this.state = {
      month: 0,
      day: 0
    }
  }

  // 获取今日数据
  async getData(month: number, day: number) {
    await this.props.dispatch({
      type: 'index/getLists',
      payload: {
        month: month,
        day: day
      }
    })
  }

  // 获取系统当前时间并请求参数
  getDate() {
    const myDate = new Date()
    const m = myDate.getMonth() + 1
    const d = myDate.getDate()
    this.setState({
      month: m,
      day: d
    })
    this.getData(m, d)
  }

  componentDidMount() {
    this.getDate()
  }

  render() {
    const { month, day } = this.state
    const { data } = this.props
    return (
      <View className='fx-index-wrap'>
        <View className='index-topbar'>
          <Text>{`${month}月${day}日`}</Text>
          <View>历史上的今天都发生了这些大事</View>
        </View>
        <View className='index-list'>
          {
            data && data.map((item, index) => {
              return <View className='index-li' key={index}>
                <View className='index-bg' style={`background-image: url(${item.pic})`}></View>
                <View className='index-info'>
                  <View className='index-title'>{item.title}</View>
                  <View className='index-des'>{item.des}</View>
                </View>
              </View>
            })
          }
        </View>
      </View>
    )
  }
}

export default Index
