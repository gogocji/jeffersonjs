本项目fork mito项目https://github.com/mitojs/mitojs，进行二次开发

👋 mitojs原本功能
✔️ 🔨 监控xhr、fetch、wx.request
✔️ 🔨 监控console、wx.console
✔️ 🔨 监控路由跳转（hash路由、history路由、wx路由）
✔️ 🔨 监控代码报错、资源加载错误
✔️ 🔨 监控click、wx:tab、touchmove
✔️ 👌 丰富的hooks与配置项支持可高定制化 基础配置
✔️ 👌 支持Web(>= IE8) @mitojs/browser
✔️ 👌 支持框架Vue3、Vue2.6@mitojs/vue、React@latest@mitojs/react
✔️ 👌 支持原生微信小程序、支持uni-app等微信小程序框架 @mitojs/wx-mini

👋 一次开发v1版本添加功能 & 修复功能
✔️ 🔨 修改请求方式为graphql（使用apollo-client实现）
✔️ 🔨 异常上报之后清空面包屑，面包屑长度超过10个之后会直接上报面包屑并清空面包屑