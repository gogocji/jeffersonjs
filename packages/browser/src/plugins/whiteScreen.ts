import { BrowserEventTypes } from '../../../shared/src/browser'
import { BasePluginType } from '../../../types/src/index'
import { BrowserClient } from '../browserClient'
import { getTimestamp, getLocationHref, _global } from '../../../utils/src/index'
import { openWhiteScreen } from '../../../utils/src/whiteScreen'

const whiteScreenPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.WHITESCREEN,
  monitor(notify) {
    openWhiteScreen((res) => {
      // 获取白屏信息
      notify(BrowserEventTypes.WHITESCREEN, res)
    }, this.options)
  },
  transform(whiteScreenStatus: string) {
    return {
      type: BrowserEventTypes.WHITESCREEN,
      url: getLocationHref(),
      time: getTimestamp(),
      whiteScreenStatus
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  consumer(this: BrowserClient, whiteScreenData: any) {
    // 如果没有白屏就不上报。
    if (whiteScreenData.whiteScreenStatus.status == 'ok') return
    this.transport.send(whiteScreenData)
  }
}

export default whiteScreenPlugin
