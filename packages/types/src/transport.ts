import { ErrorTypes } from '../../shared/src/index'
import { BreadcrumbPushData } from './breadcrumb'
import { HttpTransformedType } from './http'
import { DeviceInfo } from './wx'

/**
 * SDK版本信息、apikey、trackerId
 *
 * @export
 * @interface AuthInfo
 */
export interface AuthInfo {
  apikey?: string
  sdkVersion: string
  sdkName: string
  trackerId?: string
}

export interface TransportDataType {
  authInfo?: AuthInfo
  breadcrumb?: BreadcrumbPushData[]
  data?: ReportDataType
  record?: any[]
  deviceInfo?: DeviceInfo
}

export interface BaseTransformType {
  type?: ErrorTypes
  message?: string
  time?: number
  name?: string
  level?: string
  url: string
}

export interface PerformanceDataType {
  // 指标名
  name?: string
  // 速率（poor、fast等）
  rating?: string
  // 指标值
  value?: string
}

export interface ReportDataType extends Partial<HttpTransformedType> {
  stack?: any
  errorId?: number
  // vue
  componentName?: string
  propsData?: any
  // logError 手动报错 MITO.log
  customTag?: string
  // performance
  // 性能指标名（比如FCP）
  performanceData?: PerformanceDataType
}
