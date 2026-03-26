
export default {
  name: 'WebsiteDocument',
  state: {
    docTree: [
      {
        "label": "基本使用",
        "children": [
          {
            "label": "使用编辑器",
            "value": "/docs/using-editor.md"
          },
          {
            "label": "应用分发及运行",
            "value": "/docs/publish-use-app.md"
          },
          {
            "label": "社区版下载及安装",
            "value": "/docs/download.md"
          }
        ]
      },
      {
        "label": "页面开发入门",
        "children": [
          {
            "label": "第一个页面",
            "value": "/docs/tutorial/hello-world.md"
          },
          {
            "label": "数据连接及交互",
            "value": "/docs/tutorial/data-connect.md"
          },
          {
            "label": "了解布局类组件",
            "value": "/docs/tutorial/container.md"
          },
          {
            "label": "实例: 表单验证",
            "value": "/docs/tutorial/form-validate.md"
          },
          {
            "label": "应用样式和效果",
            "value": "/docs/tutorial/styling.md"
          },
          {
            "label": "使用列表容器",
            "value": "/docs/tutorial/list-container.md"
          },
          {
            "label": "使用布局切换容器",
            "value": "/docs/tutorial/switch.md"
          },
          {
            "label": "位置预留：配置对话框",
            "value": "/docs/tutorial/slot.md"
          },
          {
            "label": "页面即组件",
            "value": "/docs/tutorial/composite.md"
          }
        ]
      },
      {
        "label": "代码开发手册",
        "children": [{
          "label": "页面脚本开发入门",
          "value": "/docs/10-minutes-script.md"
        }, {
          "label": "页面组件开发入门",
          "value": "/docs/10-minutes-component.md"
        }]
      }
    ],
    name: '/docs/using-editor.md' // 默认地址
  },

  async setup () {
    if (location.search) {
      const usp = new URLSearchParams(window.location.search)
      const docPath = usp.get('doc')

      if (docPath) {
        this.name = docPath
      }
    }
  },

  destory () {
  },

  watch: {
  },

  actions: {
   
  }
}
