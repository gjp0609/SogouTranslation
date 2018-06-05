chrome.contextMenus.create({
    title: '使用搜狗翻译',
    contexts: ['selection'],
    onclick: function (params) {
        chrome.tabs.create({url: 'http://fanyi.sogou.com/?fr=common_index_nav_pc&ie=utf8&keyword=&p=40051205#auto/zh-CHS/' + encodeURI(params.selectionText)});
    }
});