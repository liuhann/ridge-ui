// merge-meta-glob.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * 使用 glob 模式匹配所有 meta.json 文件并合并
 * @param {string} pattern - glob 模式
 * @param {string} outputFile - 输出文件路径
 */
async function mergeMetaJsonWithGlob(pattern, outputFile) {
  console.log(`🔍 搜索模式: ${pattern}`);
  
  // 使用 glob 查找文件
  glob(pattern, (err, files) => {
    if (err) {
      console.error('❌ 搜索文件时出错:', err.message);
      return;
    }
    
    if (files.length === 0) {
      console.log('❌ 未找到匹配的文件');
      return;
    }
    
    console.log(`📁 找到 ${files.length} 个文件:\n`);
    
    const mergedArray = [];
    let successCount = 0;
    let errorCount = 0;
    
    // 处理每个文件
    files.forEach((file, index) => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(content);
        
        // 添加文件信息
        const enhancedData = {
          ...data,
          _meta: {
            filePath: file,
            fileName: path.basename(file),
            dir: path.dirname(file)
          }
        };
        
        if (Array.isArray(data)) {
          // 如果文件内容是数组
          data.forEach((item, i) => {
            mergedArray.push({
              ...item,
              _meta: {
                filePath: file,
                index: i
              }
            });
          });
        } else {
          // 如果文件内容是对象
          mergedArray.push(enhancedData);
        }
        
        successCount++;
        console.log(`  [${index + 1}/${files.length}] ✓ ${file}`);
        
      } catch (error) {
        errorCount++;
        console.error(`  [${index + 1}/${files.length}] ✗ ${file}: ${error.message}`);
        
        mergedArray.push({
          _error: error.message,
          _meta: { filePath: file }
        });
      }
    });
    
    const packageJSON = fs.readFileSync('./package.json', 'utf8');
    const packageJSONObject = JSON.parse(packageJSON);


    // 写入输出文件
    fs.writeFileSync(outputFile, JSON.stringify({
      "name": packageJSONObject.name,
      "version": packageJSONObject.version,
      "schemaVersion": "2.0",
      "lastUpdated": new Date(),
      "generatedBy": "ridge-ui-cli",
      "components": mergedArray
    }, null, 2));
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 合并完成！');
    console.log(`📁 匹配文件: ${files.length} 个`);
    console.log(`✅ 成功解析: ${successCount} 个`);
    console.log(`❌ 解析失败: ${errorCount} 个`);
    console.log(`📄 输出文件: ${path.resolve(outputFile)}`);
    console.log(`📊 总记录数: ${mergedArray.length} 条`);
    console.log('='.repeat(50));
  });
}

// 安装 glob
console.log('需要先安装 glob 模块:');
console.log('npm install glob');
console.log('或');
console.log('yarn add glob\n');

// 使用示例
mergeMetaJsonWithGlob(
  '**/meta.json',           // 查找所有目录下的 meta.json
  './components-metadata.json'
);