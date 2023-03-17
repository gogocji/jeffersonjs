import { BrowserEventTypes } from '@jfsonjs/shared'
import { BasePluginType, PerformanceDataType, ReportDataType } from '@jfsonjs/types'
import { BrowserClient } from '../browserClient'
import { getWebVitals, getTimestamp, getLocationHref, _global } from '@jfsonjs/utils'

const performancePlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.PERFORMANCE,
  monitor(notify) {
    // 获取FCP、LCP、TTFB、FID等指标
    getWebVitals((res) => {
      // name指标名称、rating 评级、value数值
      console.log('res', res)
      notify(BrowserEventTypes.PERFORMANCE, res)
    })
  },
  transform(performanceData: PerformanceDataType) {
    return {
      type: BrowserEventTypes.PERFORMANCE,
      url: getLocationHref(),
      time: getTimestamp(),
      performanceData: {
        name: performanceData.name,
        rating: performanceData.rating,
        value: performanceData.value
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  consumer(this: BrowserClient, performanceData: ReportDataType) {
    console.log('performanceData', performanceData)
    this.transport.send(performanceData)
  }
}

export default performancePlugin
