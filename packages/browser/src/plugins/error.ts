import { BrowserBreadcrumbTypes, BrowserEventTypes, ErrorTypes, ERROR_TYPE_RE } from '../../../shared/src/index'
import { extractErrorStack, getLocationHref, getTimestamp, interceptStr, isError, on, Severity, _global } from '../../../utils/src/index'
import { BasePluginType, ReportDataType } from '../../../types/src/index'
import { BrowserClient } from '../browserClient'
import { addBreadcrumbInBrowser } from '../utils'

export interface ResourceErrorTarget {
  src?: string
  href?: string
  localName?: string
}

const errorPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.ERROR,
  monitor(notify) {
    on(
      _global,
      'error',
      function (e: ErrorEvent) {
        notify(BrowserEventTypes.ERROR, e)
      },
      true
    )
  },
  transform(errorEvent: ErrorEvent) {
    const target = errorEvent.target as ResourceErrorTarget
    if (target.localName) {
      // resource error
      return resourceTransform(errorEvent.target as ResourceErrorTarget)
    }
    // code error
    return codeErrorTransform(errorEvent)
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async consumer(this: BrowserClient, transformedData: ReportDataType) {
    const type = transformedData.type === ErrorTypes.RESOURCE ? BrowserBreadcrumbTypes.RESOURCE : BrowserBreadcrumbTypes.CODE_ERROR
    const breadcrumbStack = await addBreadcrumbInBrowser.call(this, transformedData, type, Severity.Error)
    this.transport.send(transformedData, breadcrumbStack, true)
    // 清空breadcrumb
    this.breadcrumb.clear()
  }
}

const resourceMap = {
  img: '图片',
  script: 'JS脚本'
}

function resourceTransform(target: ResourceErrorTarget) {
  return {
    type: ErrorTypes.RESOURCE,
    url: getLocationHref(),
    message: '资源地址: ' + (interceptStr(target.src, 120) || interceptStr(target.href, 120)),
    level: Severity.Low,
    time: getTimestamp(),
    name: `${resourceMap[target.localName] || target.localName}加载失败`
  }
}

function codeErrorTransform(errorEvent: ErrorEvent) {
  const { message, filename, lineno, colno, error } = errorEvent
  let result: ReportDataType
  if (error && isError(error)) {
    result = extractErrorStack(error, Severity.Normal)
  }
  result || (result = handleNotErrorInstance(message, filename, lineno, colno))
  result.type = ErrorTypes.JAVASCRIPT
  return result
}

function handleNotErrorInstance(message: string, filename: string, lineno: number, colno: number) {
  let name: string | ErrorTypes = ErrorTypes.UNKNOWN
  const url = filename || getLocationHref()
  let msg = message
  const matches = message.match(ERROR_TYPE_RE)
  if (matches[1]) {
    name = matches[1]
    msg = matches[2]
  }
  const element = {
    url,
    func: ErrorTypes.UNKNOWN_FUNCTION,
    args: ErrorTypes.UNKNOWN,
    line: lineno,
    col: colno
  }
  return {
    url,
    name,
    message: msg,
    level: Severity.Normal,
    time: getTimestamp(),
    stack: [element]
  }
}
export default errorPlugin
