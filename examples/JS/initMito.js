const instance = MITO.init({
  debug: true,
  apikey: 'clf9e42r40004tlpom1u8ggx3',
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
    return "clf9e3tcg0000tlpofanyndi8"
  },
})
window._MITO_ = instance
