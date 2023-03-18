import { record } from 'rrweb';
import { BrowserEventTypes } from '../../../shared/src/index'
import { BasePluginType } from '../../../types/src/index'
import { BrowserClient } from '../browserClient'
import { getTimestamp, getLocationHref, _global, _support, generateUUID } from '../../../utils/src/index'
import { zip } from '../utils';

const rrwebPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.RECORDSCREEN,
  monitor(notify) {
    // 存储录屏信息
    try {
      // 存储录屏信息
      let events = [];
      // 调用stopFn停止录像
      record({
        emit(event, isCheckout) {
          if (isCheckout) {
            // 此段时间内发生错误，上报录屏信息
            if (_support.hasError) {
              const recordScreenId = _support.recordScreenId;
              _support.recordScreenId = generateUUID();
              notify(BrowserEventTypes.RECORDSCREEN, {
                recordScreenId,
                events: zip(events)
              })
              events = [];
              _support.hasError = false;
            } else {
              // 不上报，清空录屏
              events = [];
              _support.recordScreenId = generateUUID();
            }
          }
          events.push(event);
        },
        recordCanvas: true,
        // 默认每10s重新制作快照
        checkoutEveryNms: 1000 * this.options.recordScreentime,
      });
    } catch (err) {
      console.log('录屏报错:', err);
    }
  },
  transform(recordScreenData: any) {
    return {
      type: BrowserEventTypes.RECORDSCREEN,
      url: getLocationHref(),
      time: getTimestamp(),
      recordScreenData,
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  consumer(this: BrowserClient, recordScreenData: any) {
    this.transport.send(recordScreenData)
  }
}

export default rrwebPlugin
