import { BaseOptionsFieldsIntegrationType } from '../../types/src/index'

export interface BrowserOptionsFieldsTypes
  extends BrowsersilentOptionsType,
    BaseOptionsFieldsIntegrationType,
    BrowserOptionsHooksType,
    BrowserWhiteScreenOptionsType,
    BrowserRecordScreenOptionsType {
  /**
   * 默认为false，默认是xhr的上报方式，
   * 为true时，则使用img上报的方式，会在dsn后面追加data=encodeURIComponent(reportData)，在服务端接受时需要decodeURIComponent
   */
  useImgUpload?: boolean
}

/**
 *browser silent event types
 *
 * @interface BrowsersilentOptionsType
 */
export interface BrowsersilentOptionsType {
  /**
   * 默认会监控xhr，为true时，将不再监控
   */
  silentXhr?: boolean
  /**
   * 默认会监控fetch，为true时，将不再监控
   */
  silentFetch?: boolean
  /**
   * 默认会监控console，为true时，将不再监控
   */
  silentConsole?: boolean
  /**
   * 默认会监听click事件，当用户点击的标签不是body时就会被放入breadcrumb，为true，将不在监听
   */
  silentDom?: boolean
  /**
   * 默认会监控popstate、pushState、replaceState，为true时，将不再监控
   */
  silentHistory?: boolean
  /**
   * 默认会监控hashchange，为true时，将不在监控
   */
  silentHashchange?: boolean
  /**
   * 默认会监控error，为true时，将不在监控
   */
  silentError?: boolean
  /**
   * 默认会监控unhandledrejection，为true时，将不在监控
   */
  silentUnhandledrejection?: boolean
}

export interface BrowserOptionsHooksType {
  /**
   * 钩子函数，配置发送到服务端的xhr
   * 可以对当前xhr实例做一些配置：xhr.setRequestHeader()、xhr.withCredentials
   *
   * @param {XMLHttpRequest} xhr XMLHttpRequest的实例
   * @param {*} reportData 上报的数据
   * @memberof BrowserOptionsHooksType
   */
  configReportXhr?(xhr: XMLHttpRequest, reportData: any): void
}

export interface BrowserWhiteScreenOptionsType {
  // 页面中是否有骨架屏
  skeletonProject?: boolean

  // 容器列表，默认值为['html', 'body', '#app', '#root']
  whiteBoxElements?: string[]

  // 是否开启白屏检测
  silentWhiteScreen?: boolean
}

export interface BrowserRecordScreenOptionsType {
  // 单次录屏时常，默认是10s
  recordScreentime?: number

  // 是否开启录屏
  silentRecordScreen?: boolean

  // 录屏事件集合
  recordScreenTypeList?: string[]
}
