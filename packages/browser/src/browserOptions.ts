import { BaseOptions } from '../../core/src/index'
import { ErrorTypes, ToStringTypes } from '../../shared/src/index'
import { validateOptionsAndSet, _support } from '../../utils/src/index'
import { BrowserOptionsFieldsTypes } from './types'

export class BrowserOptions extends BaseOptions<BrowserOptionsFieldsTypes> {
  /**
   * 静默监控xhr事件
   */
  silentXhr: boolean
  /**
   * 静默监控fetch事件
   */
  silentFetch: boolean
  /**
   * 静默监控console事件
   */
  silentConsole: boolean
  /**
   * 静默监控Dom事件
   */
  silentDom: boolean
  /**
   * 静默监控history事件
   */
  silentHistory: boolean
  /**
   * 静默监控error事件
   */
  silentError: boolean
  /**
   * 静默监控unhandledrejection事件
   */
  silentUnhandledrejection: boolean
  /**
   * 静默监控hashchange事件
   */
  silentHashchange: boolean
  useImgUpload: boolean
  configReportXhr: unknown = null
  // 项目是否有骨架屏
  skeletonProject: boolean
  // 白屏监控容器列表，默认值为['html', 'body', '#app', '#root']
  whiteBoxElements: string[]
  recordScreentime: number
  silentWhiteScreen: boolean
  silentRecordScreen: boolean
  recordScreenTypeList: string[]
  constructor(options: BrowserOptionsFieldsTypes) {
    super()
    // 初始化options
    options = initOption(options)
    // bindOptions
    super.bindOptions(options)
    this.bindOptions(options)
    _support.browserOptions = options
  }
  bindOptions(options: BrowserOptionsFieldsTypes) {
    const {
      silentXhr,
      silentFetch,
      silentConsole,
      silentDom,
      silentHistory,
      silentError,
      silentHashchange,
      silentUnhandledrejection,
      useImgUpload,
      configReportXhr,
      skeletonProject,
      whiteBoxElements,
      silentWhiteScreen,
      recordScreentime,
      silentRecordScreen,
      recordScreenTypeList
    } = options
    const booleanType = ToStringTypes.Boolean
    const optionArr = [
      [silentXhr, 'silentXhr', booleanType],
      [silentFetch, 'silentFetch', booleanType],
      [silentConsole, 'silentConsole', booleanType],
      [silentDom, 'silentDom', booleanType],
      [silentHistory, 'silentHistory', booleanType],
      [silentError, 'silentError', booleanType],
      [silentHashchange, 'silentHashchange', booleanType],
      [silentUnhandledrejection, 'silentUnhandledrejection', booleanType],
      [useImgUpload, 'useImgUpload', booleanType],
      [configReportXhr, 'configReportXhr', ToStringTypes.Function],
      [skeletonProject, 'skeletonProject', booleanType],
      [whiteBoxElements, 'whiteBoxElements', ToStringTypes.Array],
      [recordScreentime, 'recordScreentime', ToStringTypes.Number],
      [silentWhiteScreen, 'silentWhiteScreen', booleanType],
      [silentRecordScreen, 'silentRecordScreen', booleanType],
      [recordScreenTypeList, 'recordScreenTypeList', ToStringTypes.Array]
    ]
    validateOptionsAndSet.call(this, optionArr)
  }
}

function initOption(options) {
  if (!options.recordScreenTypeList) {
    // 录屏类型
    options.recordScreenTypeList = [
      ErrorTypes.HTTP,
      ErrorTypes.LOG,
      ErrorTypes.REACT,
      ErrorTypes.VUE,
      ErrorTypes.JAVASCRIPT,
      ErrorTypes.RESOURCE,
      ErrorTypes.PROMISE,
      ErrorTypes.ROUTE,
      ErrorTypes.UNKNOWN,
      ErrorTypes.UNKNOWN_FUNCTION
    ]
  }
  // 白屏检测的父容器列表
  if (!options.whiteBoxElements) {
    options.whiteBoxElements = ['html', 'body', '#app', '#root']
  }
  // 录屏时长
  if (!options.recordScreentime) {
    options.recordScreentime = 10
  }
  return options
}
