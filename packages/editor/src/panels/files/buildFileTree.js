export const getFileTree = (files, each) => {
  const roots = files.filter(file => file.parent === -1).map(file => buildFileTree(file, null, files, each)).sort(sortFile)

  return roots
}

const sortFile = (a, b) => {
  if (a.type === 'directory' && b.type === 'directory') {
    return a.label > b.label ? 1 : -1
  } else if (a.type === 'directory') {
    return -1
  } else if (b.type === 'directory') {
    return 1
  } else {
    return a.label > b.label ? 1 : -1
  }
}

export const eachNode = async (files, callback) => {
  const result = []
  for (const file of files) {
    result.push(await callback(file))
    if (file.children) {
      await eachNode(file.children, callback)
    }
  }
  return result
}

/**
 * 树形结构扁平化（递归版，支持无限层级）
 * @param {Array} tree 树形数组
 * @returns {Array} 扁平化后的一维数组
 */
export const flattenTree = (tree) => {
  const result = []

  // 递归处理节点
  const traverse = (node) => {
    // 把当前节点推入结果（排除children，只保留自身属性）
    const { children, ...rest } = node
    result.push(rest)

    // 如果有子节点，继续递归
    if (children && children.length > 0) {
      children.forEach((child) => traverse(child))
    }
  }

  // 遍历整棵树
  tree.forEach((item) => traverse(item))

  return result
}

/**
 * 递归过滤树形结构数据，返回所有满足条件的节点（扁平化数组）
 * @param {Array} treeData - 输入的树形结构数组
 * @param {Function} filterCb - 过滤回调函数，接收当前节点作为参数，返回布尔值表示是否保留该节点
 * @returns {Array} 包含所有满足过滤条件的节点的扁平化数组
 */
export const filterTree = (treeData, filterCb) => {
  const result = []

  // 遍历当前层级的所有节点，递归处理子节点并收集符合条件的节点
  treeData.forEach(node => {
    if (node.children) {
      result.push(...filterTree(node.children, filterCb))
    }
    if (filterCb(node)) {
      result.push(node)
    }
  })
  return result
}

/**
 * 递归过滤树形结构数据，返回保持树形结构的结果
 * @param {Array} treeData - 输入的树形结构数组
 * @param {Function} filterCb - 过滤回调函数，接收当前节点作为参数，返回布尔值表示是否保留该节点
 * @returns {Array} 保持树形结构的过滤后数组
 */
export const filterTreeKeepStructure = (treeData, filterCb) => {
  const result = []

  treeData.forEach(node => {
    // 先递归过滤子节点
    let filteredChildren = []
    if (node.children) {
      filteredChildren = filterTreeKeepStructure(node.children, filterCb)
    }

    // 判断当前节点是否匹配
    const isMatch = filterCb(node)

    // 如果当前节点匹配，或者其子节点中有匹配项（需要保留路径），则保留该节点
    if (isMatch || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children
      })
    }
  })

  return result
}

export const mapTree = (treeData, map) => {
  const result = []

  treeData.forEach(node => {
    const mapped = map(Object.assign({}, node))
    if (mapped) {
      if (node.children) {
        mapped.children = mapTree(node.children, map)
      }
      result.push(mapped)
    }
  })
  return result
}

export const buildFileTree = (file, dir, files, each) => {
  const treeNode = {
    ...file
  }
  treeNode.path = (file.parent === -1) ? ('/' + file.name) : (dir.path + '/' + file.name)
  treeNode.parentNode = dir

  if (treeNode.type === 'directory') {
    const children = files.filter(item => item.parent === file.id)

    treeNode.children = children.map(child => buildFileTree(child, treeNode, files, each)).sort(sortFile)
  }
  // Object.freeze(treeNode)
  each && each(treeNode)
  return treeNode
}
