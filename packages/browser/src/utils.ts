import { BrowserBreadcrumbTypes } from '../../shared/src/index'
import { getBreadcrumbCategoryInBrowser, Severity } from '../../utils/src/index'
import { BrowserClient } from './browserClient'
import { BrowserTransport } from './browserTransport'
import { Base64 } from 'js-base64'
import pako from 'pako'

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
  // if (breadcrumbStack.length >= 10) {
  //   try {
  //     await this.transport.send({}, breadcrumbStack)
  //     this.breadcrumb.clear()
  //     return []
  //   } catch (error) {
  //     console.log('面包屑上报失败')
  //   }
  // }
  return breadcrumbStack
}

// 压缩
export function zip(data) {
  if (!data) return data
  // 判断数据是否需要转为JSON
  const dataJson = typeof data !== 'string' && typeof data !== 'number' ? JSON.stringify(data) : data
  // 使用Base64.encode处理字符编码，兼容中文
  const str = Base64.encode(dataJson as string)
  const binaryString = pako.gzip(str)
  const arr = Array.from(binaryString)
  let s = ''
  arr.forEach((item: number) => {
    s += String.fromCharCode(item)
  })
  return Base64.btoa(s)
}
