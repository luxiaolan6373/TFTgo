const scripts = [
    'js/common.js', // 公共函数
    'js/set5_request.js', // 接口请求函数
    'js/set5_dom.js', // document结构列表
    'js/set5_main.js' // 主业务逻辑
]
window.set5Data = {}
window.dom = {}
for (let index = 0; index < scripts.length; index++) {
    let js = document.createElement('script')
    js.src = scripts[index]
    document.body.appendChild(js)
}