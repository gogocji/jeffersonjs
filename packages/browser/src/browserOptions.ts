import { BaseOptions } from '../../core/src/index'
import { ToStringTypes } from '../../shared/src/index'
import { validateOptionsAndSet } from '../../utils/src/index'
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
  constructor(options: BrowserOptionsFieldsTypes) {
    super()
    super.bindOptions(options)
    this.bindOptions(options)
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
      whiteBoxElements
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
      [whiteBoxElements, 'whiteBoxElements', ToStringTypes.Array]
    ]
    validateOptionsAndSet.call(this, optionArr)
  }
}
