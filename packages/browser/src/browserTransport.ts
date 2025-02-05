import { MethodTypes, ToStringTypes } from '../../shared/src/index'
import { BrowserOptionsFieldsTypes } from './types'
import { safeStringify, toStringValidateOption } from '../../utils/src/index'
import { ReportDataType } from '../../types/src/index'
import { BaseTransport } from '../../core/src/index'
import { gql } from '@apollo/client'
import graphQLClient from './apolloClient'
import { _support } from '../../utils/src/global'

export class BrowserTransport extends BaseTransport<BrowserOptionsFieldsTypes> {
  configReportXhr: unknown
  useImgUpload = false
  constructor(options: BrowserOptionsFieldsTypes = {}) {
    super()
    super.bindOptions(options)
    this.bindOptions(options)
  }
  post(data: any, url: string) {
    const requestFun = (): void => {
      const xhr = new XMLHttpRequest()
      xhr.open(MethodTypes.Post, url)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xhr.withCredentials = true
      if (typeof this.configReportXhr === 'function') {
        this.configReportXhr(xhr, data)
      }
      // xhr.send(safeStringify(data))
      try {
        graphQLClient.mutate({
          mutation: gql`
            mutation webReport($query: SdkReportRawDataInput!) {
              webReport(query: $query)
            }
          `,
          variables: {
            query: {
              authInfo: data.authInfo as string,
              breadcrumb: data.breadcrumb as string,
              data: data.data as string,
              record: data?.record as string,
              deviceInfo: _support.browserDeviceInfo
            }
          }
        })
      } catch (error) {
        console.error('使用apollo client调用graphql请求异常：', error)
      }
    }
    this.queue.addTask(requestFun)
  }
  imgRequest(data: any, url: string): void {
    const requestFun = () => {
      let img = new Image()
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
      img.src = `${url}${spliceStr}data=${encodeURIComponent(safeStringify(data))}`
      img = null
    }
    this.queue.addTask(requestFun)
  }
  sendToServer(data: any, url: string) {
    // 开启录屏
    if (!_support.browserOptions.silentRecordScreen) {
      if (_support.browserOptions.recordScreenTypeList.includes(data?.data.type)) {
        // 修改hasError
        _support.hasError = true
        data.data.recordScreenId = _support.recordScreenId
      }
    }
    return this.useImgUpload ? this.imgRequest(data, url) : this.post(data, url)
  }
  getTransportData(data: ReportDataType) {
    return {
      authInfo: this.getAuthInfo(),
      data
    }
  }
  bindOptions(options: BrowserOptionsFieldsTypes = {}) {
    const { configReportXhr, useImgUpload } = options
    toStringValidateOption(configReportXhr, 'configReportXhr', ToStringTypes.Function) && (this.configReportXhr = configReportXhr)
    toStringValidateOption(useImgUpload, 'useImgUpload', ToStringTypes.Boolean) && (this.useImgUpload = useImgUpload)
  }
}
