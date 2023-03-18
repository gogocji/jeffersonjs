import { BrowserBreadcrumbTypes, BrowserEventTypes, ErrorTypes } from '../../../shared/src/index'
import { extractErrorStack, getLocationHref, getTimestamp, isError, on, Severity, unknownToString, _global } from '../../../utils/src/index'
import { BasePluginType, HttpTransformedType, ReportDataType } from '../../../types/src/index'
import { BrowserClient } from '../browserClient'
import { addBreadcrumbInBrowser } from '../utils'

const name = BrowserEventTypes.UNHANDLEDREJECTION
const unhandlerejectionPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name,
  monitor(notify) {
    on(_global, name, function (ev: PromiseRejectionEvent) {
      // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
      notify(name, ev)
    })
  },
  transform(collectedData: PromiseRejectionEvent) {
    let data: ReportDataType = {
      type: ErrorTypes.PROMISE,
      message: unknownToString(collectedData.reason),
      url: getLocationHref(),
      name: collectedData.type,
      time: getTimestamp(),
      level: Severity.Low
    }
    if (isError(collectedData.reason)) {
      data = {
        ...data,
        ...extractErrorStack(collectedData.reason, Severity.Low)
      }
    }
    return data
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async consumer(this: BrowserClient, transformedData: HttpTransformedType) {
    const breadcrumbStack = await addBreadcrumbInBrowser.call(
      this,
      transformedData,
      BrowserBreadcrumbTypes.UNHANDLEDREJECTION,
      Severity.Error
    )
    this.transport.send(transformedData, breadcrumbStack, true)
    // 清空breadcrumb
    this.breadcrumb.clear()
  }
}

export default unhandlerejectionPlugin
