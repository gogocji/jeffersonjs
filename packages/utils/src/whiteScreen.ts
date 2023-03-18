export const WHITE_SCREEN_STATUS = {
  ERROR: 'error',
  OK: 'ok'
}
/**
 * 检测页面是否白屏
 * @param {function} callback - 回到函数获取检测结果
 * @param {boolean} skeletonProject - 页面是否有骨架屏
 * @param {array} whiteBoxElements - 容器列表，默认值为['html', 'body', '#app', '#root']
 */
let _loopTimer: any
export function openWhiteScreen(callback, { skeletonProject, whiteBoxElements }) {
  // 轮询次数
  let _whiteLoopNum = 0
  // 一开始有骨架屏的时候采点数据
  const _skeletonInitList = [] // 存储初次采样点
  let _skeletonNowList = [] // 存储当前采样点

  // 项目有骨架屏
  if (skeletonProject) {
    if (document.readyState != 'complete') {
      sampling()
    }
  } else {
    // 页面加载完毕
    if (document.readyState === 'complete') {
      sampling()
    } else {
      window.addEventListener('load', sampling)
    }
  }

  // 选中dom点的名称
  function getSelector(element) {
    if (element.id) {
      return '#' + element.id
    } else if (element.className) {
      // div home => div.home
      return (
        '.' +
        element.className
          .split(' ')
          .filter((item) => !!item)
          .join('.')
      )
    } else {
      return element.nodeName.toLowerCase()
    }
  }
  // 判断采样点是否为容器节点
  function isContainer(element) {
    const selector = getSelector(element)
    if (skeletonProject) {
      _whiteLoopNum ? _skeletonNowList.push(selector) : _skeletonInitList.push(selector)
    }
    return whiteBoxElements.indexOf(selector) != -1
  }
  // 采样对比
  function sampling() {
    // 总共有17个采样点
    let emptyPoints = 0
    for (let i = 1; i <= 9; i++) {
      const xElements = document.elementsFromPoint((window.innerWidth * i) / 10, window.innerHeight / 2)
      const yElements = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight * i) / 10)
      if (isContainer(xElements[0])) emptyPoints++
      // 中心点只计算一次
      if (i != 5) {
        if (isContainer(yElements[0])) emptyPoints++
      }
    }

    // 页面正常渲染，停止轮训
    if (emptyPoints != 17) {
      if (skeletonProject) {
        // 第一次不比较（轮询一下，获取骨架屏消去的采样数据）
        if (!_whiteLoopNum) return openWhiteLoop()
        // 比较前后dom是否一致（如果有骨架屏，并且前后的采样点都一样的话，）
        if (_skeletonNowList.join() == _skeletonInitList.join())
          return callback({
            status: WHITE_SCREEN_STATUS.ERROR
          })
      }
      if (_loopTimer) {
        clearTimeout(_loopTimer)
        _loopTimer = null
      }
    } else {
      // 开启轮训
      if (!_loopTimer) {
        openWhiteLoop()
      }
    }
    // 17个点都是容器节点算作白屏
    callback({
      status: emptyPoints == 17 ? WHITE_SCREEN_STATUS.ERROR : WHITE_SCREEN_STATUS.OK
    })
  }
  // 开启白屏轮训
  function openWhiteLoop() {
    if (_loopTimer) return
    _loopTimer = setInterval(() => {
      if (skeletonProject) {
        _whiteLoopNum++
        _skeletonNowList = []
      }
      sampling()
    }, 3000)
  }
}
