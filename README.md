## AntDesign Pro in Taro

注意：请使用AntDesign 及 AntDesign Pro 相关的组件，不要使用Taro内置的组件。另外@tarojs/taro 一般只需要用到生命周期及路由切换的api。

### 代码规范

* 默认集成了 prettier eslint stylelint 解决编码规范问题
* 默认集成了 commitlint commitizen 解决commit规范问题
* 默认集成了 husky lint-staged 解决了commit之前自动校验代码规范

### 开发效率

* 使用Unite库以空间换时间的方案加快研发速度，同时保证TS类型安全
* action层使用@antmjs/rapper实现根据TS类型自动生成action逻辑，保证类型安全
* action层也可以使用yarn swagger自动根据服务端的swagger api 自动生成action逻辑，保证类型安全
* 自动埋点
* 自动收集异常
* 自动处理异常
* 快速支持事件抖动

## 使用
1. 执行yarn rapper自动生成action层代码(需要的话)
2. 执行yarn swagger自动根据服务端swagger api生成action层代码(需要的话)
3. yarn
4. yarn watch

## 如果需要添加告警机制

1. 将_antm.config.js 改成 antm.config.js
2. 更新antm.config.js里面的webhooks.url的access_token
3. 将.husky/pre-commit里面的npx antm-warning webhooks 注释取消
