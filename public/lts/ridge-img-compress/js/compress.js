export default {
  name: 'ImageCompress',
  externals: ['jszip/dist/jszip.min.js'],
  state: {
    inputFiles: [], // 用户选择的原始文件列表
    inputFileDetail: [], // 原始文件详细信息（会包含处理后的数据）
    outputFiles: [], // 处理后的文件列表
    outputFileDetail: [], // 处理后的文件详细信息
    compressConfig: { // 压缩配置
      quality: 0.7, // 压缩质量 (0-1)
      scaleMode: 'ratio', // 缩放模式: 'ratio' | 'dimension'
      ratio: 50, // 缩放比例百分比 (1-100)
      dimensionMode: 'fixed', // 尺寸模式: 'fixed' | 'width' | 'height'
      fixedWidth: 800, // 固定宽度
      fixedHeight: 600 // 固定高度
    },
    scaleModes: [{
      label: '按比例',
      value: 'ratio'
    }, {
      label: '按尺寸',
      value: 'dimension'
    }],
    dimensionModes: [{
      label: '指定宽高',
      value: 'fixed'
    }, {
      label: '宽度固定',
      value: 'width'
    }, {
      label: '高度固定',
      value: 'height'
    }],
    processProgress: 0, // 整体处理进度百分比
    currentProcessing: -1, // 当前正在处理的文件索引
    processingStatus: '', // 当前处理状态文本
    globalStatus: { // 全局状态信息
      phase: 'idle', // 当前阶段: 'idle' | 'parsing' | 'processing' | 'completed' | 'error'
      overallProgress: 0, // 整体进度 (0-100)
      phaseProgress: 0, // 当前阶段进度 (0-100)
      message: '等待操作', // 状态消息
      currentFile: -1, // 当前处理的文件索引
      currentFileName: '', // 当前处理的文件名
      totalFiles: 0, // 文件总数
      processedFiles: 0, // 已处理文件数
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      elapsedTime: 0 // 已用时间(秒)
    }
  },

  computed: {
    fileName: scope => scope.item.name, // 文件名称
    originalSize: scope => scope.item.formattedSize, // 原始大小
    originalPx: scope => scope.item.width + 'x' + scope.item.height, // 原始像素
    compressedPx: scope => scope.item.compressed ? (scope.item.compressedWidth + 'x' + scope.item.compressedHeight) : '', // 压缩后像素
    compressionRatio: scope => scope.item.compressed ? scope.item.compressionRatio * 100 : '', // 压缩百分比
    compressionRatioText: scope => scope.item.compressed ? (Math.floor(scope.item.compressionRatio * 100) + '%') : '', // 压缩百分比文本
    compressedFormattedSize: scope => scope.item.compressed ? scope.item.compressedFormattedSize : '' // 压缩后大小
  },
  actions: {
    // 格式化文件大小（转换为B/K/M/G）
    formatFileSize (size) {
      if (size < 1024) {
        return `${size.toFixed(2)} B`
      } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} K`
      } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} M`
      } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} G`
      }
    },

    // 更新全局状态
    updateGlobalStatus (phase, progress, message, currentFile = -1, currentFileName = '') {
      const globalStatus = this.state.globalStatus
      const now = new Date()

      // 初始化开始时间
      if (phase === 'parsing' && !globalStatus.startTime) {
        globalStatus.startTime = now
      }

      // 更新状态
      globalStatus.phase = phase
      globalStatus.phaseProgress = progress
      globalStatus.message = message
      globalStatus.currentFile = currentFile
      globalStatus.currentFileName = currentFileName

      // 计算整体进度 (解析阶段占40%, 处理阶段占60%)
      if (phase === 'parsing') {
        globalStatus.overallProgress = Math.round(progress * 0.4)
      } else if (phase === 'processing') {
        globalStatus.overallProgress = 40 + Math.round(progress * 0.6)
      } else if (phase === 'completed') {
        globalStatus.overallProgress = 100
        globalStatus.endTime = now
        globalStatus.elapsedTime = Math.round((now - globalStatus.startTime) / 1000)
      }

      // 更新状态文本
      this.state.processingStatus = message
    },

    // 提取输入图片信息（顺序处理）
    extractInputImageInfo (files) {
      return new Promise((resolve, reject) => {
        const totalFiles = files.length
        if (totalFiles === 0) {
          this.updateGlobalStatus('completed', 100, '没有选择文件')
          resolve([])
          return
        }

        // 初始化全局状态
        this.state.globalStatus.totalFiles = totalFiles
        this.state.globalStatus.processedFiles = 0
        this.updateGlobalStatus('parsing', 0, `开始解析 ${totalFiles} 个文件`, 0)

        const details = []
        let currentIndex = 0

        // 顺序处理函数
        const processNextFile = () => {
          if (currentIndex >= totalFiles) {
            // 所有文件处理完成
            this.updateGlobalStatus('parsing', 100, `文件解析完成，准备处理 ${totalFiles} 个文件`)
            this.state.globalStatus.processedFiles = totalFiles
            this.state.inputFileDetail = details
            resolve(details)
            return
          }

          const file = files[currentIndex]
          this.updateGlobalStatus('parsing', (currentIndex / totalFiles) * 100, `正在解析: ${file.name}`, currentIndex, file.name)

          const reader = new FileReader()

          reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
              // 格式化原始文件大小
              const formattedSize = this.formatFileSize(file.size)

              // 构建图片详细信息对象
              const detail = {
                id: currentIndex,
                name: file.name,
                type: file.type,
                size: file.size,
                formattedSize,
                width: img.width,
                height: img.height,
                originalFile: file,
                previewUrl: URL.createObjectURL(file),
                // 处理相关字段（初始值）
                processing: false,
                progress: 0,
                compressed: false,
                compressedSize: 0,
                compressedFormattedSize: '',
                compressedWidth: 0,
                compressedHeight: 0,
                compressionRatio: 0 // 压缩比率（越小压缩越多）
              }

              details.push(detail)
              this.state.globalStatus.processedFiles = currentIndex + 1

              // 更新进度
              currentIndex++
              const progress = (currentIndex / totalFiles) * 100
              this.updateGlobalStatus('parsing', progress, `已解析 ${currentIndex}/${totalFiles} 个文件`, currentIndex - 1, file.name)

              // 处理下一个文件
              processNextFile()
            }

            img.onerror = (err) => {
              this.updateGlobalStatus('error', (currentIndex / totalFiles) * 100, `解析文件 ${file.name} 失败: ${err.message}`, currentIndex, file.name)
              reject(err)
            }

            img.src = e.target.result
          }

          reader.onerror = (err) => {
            this.updateGlobalStatus('error', (currentIndex / totalFiles) * 100, `读取文件 ${file.name} 失败: ${err.message}`, currentIndex, file.name)
            reject(err)
          }

          reader.readAsDataURL(file)
        }

        // 开始处理第一个文件
        processNextFile()
      })
    },

    // 批量调整图片大小（顺序处理）
    resizeImages () {
      return new Promise((resolve, reject) => {
        const {
          quality,
          scaleMode,
          ratio,
          dimensionMode,
          fixedWidth,
          fixedHeight
        } = this.state.compressConfig

        const inputDetails = this.state.inputFileDetail
        const totalFiles = inputDetails.length

        if (totalFiles === 0) {
          this.updateGlobalStatus('completed', 100, '没有可处理的文件')
          resolve({ details: [], inputDetails: [] })
          return
        }

        // 重置进度
        this.state.processProgress = 0
        this.state.globalStatus.processedFiles = 0
        this.updateGlobalStatus('processing', 0, `开始处理 ${totalFiles} 个文件`, 0)

        const details = []
        let currentIndex = 0

        // 顺序处理函数
        const processNextFile = () => {
          if (currentIndex >= totalFiles) {
            // 所有文件处理完成
            this.updateGlobalStatus('completed', 100, `处理完成，共处理 ${totalFiles} 个文件`)
            this.state.globalStatus.processedFiles = totalFiles
            this.state.outputFileDetail = details
            this.state.outputFiles = details.map(d => d.compressedFile)
            resolve({
              details,
              inputDetails: this.state.inputFileDetail
            })
            return
          }

          const detail = inputDetails[currentIndex]
          this.updateGlobalStatus('processing', (currentIndex / totalFiles) * 100, `准备处理: ${detail.name}`, currentIndex, detail.name)

          // 标记开始处理当前文件
          detail.processing = true
          detail.progress = 0
          this.state.currentProcessing = currentIndex

          const img = new Image()

          img.onload = () => {
            // 更新进度：图片加载完成（10%）
            detail.progress = 10
            this.updateGlobalStatus('processing', ((currentIndex * 100) + 10) / totalFiles, `加载图片: ${detail.name}`, currentIndex, detail.name)

            let width = img.width
            let height = img.height

            // 计算新尺寸（30%进度）
            if (scaleMode === 'ratio') {
              const scale = ratio / 100
              width = Math.round(width * scale)
              height = Math.round(height * scale)
            } else {
              switch (dimensionMode) {
                case 'fixed':
                  width = fixedWidth
                  height = fixedHeight
                  break
                case 'width':
                  const widthRatio = fixedWidth / width
                  height = Math.round(height * widthRatio)
                  width = fixedWidth
                  break
                case 'height':
                  const heightRatio = fixedHeight / height
                  width = Math.round(width * heightRatio)
                  height = fixedHeight
                  break
              }
            }

            // 更新进度：尺寸计算完成（30%）
            detail.progress = 30
            this.updateGlobalStatus('processing', ((currentIndex * 100) + 30) / totalFiles, `计算尺寸: ${detail.name}`, currentIndex, detail.name)

            // 创建canvas并绘制调整后的图片
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = width
            canvas.height = height

            ctx.drawImage(img, 0, 0, width, height)

            // 更新进度：绘制完成（60%）
            detail.progress = 60
            this.updateGlobalStatus('processing', ((currentIndex * 100) + 60) / totalFiles, `处理图片: ${detail.name}`, currentIndex, detail.name)

            // 将canvas内容转换为Blob
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  this.updateGlobalStatus('error', ((currentIndex * 100) + 80) / totalFiles, `转换图片失败: ${detail.name}`, currentIndex, detail.name)
                  detail.processing = false
                  reject(new Error('Failed to create blob from canvas'))
                  return
                }

                // 计算压缩比率（新大小/原始大小）
                const compressionRatio = blob.size / detail.size

                // 构建处理后的文件详细信息
                const outputDetail = {
                  id: detail.id,
                  name: detail.name,
                  type: blob.type,
                  size: blob.size,
                  formattedSize: this.formatFileSize(blob.size),
                  width,
                  height,
                  compressedFile: new File([blob], detail.name, { type: blob.type }),
                  previewUrl: URL.createObjectURL(blob),
                  compressionRatio
                }

                // 更新原始文件详情，添加处理后的数据
                Object.assign(detail, {
                  processing: false,
                  progress: 100,
                  compressed: true,
                  compressedSize: blob.size,
                  compressedFormattedSize: outputDetail.formattedSize,
                  compressedWidth: width,
                  compressedHeight: height,
                  compressionRatio,
                  compressedPreviewUrl: outputDetail.previewUrl
                })

                details.push(outputDetail)
                this.state.globalStatus.processedFiles = currentIndex + 1

                // 更新整体进度
                currentIndex++
                const progress = (currentIndex / totalFiles) * 100
                this.updateGlobalStatus('processing', progress, `已处理 ${currentIndex}/${totalFiles} 个文件`, currentIndex - 1, detail.name)

                // 处理下一个文件
                processNextFile()
              },
              detail.type,
              quality
            )
          }

          img.onerror = (err) => {
            detail.processing = false
            this.updateGlobalStatus('error', ((currentIndex * 100) + 20) / totalFiles, `加载图片失败: ${detail.name}`, currentIndex, detail.name)
            reject(err)
          }

          img.src = detail.previewUrl
        }

        // 开始处理第一个文件
        processNextFile()
      })
    },

    /**
     * 1. 单独下载压缩后的图片
     * @param {number} index - 图片在inputFileDetail中的索引
     */
    downloadCompressedImage (scope) {
      const index = scope.i
      return new Promise((resolve, reject) => {
        const detail = this.state.inputFileDetail[index]
        if (!detail || !detail.compressed) {
          reject(new Error('图片未压缩或索引不存在'))
          return
        }

        // 创建下载链接
        const link = document.createElement('a')
        link.href = detail.compressedPreviewUrl
        link.download = detail.name // 使用原始文件名下载

        // 模拟点击下载
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        resolve({
          success: true,
          filename: detail.name,
          size: detail.compressedSize
        })
      })
    },

    /**
     * 批量打包下载所有压缩后的图片（ZIP格式）
     * 注意：需通过构建工具的externals配置引入JSZip
     */
    batchDownloadCompressedImages () {
      return new Promise((resolve, reject) => {
        const compressedFiles = this.state.inputFileDetail.filter(d => d.compressed)
        if (compressedFiles.length === 0) {
          reject(new Error('没有可下载的压缩文件'))
          return
        }

        // 从全局环境中获取JSZip（通过externals引入）
        const JSZip = window.JSZip
        if (!JSZip) {
          reject(new Error('JSZip库未加载，请确保通过externals配置正确引入'))
          return
        }

        // 更新状态
        this.updateGlobalStatus('processing', 0, `准备打包 ${compressedFiles.length} 个文件`)

        const zip = new JSZip()
        const imageFolder = zip.folder('compressed-images')

        let completedFiles = 0

        // 逐个添加文件到ZIP
        compressedFiles.forEach((detail, idx) => {
          fetch(detail.compressedPreviewUrl)
            .then(response => response.blob())
            .then(blob => {
              return new Promise((res) => {
                const reader = new FileReader()
                reader.onload = () => res(reader.result)
                reader.readAsArrayBuffer(blob)
              })
            })
            .then(arrayBuffer => {
              imageFolder.file(detail.name, arrayBuffer)

              completedFiles++
              const progress = (completedFiles / compressedFiles.length) * 100
              this.updateGlobalStatus('processing', progress, `正在打包: ${completedFiles}/${compressedFiles.length}`, idx, detail.name)

              if (completedFiles === compressedFiles.length) {
                this.updateGlobalStatus('processing', 90, '正在生成ZIP文件')

                zip.generateAsync({ type: 'blob' }, (metadata) => {
                  // 更新ZIP生成进度
                  const progress = 90 + (metadata.percent / 10)
                  this.updateGlobalStatus('processing', progress, `生成ZIP: ${metadata.percent.toFixed(0)}%`)
                })
                  .then(content => {
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(content)
                    link.download = `compressed-images-${new Date().getTime()}.zip`

                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(link.href)

                    this.updateGlobalStatus('completed', 100, `ZIP打包完成，共 ${compressedFiles.length} 个文件`)

                    resolve({
                      success: true,
                      fileCount: compressedFiles.length,
                      zipSize: this.formatFileSize(content.size)
                    })
                  })
                  .catch(err => {
                    this.updateGlobalStatus('error', 100, `ZIP打包失败: ${err.message}`)
                    reject(err)
                  })
              }
            })
            .catch(err => {
              this.updateGlobalStatus('error', 100, `添加文件到ZIP失败: ${err.message}`)
              reject(err)
            })
        })
      })
    }
  }
}
