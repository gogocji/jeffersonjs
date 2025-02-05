export * from './types'
import { BrowserClient } from './browserClient'
import { BrowserOptionsFieldsTypes } from './types'
import fetchPlugin from './plugins/fetch'
import xhrPlugin from './plugins/xhr'
import domPlugin from './plugins/dom'
import errorPlugin from './plugins/error'
import hashRoutePlugin from './plugins/hashRoute'
import historyRoutePlugin from './plugins/historyRoute'
import consolePlugin from './plugins/console'
import unhandlerejectionPlugin from './plugins/unhandlerejecttion'
import { BasePluginType } from '../../types/src/index'
import performancePlugin from './plugins/performance'
import whiteScreenPlugin from './plugins/whiteScreen'
import rrwebPlugin from './plugins/rrweb'
function createBrowserInstance(options: BrowserOptionsFieldsTypes = {}, plugins: BasePluginType[] = []) {
  const browserClient = new BrowserClient(options)
  const browserPlugins = [
    fetchPlugin,
    xhrPlugin,
    domPlugin,
    errorPlugin,
    hashRoutePlugin,
    historyRoutePlugin,
    consolePlugin,
    unhandlerejectionPlugin,
    performancePlugin,
    whiteScreenPlugin,
    rrwebPlugin
  ]
  browserClient.use([...browserPlugins, ...plugins])
  return browserClient
}

const init = createBrowserInstance
export { createBrowserInstance, init, BrowserClient }
