/**
 * 进行taro的处理 
 * 1.方法的改写
 * 2.utils的挂载
 * 
 */
import Taro, { Component } from "@tarojs/taro";
import { SHAREINFO } from '../config/index'

/**
 * navigateTo 超过8次之后 强行进行redirectTo 否则会造成页面卡死
 * 
 */
const nav = Taro.navigateTo
Taro.navigateTo = (data) => {
  if (Taro.getCurrentPages().length > 8) {
    return Taro.redirectTo(data)
  }
  return nav(data)
}


/**
 * Component挂载分享方法
 */
Component.prototype.onShareAppMessage = function () {
  return SHAREINFO
}