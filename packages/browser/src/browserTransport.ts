import { MethodTypes, ToStringTypes } from '@mitojs/shared'
import { BrowserOptionsFieldsTypes } from './types'
import { safeStringify, toStringValidateOption } from '@mitojs/utils'
import { ReportDataType } from '@mitojs/types'
import { BaseTransport } from '@mitojs/core'
import { gql } from '@apollo/client'
import graphQLClient from './apolloClient'

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
              deviceInfo: data?.deviceInfo as string
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
