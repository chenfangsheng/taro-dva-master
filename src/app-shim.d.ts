/**
 *
 * @author asheng
 * @static 添加taro等自定义类型
 * @interface Component
 */
import Taro, { Component } from '@tarojs/taro'

// 在Component上定义自定义方法类型
declare module '@tarojs/taro' {
  interface Component {
    $api: any
  }
}

//声明
declare var require: any
declare var dispach: any