function isAncestor (parentElement, childElement) {
  if (!parentElement || !childElement) {
    return false  
    }

  // 使用 parentNode 或者 parentElement 属性遍历 DOM 树
  let parent = childElement.parentNode || childElement.parentElement  
  
    // 当 parent 为 null 时，表示我们已经到达了 DOM 树的顶部，但仍然没有找到匹配的 parentElement  
    while (parent) {
    if (parent === parentElement) {
      return true  
        }
    parent = parent.parentNode || parent.parentElement  
    }

  return false  
}

export {
  isAncestor
}
