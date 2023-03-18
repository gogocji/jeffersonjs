import { BrowserBreadcrumbTypes } from '../../shared/src/index'
import { getBreadcrumbCategoryInBrowser, Severity } from '../../utils/src/index'
import { BrowserClient } from './browserClient'
import { BrowserTransport } from './browserTransport'

export async function addBreadcrumbInBrowser(
  this: BrowserClient,
  data: any,
  type: BrowserBreadcrumbTypes,
  level = Severity.Info,
  params: any = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transport: BrowserTransport = new BrowserTransport()
) {
  const breadcrumbStack = await this.breadcrumb.push({
    type,
    data,
    category: getBreadcrumbCategoryInBrowser(type),
    level,
    ...params
  })
  // 面包屑超过十个就上报
  if (breadcrumbStack.length >= 10) {
    try {
      await this.transport.send({}, breadcrumbStack)
      this.breadcrumb.clear()
      return []
    } catch (error) {
      console.log('面包屑上报失败')
    }
  }
  return breadcrumbStack
}
