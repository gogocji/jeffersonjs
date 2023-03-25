const instance = MITO.init({
  debug: true,
  apikey: 'clfmon9tk0002tldw7ezjfjsh',
  silentConsole: true,
  silentXhr: false,
  maxBreadcrumbs: 10,
  dsn: 'http://localhost:2021/errors/upload',
  throttleDelayTime: 0,
  enableTraceId: true,
  skeletonProject: true, // 项目是否有骨架屏
  // whiteBoxElements: ['html', 'body', '#app', '#root'], // 白屏
  silentRecordScreen: false,
  configReportXhr(xhr, reportData) {
    xhr.setRequestHeader('mito-header', 'test123')
  },
  // 注意：要写入userId
  backTrackerId() {
    // Test: 写死数据
    return "clfmon5nv0000tldwmpio5szb"
  },
})
window._MITO_ = instance
