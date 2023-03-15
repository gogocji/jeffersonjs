const instance = MITO.init({
  debug: true,
  apikey: 'clf8z0qq00001tlg4alomxvzm',
  silentConsole: true,
  silentXhr: false,
  maxBreadcrumbs: 10,
  dsn: 'http://localhost:2021/errors/upload',
  throttleDelayTime: 0,
  enableTraceId: true,
  configReportXhr(xhr, reportData) {
    xhr.setRequestHeader('mito-header', 'test123')
  },
  // 注意：要写入userId
  backTrackerId() {
    // Test: 写死数据
    return "clf91172o000xtllsh7sed0el"
  },
})
window._MITO_ = instance
