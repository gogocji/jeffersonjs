const instance = MITO.init({
  debug: true,
  apikey: 'clfbyu3s60002tl4o2wzlfl2i',
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
    return "clfbytq160000tl4o9c7se2of"
  },
})
window._MITO_ = instance
