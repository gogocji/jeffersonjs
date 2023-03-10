const instance = MITO.init({
  debug: true,
  apikey: '1',
  silentConsole: true,
  silentXhr: false,
  maxBreadcrumbs: 10,
  dsn: 'http://localhost:2021/errors/upload',
  throttleDelayTime: 0,
  enableTraceId: true,
  configReportXhr(xhr, reportData) {
    xhr.setRequestHeader('mito-header', 'test123')
  }
})
window._MITO_ = instance
