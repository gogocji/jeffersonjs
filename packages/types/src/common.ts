import { Severity } from '../../utils/src/index'
import { HttpCollectedType } from './http'

export type voidFun = () => void

export interface IAnyObject {
  [key: string]: any
}

export interface ResourceErrorTarget {
  src?: string
  href?: string
  localName?: string
}

export interface MITOXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any
  httpCollect?: HttpCollectedType
}

export interface ErrorStack {
  args: any[]
  func: string
  column: number
  line: number
  url: string
}

export interface WxParsedErrorType {
  message: string
  name: string
  stack: ErrorStack[]
}

export type TNumStrObj = number | string | object

export interface LocalStorageValue<T = any> {
  expireTime?: number
  value: T | string
}

export interface LogTypes {
  message?: TNumStrObj
  tag?: TNumStrObj
  level?: Severity
  ex?: Error | any
}

export interface BrowserDeviceInfo {
  /***小程序 */
  //网络类型: 4g,3g,5g,wifi
  netType?: string
  clientWidth?: number
  clientHeight?: number
  // 像素密度倍率(计算屏幕实际宽高 可使用此参数： 例 height = clientHeight * radio)
  ratio?: number

  /***浏览器 */
  // 浏览器版本号 107.0.0.0
  browser_version?: string
  // Chrome
  browser?: string
  // 电脑系统 10
  os_version?: string
  // Windows
  os?: string
  //  User Agent
  ua?: string
  //  设备
  device?: string
  // 设备类型
  device_type?: string
}
