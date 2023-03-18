import { ToStringTypes } from '../../shared/src/index'
import { toStringValidateOption, _support } from '../../utils/src/index'
import { ReportDataType } from '../../types/src/index'
import { BaseTransport } from '../../core/src/index'
import { WxOptionsFieldsTypes } from './types'

export class WxTransport extends BaseTransport<WxOptionsFieldsTypes> {
  configReportWxRequest: unknown
  useImgUpload = false
  constructor(options: Partial<WxOptionsFieldsTypes> = {}) {
    super()
    super.bindOptions(options)
    this.bindOptions(options)
  }
  post(data: any, url: string) {
    const requestFun = (): void => {
      let requestOptions = { method: 'POST' } as WechatMiniprogram.RequestOption
      if (typeof this.configReportWxRequest === 'function') {
        const params = this.configReportWxRequest(data)
        // default method
        requestOptions = { ...requestOptions, ...params }
      }
      requestOptions = {
        ...requestOptions,
        data: JSON.stringify(data),
        url
      }
      wx.request(requestOptions)
    }
    this.queue.addTask(requestFun)
  }
  sendToServer(data: any, url: string) {
    return this.post(data, url)
  }
  getTransportData(data: ReportDataType) {
    return {
      authInfo: this.getAuthInfo(),
      data,
      deviceInfo: _support.deviceInfo
    }
  }
  bindOptions(options: WxOptionsFieldsTypes = {}) {
    const { configReportWxRequest } = options
    toStringValidateOption(configReportWxRequest, 'configReportWxRequest', ToStringTypes.Function) &&
      (this.configReportWxRequest = configReportWxRequest)
  }
}
