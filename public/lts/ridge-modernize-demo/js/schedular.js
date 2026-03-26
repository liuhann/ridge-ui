export default {
  name: 'Scheduler',
  state: () => {
    return {
      form: { // 新增计划表单
        content: '', // 计划内容
        tags: [], // 标签
        deadline: '', // 计划截至时间
      }
    }
  }
}