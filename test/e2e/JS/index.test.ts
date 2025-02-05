import {
  BREADCRUMBCATEGORYS,
  BrowserBreadcrumbTypes,
  ErrorTypes,
  HttpTypes,
  MethodTypes,
  MitoLog,
  SDK_NAME,
  SDK_VERSION
} from '@jfsonjs/shared'
import puppeteer from 'puppeteer'
import { BreadcrumbPushData, ReportDataType, TransportDataType } from '@jfsonjs/types'
import { SpanStatus, Severity } from '@mitojs/utils'
import { ServerUrls } from '../../../examples/server/config'
import { jsUrl } from '@/test/config'
import { BrowserClient } from '@jfsonjs/browser'

describe('Native JS e2e:', () => {
  const timeout = 3000
  let page: puppeteer.Page
  let browser: puppeteer.Browser
  const uploadRequestHandles = []
  const finishedRequestHandles = []
  async function getStack() {
    return await page.evaluate(() => {
      return (window['_MITO_'] as BrowserClient).breadcrumb.getStack()
    })
  }
  beforeEach(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    // print console
    // page.on('console', (msg) => {
    //   for (let i = 0; i < msg.args().length; ++i) console.log(`${i}: ${msg.args()[i]}`)
    // })
    await page.goto(jsUrl)
    page.on('request', (request) => {
      if (request.url().includes(ServerUrls.errorsUpload) && uploadRequestHandles.length > 0) {
        uploadRequestHandles.shift()(request)
      }
    })
    page.on('requestfinished', (request) => {
      if (finishedRequestHandles.length > 0) {
        finishedRequestHandles.shift()(request)
      }
    })
  })

  afterEach(async () => {
    browser.close()
  })

  afterAll(() => {
    browser.close()
  })
  it(
    'Code Error btn click，breadcrumb stack should add two and upload this error',
    async () => {
      const interceptRequest = (request: puppeteer.Request) => {
        const { authInfo, data } = JSON.parse(request.postData()) as TransportDataType
        expect((data as ReportDataType).type).toBe(ErrorTypes.JAVASCRIPT)
        expect((data as ReportDataType).level).toBe(Severity.Normal)
        expect(Array.isArray((data as ReportDataType).stack)).toBeTruthy()
        expect(authInfo.sdkName).toBe(SDK_NAME)
        expect(authInfo.sdkVersion).toBe(SDK_VERSION)
      }
      uploadRequestHandles.push(interceptRequest)
      await page.click('#codeErr')

      const stack = await getStack()
      // click
      expect(stack[0].type).toBe(BrowserBreadcrumbTypes.CLICK)
      expect(stack[0].category).toBe(BREADCRUMBCATEGORYS.USER)
      expect(stack[0].level).toBe(Severity.Info)
      // code error
      expect(stack[1].type).toBe(BrowserBreadcrumbTypes.CODE_ERROR)
      expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
      expect(stack[1].level).toBe(Severity.Error)
      expect(stack.length).toBe(2)
    },
    timeout
  )

  it(
    'a normal get XHR request，breadcrumb stack should add one',
    (done) => {
      async function requestfinishedHandle(request: puppeteer.Request) {
        if (request.method() === MethodTypes.Get && request.url().includes(ServerUrls.normalGet)) {
          const stack = await getStack()
          expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.HTTP)
          expect(stack[1].type).toBe(BrowserBreadcrumbTypes.XHR)
          expect(stack[1].level).toBe(Severity.Info)
          expect((stack[1].data as ReportDataType).message).toBe(SpanStatus.Ok)
          expect((stack[1].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
          expect((stack[1].data as ReportDataType).request.method).toBe(MethodTypes.Get)
          expect((stack[1].data as ReportDataType).request.url).toBe(ServerUrls.normalGet)
        }
        done()
      }
      finishedRequestHandles.push(requestfinishedHandle)
      page.click('#normalReq')
    },
    timeout
  )

  it(
    'a exception get XHR request，breadcrumb stack should add two and upload this error',
    (done) => {
      async function requestfinishedHandle(request: puppeteer.Request) {
        // if (request.method() === MethodTypes.Get && request.url().includes('/exception')) {
        const stack = await getStack()
        expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.HTTP)
        expect(stack[1].type).toBe(BrowserBreadcrumbTypes.XHR)
        expect(stack[1].level).toBe(Severity.Info)
        expect((stack[1].data as ReportDataType).message).toBe(`${SpanStatus.InternalError} ${ServerUrls.exceptionGet}`)
        expect((stack[1].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
        expect((stack[1].data as ReportDataType).request.method).toBe(MethodTypes.Get)
        expect((stack[1].data as ReportDataType).request.url).toBe(ServerUrls.exceptionGet)

        expect(stack[2].category).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
        expect(stack[2].type).toBe(BrowserBreadcrumbTypes.XHR)
        expect(stack[2].level).toBe(Severity.Error)
        expect((stack[2].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
        expect((stack[2].data as ReportDataType).message).toBe(`${SpanStatus.InternalError} ${ServerUrls.exceptionGet}`)
        expect((stack[2].data as ReportDataType).request.method).toBe(MethodTypes.Get)
        expect((stack[2].data as ReportDataType).request.url).toBe(ServerUrls.exceptionGet)
        done()
        // }
      }
      finishedRequestHandles.push(requestfinishedHandle)
      function interceptedRequest(request: puppeteer.Request) {
        const { authInfo, data } = JSON.parse(request.postData()) as TransportDataType
        expect((data as ReportDataType).type).toBe(ErrorTypes.HTTP)
        expect((data as ReportDataType).level).toBe(Severity.Low)
        expect(authInfo.sdkName).toBe(SDK_NAME)
        expect(authInfo.sdkVersion).toBe(SDK_VERSION)
      }
      uploadRequestHandles.push(interceptedRequest)
      page.click('#exceptionReq')
    },
    timeout
  )

  it(
    'a normal post fetch request，breadcrumb stack should add one',
    (done) => {
      async function requestfinishedHandle() {
        const stack = await getStack()
        expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.HTTP)
        expect(stack[1].type).toBe(BrowserBreadcrumbTypes.FETCH)
        expect(stack[1].level).toBe(Severity.Info)
        expect((stack[1].data as ReportDataType).message).toBe(`${SpanStatus.Ok}`)
        expect((stack[1].data as ReportDataType).request.httpType).toBe(HttpTypes.FETCH)
        expect((stack[1].data as ReportDataType).request.method).toBe(MethodTypes.Post)
        expect((stack[1].data as ReportDataType).request.url).toBe(ServerUrls.normalPost)
        done()
      }
      finishedRequestHandles.push(requestfinishedHandle)
      page.click('#normalFetch')
    },
    timeout
  )

  it(
    'a exception post fetch request，breadcrumb stack should add two and upload this error',
    (done) => {
      async function requestfinishedHandle() {
        const stack = await getStack()
        expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.HTTP)
        expect(stack[1].type).toBe(BrowserBreadcrumbTypes.FETCH)
        expect(stack[1].level).toBe(Severity.Info)
        expect((stack[1].data as ReportDataType).message).toBe(`${SpanStatus.InternalError} ${ServerUrls.exceptionPost}`)
        expect((stack[1].data as ReportDataType).request.httpType).toBe(HttpTypes.FETCH)
        expect((stack[1].data as ReportDataType).request.method).toBe(MethodTypes.Post)
        expect((stack[1].data as ReportDataType).request.url).toBe(ServerUrls.exceptionPost)

        expect(stack[2].category).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
        expect(stack[2].type).toBe(BrowserBreadcrumbTypes.FETCH)
        expect(stack[2].level).toBe(Severity.Error)
        expect((stack[2].data as ReportDataType).request.httpType).toBe(HttpTypes.FETCH)
        expect((stack[2].data as ReportDataType).message).toBe(`${SpanStatus.InternalError} ${ServerUrls.exceptionPost}`)
        expect((stack[2].data as ReportDataType).request.method).toBe(MethodTypes.Post)
        expect((stack[2].data as ReportDataType).request.data).toBe(JSON.stringify({ test: '测试请求体' }))
        expect((stack[2].data as ReportDataType).request.url).toBe(ServerUrls.exceptionPost)
        done()
      }
      finishedRequestHandles.push(requestfinishedHandle)
      function interceptedRequest(request: puppeteer.Request) {
        const { data } = JSON.parse(request.postData()) as TransportDataType
        expect((data as ReportDataType).type).toBe(ErrorTypes.HTTP)
        expect((data as ReportDataType).level).toBe(Severity.Low)
      }
      uploadRequestHandles.push(interceptedRequest)
      page.click('#exceptionFetch')
    },
    timeout
  )

  it(
    'manual report，breadcrumb should add one and upload this error',
    async (done) => {
      async function interceptedRequest(request: puppeteer.Request) {
        const stack = await getStack()
        expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.DEBUG)
        expect(stack[1].type).toBe(BrowserBreadcrumbTypes.CUSTOMER)
        expect(stack[1].level).toBe(Severity.Error)
        const { data } = JSON.parse(request.postData()) as TransportDataType
        expect((data as ReportDataType).customTag).toBe('测试')
        expect((data as ReportDataType).name).toBe(MitoLog)
        expect((data as ReportDataType).type).toBe(ErrorTypes.LOG)
        expect((data as ReportDataType).level).toBe(Severity.Critical)
        expect((data as ReportDataType).message).toBe(JSON.stringify({ one: 111 }))
        done()
      }
      uploadRequestHandles.push(interceptedRequest)
      await page.click('#logUpload')
    },
    timeout
  )

  it(
    'promiseError，breadcrumb should add one and upload this error',
    async (done) => {
      async function interceptedRequest(request: puppeteer.Request) {
        const stack = await getStack()
        expect(stack[1].category).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
        expect(stack[1].type).toBe(BrowserBreadcrumbTypes.UNHANDLEDREJECTION)
        expect(stack[1].level).toBe(Severity.Error)
        const { data } = JSON.parse(request.postData()) as TransportDataType
        expect((data as ReportDataType).name).toBe('unhandledrejection')
        expect((data as ReportDataType).type).toBe(ErrorTypes.PROMISE)
        expect((data as ReportDataType).level).toBe(Severity.Low)
        expect((data as ReportDataType).message).toBe('promise reject')
        done()
      }
      uploadRequestHandles.push(interceptedRequest)
      await page.click('#promiseError')
    },
    timeout
  )
})
