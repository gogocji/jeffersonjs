import { Severity } from '../../utils/src/index'
import { ReportDataType } from './transport'
import { TNumStrObj } from './common'
import { BREADCRUMBCATEGORYS, BreadcrumbTypes } from '../../shared/src/index'
import { ConsoleCollectType, RouteChangeCollectType } from './basePluginType'

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes
  // string for click dom
  data: ReportDataType | RouteChangeCollectType | ConsoleCollectType | TNumStrObj
  /**
   * 分为user action、debug、http、
   */
  category?: BREADCRUMBCATEGORYS
  time?: number
  level: Severity
}
