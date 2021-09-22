import { Breadcrumb, BaseClient } from '@mitojs/core'
import {
  BrowserBreadcrumbTypes,
  BrowserEventTypes,
  ErrorTypes,
  EventTypes,
  MitoLog,
  MitoLogEmptyMsg,
  MitoLogEmptyTag
} from '@mitojs/shared'
import {
  extractErrorStack,
  firstStrtoUppercase,
  getBreadcrumbCategoryInBrowser,
  getCurrentRoute,
  getTimestamp,
  isError,
  Severity,
  unknownToString
} from '@mitojs/utils'
import { LogTypes, TrackReportDataType } from '@mitojs/types'
import { WxOptions } from './wxOptions'
import { WxTransport } from './wxTransport'
import { WxOptionsFieldsTypes } from './types'

export class WxClient extends BaseClient<WxOptionsFieldsTypes, EventTypes> {
  transport: WxTransport
  options: WxOptions
  breadcrumb: Breadcrumb<WxOptionsFieldsTypes>
  constructor(options: WxOptionsFieldsTypes = {}) {
    super(options)
    this.options = new WxOptions(options)
    this.transport = new WxTransport(options)
    this.breadcrumb = new Breadcrumb(options)
  }
  /**
   * 判断当前插件是否启用，用于browser的option
   *
   * @param {BrowserEventTypes} name
   * @return {*}
   * @memberof BrowserClient
   */
  isPluginEnable(name: BrowserEventTypes): boolean {
    const silentField = `silent${firstStrtoUppercase(name)}`
    return !this.options[silentField]
  }
  log(data: LogTypes) {
    const { message = MitoLogEmptyMsg, tag = MitoLogEmptyTag, level = Severity.Critical, ex = '' } = data
    let errorInfo = {}
    if (isError(ex)) {
      errorInfo = extractErrorStack(ex, level)
    }
    const reportData = {
      type: ErrorTypes.LOG,
      level,
      message: unknownToString(message),
      name: MitoLog,
      customTag: unknownToString(tag),
      time: getTimestamp(),
      url: getCurrentRoute(),
      ...errorInfo
    }
    const breadcrumbStack = this.breadcrumb.push({
      type: BrowserBreadcrumbTypes.CUSTOMER,
      category: getBreadcrumbCategoryInBrowser(BrowserBreadcrumbTypes.CUSTOMER),
      data: message,
      level: Severity.fromString(level.toString())
    })
    this.transport.send(reportData, breadcrumbStack)
  }

  /**
   * 埋点信息发送
   *
   * @param {TrackReportDataType} trackData
   * @memberof WxClient
   */
  trackSend(trackData: TrackReportDataType): void {
    this.transport.send(
      {
        isTrack: true,
        ...trackData
      },
      this.breadcrumb.getStack()
    )
  }
}
