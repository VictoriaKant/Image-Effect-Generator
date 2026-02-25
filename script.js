/**
 * Image Effect Generator - 图片效果生成器
 * 
 * 功能说明：
 * 1. 支持图片上传（点击和拖拽）
 * 2. 实现三种组合效果：灰度转换、倾斜切片、外围装饰
 * 3. 支持对比度和亮度调节
 * 4. 支持参数实时调节和预览
 * 5. 支持随机效果生成
 * 6. 支持高质量图片下载
 * 
 * @author Image Effect Generator
 * @version 3.0
 */

/**
 * 图片效果生成器主类
 * 负责管理整个应用的状态和功能
 */
class ImageEffectGenerator {
    /**
     * 构造函数
     * 初始化画布、DOM元素引用和事件监听器
     */
    constructor() {
        // 存储原始图片对象
        this.originalImage = null;
        // 获取Canvas元素和2D绑制上下文
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        // 获取占位符元素
        this.placeholder = document.getElementById('placeholder');
        // 初始化DOM元素引用
        this.initElements();
        // 初始化事件监听器
        this.initEventListeners();
        // 初始化标签页切换
        this.initTabs();
        // 初始化滑块显示值
        this.updateAllSliderValues();
        // 防抖定时器，用于实时预览
        this.debounceTimer = null;
    }

    /**
     * 初始化所有DOM元素引用
     * 将页面中的控件元素保存为实例属性，方便后续访问
     */
    initElements() {
        // 文件输入和上传区域
        this.fileInput = document.getElementById('fileInput');
        this.uploadArea = document.getElementById('uploadArea');
        
        // 操作按钮
        this.resetParamsBtn = document.getElementById('resetParamsBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // 灰度效果控件
        this.grayscale = document.getElementById('grayscale');
        this.grayscaleValue = document.getElementById('grayscaleValue');
        
        // 对比度亮度控件
        this.contrast = document.getElementById('contrast');
        this.contrastValue = document.getElementById('contrastValue');
        this.brightness = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightnessValue');
        
        // 背景颜色控件
        this.bgColor = document.getElementById('bgColor');
        
        // 切片效果控件
        this.sliceCount = document.getElementById('sliceCount');
        this.sliceCountValue = document.getElementById('sliceCountValue');
        this.sliceMinHeight = document.getElementById('sliceMinHeight');
        this.sliceMinHeightValue = document.getElementById('sliceMinHeightValue');
        this.sliceMaxHeight = document.getElementById('sliceMaxHeight');
        this.sliceMaxHeightValue = document.getElementById('sliceMaxHeightValue');
        this.sliceHeightRandom = document.getElementById('sliceHeightRandom');
        this.sliceHeightRandomValue = document.getElementById('sliceHeightRandomValue');
        this.sliceGap = document.getElementById('sliceGap');
        this.sliceGapValue = document.getElementById('sliceGapValue');
        this.sliceGapRandom = document.getElementById('sliceGapRandom');
        this.sliceGapRandomValue = document.getElementById('sliceGapRandomValue');
        this.tiltAngle = document.getElementById('tiltAngle');
        this.tiltAngleValue = document.getElementById('tiltAngleValue');
        this.tiltAngleRandom = document.getElementById('tiltAngleRandom');
        this.tiltAngleRandomValue = document.getElementById('tiltAngleRandomValue');
        
        // 切片宽度控件
        this.sliceMinWidth = document.getElementById('sliceMinWidth');
        this.sliceMinWidthValue = document.getElementById('sliceMinWidthValue');
        this.sliceMaxWidth = document.getElementById('sliceMaxWidth');
        this.sliceMaxWidthValue = document.getElementById('sliceMaxWidthValue');
        this.sliceWidthRandom = document.getElementById('sliceWidthRandom');
        this.sliceWidthRandomValue = document.getElementById('sliceWidthRandomValue');
        
        // 切角设计控件
        this.cornerFrequency = document.getElementById('cornerFrequency');
        this.cornerFrequencyValue = document.getElementById('cornerFrequencyValue');
        this.cornerFrequencyRandom = document.getElementById('cornerFrequencyRandom');
        this.cornerFrequencyRandomValue = document.getElementById('cornerFrequencyRandomValue');
        this.cornerSize = document.getElementById('cornerSize');
        this.cornerSizeValue = document.getElementById('cornerSizeValue');
        this.cornerSizeRandom = document.getElementById('cornerSizeRandom');
        this.cornerSizeRandomValue = document.getElementById('cornerSizeRandomValue');
        this.cornerTypeBtns = document.querySelectorAll('.corner-type-btn');
        this.cornerType = 'corner';
        
        // 边框设置控件
        this.borderEnabled = document.getElementById('borderEnabled');
        this.borderColor = document.getElementById('borderColor');
        this.borderWidth = document.getElementById('borderWidth');
        this.borderWidthValue = document.getElementById('borderWidthValue');
        this.borderWidthRandom = document.getElementById('borderWidthRandom');
        this.borderWidthRandomValue = document.getElementById('borderWidthRandomValue');
        this.borderLength = document.getElementById('borderLength');
        this.borderLengthValue = document.getElementById('borderLengthValue');
        this.borderLengthRandom = document.getElementById('borderLengthRandom');
        this.borderLengthRandomValue = document.getElementById('borderLengthRandomValue');
        this.borderOffset = document.getElementById('borderOffset');
        this.borderOffsetValue = document.getElementById('borderOffsetValue');
        
        // 装饰文字控件
        this.decorText = document.getElementById('decorText');
        this.textSize = document.getElementById('textSize');
        this.textSizeValue = document.getElementById('textSizeValue');
        this.textColor = document.getElementById('textColor');
        
        // 装饰线条控件
        this.lineWidth = document.getElementById('lineWidth');
        this.lineWidthValue = document.getElementById('lineWidthValue');
        this.lineColor = document.getElementById('lineColor');
        
        // 整体缩放控件
        this.scale = document.getElementById('scale');
        this.scaleValue = document.getElementById('scaleValue');
        this.scalePresets = document.querySelectorAll('.preset-btn');
    }

    /**
     * 初始化事件监听器
     * 绑定各种用户交互事件
     */
    initEventListeners() {
        // 上传区域点击事件
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        // 文件选择事件
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        // 拖拽事件
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // 按钮点击事件
        this.resetParamsBtn.addEventListener('click', () => this.resetParams());
        this.regenerateBtn.addEventListener('click', () => this.regenerateEffect());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        
        // 初始化滑块监听器（带实时预览）
        this.initSliderListeners();
    }

    /**
     * 初始化标签页切换功能
     */
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有激活状态
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // 添加当前激活状态
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });
    }

    /**
     * 初始化滑块监听器
     * 当滑块值改变时，更新显示值并触发实时预览
     */
    initSliderListeners() {
        // 定义所有滑块配置
        const sliders = [
            { el: this.grayscale, val: this.grayscaleValue, suffix: '%' },
            { el: this.contrast, val: this.contrastValue, suffix: '%' },
            { el: this.brightness, val: this.brightnessValue, suffix: '%' },
            { el: this.scale, val: this.scaleValue, suffix: '%' },
            { el: this.sliceCount, val: this.sliceCountValue, suffix: '' },
            { el: this.sliceMinHeight, val: this.sliceMinHeightValue, suffix: 'px' },
            { el: this.sliceMaxHeight, val: this.sliceMaxHeightValue, suffix: 'px' },
            { el: this.sliceHeightRandom, val: this.sliceHeightRandomValue, suffix: '%' },
            { el: this.sliceGap, val: this.sliceGapValue, suffix: 'px' },
            { el: this.sliceGapRandom, val: this.sliceGapRandomValue, suffix: '%' },
            { el: this.tiltAngle, val: this.tiltAngleValue, suffix: '°' },
            { el: this.tiltAngleRandom, val: this.tiltAngleRandomValue, suffix: '%' },
            { el: this.sliceMinWidth, val: this.sliceMinWidthValue, suffix: 'px' },
            { el: this.sliceMaxWidth, val: this.sliceMaxWidthValue, suffix: 'px' },
            { el: this.sliceWidthRandom, val: this.sliceWidthRandomValue, suffix: '%' },
            { el: this.cornerFrequency, val: this.cornerFrequencyValue, prefix: '每', suffix: '个' },
            { el: this.cornerFrequencyRandom, val: this.cornerFrequencyRandomValue, suffix: '%' },
            { el: this.cornerSize, val: this.cornerSizeValue, suffix: 'px' },
            { el: this.cornerSizeRandom, val: this.cornerSizeRandomValue, suffix: '%' },
            { el: this.borderWidth, val: this.borderWidthValue, suffix: 'px' },
            { el: this.borderWidthRandom, val: this.borderWidthRandomValue, suffix: '%' },
            { el: this.borderLength, val: this.borderLengthValue, suffix: '%' },
            { el: this.borderLengthRandom, val: this.borderLengthRandomValue, suffix: '%' },
            { el: this.borderOffset, val: this.borderOffsetValue, suffix: 'px' },
            { el: this.textSize, val: this.textSizeValue, suffix: 'px' },
            { el: this.lineWidth, val: this.lineWidthValue, suffix: 'px' }
        ];

        // 为每个滑块添加事件监听
        sliders.forEach(({ el, val, prefix = '', suffix = '' }) => {
            el.addEventListener('input', () => {
                // 更新显示值
                val.textContent = `${prefix}${el.value}${suffix}`;
                // 触发实时预览（带防抖）
                this.triggerRealtimePreview();
            });
        });

        // 颜色选择器、文本输入框和复选框也触发实时预览
        this.bgColor.addEventListener('input', () => this.triggerRealtimePreview());
        this.borderColor.addEventListener('input', () => this.triggerRealtimePreview());
        this.decorText.addEventListener('input', () => this.triggerRealtimePreview());
        this.textColor.addEventListener('input', () => this.triggerRealtimePreview());
        this.lineColor.addEventListener('input', () => this.triggerRealtimePreview());
        this.borderEnabled.addEventListener('change', () => this.triggerRealtimePreview());
        
        // 缩放预设按钮监听
        this.scalePresets.forEach(btn => {
            btn.addEventListener('click', () => {
                const scaleValue = parseInt(btn.getAttribute('data-scale'));
                this.scale.value = scaleValue;
                this.scaleValue.textContent = `${scaleValue}%`;
                this.updateScalePresetButtons(scaleValue);
                this.triggerRealtimePreview();
            });
        });
        
        // 缩放滑块变化时更新预设按钮状态
        this.scale.addEventListener('input', () => {
            this.updateScalePresetButtons(parseInt(this.scale.value));
        });
        
        // 切角类型按钮监听
        this.cornerTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.cornerTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.cornerType = btn.getAttribute('data-type');
                this.triggerRealtimePreview();
            });
        });
    }

    /**
     * 更新缩放预设按钮的激活状态
     * @param {number} currentScale - 当前缩放值
     */
    updateScalePresetButtons(currentScale) {
        this.scalePresets.forEach(btn => {
            const btnScale = parseInt(btn.getAttribute('data-scale'));
            if (btnScale === currentScale) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * 更新所有滑块的显示值
     * 用于初始化和重置时同步显示
     */
    updateAllSliderValues() {
        this.grayscaleValue.textContent = `${this.grayscale.value}%`;
        this.contrastValue.textContent = `${this.contrast.value}%`;
        this.brightnessValue.textContent = `${this.brightness.value}%`;
        this.scaleValue.textContent = `${this.scale.value}%`;
        this.sliceCountValue.textContent = this.sliceCount.value;
        this.sliceMinHeightValue.textContent = `${this.sliceMinHeight.value}px`;
        this.sliceMaxHeightValue.textContent = `${this.sliceMaxHeight.value}px`;
        this.sliceHeightRandomValue.textContent = `${this.sliceHeightRandom.value}%`;
        this.sliceGapValue.textContent = `${this.sliceGap.value}px`;
        this.sliceGapRandomValue.textContent = `${this.sliceGapRandom.value}%`;
        this.tiltAngleValue.textContent = `${this.tiltAngle.value}°`;
        this.tiltAngleRandomValue.textContent = `${this.tiltAngleRandom.value}%`;
        this.sliceMinWidthValue.textContent = `${this.sliceMinWidth.value}px`;
        this.sliceMaxWidthValue.textContent = `${this.sliceMaxWidth.value}px`;
        this.sliceWidthRandomValue.textContent = `${this.sliceWidthRandom.value}%`;
        this.cornerFrequencyValue.textContent = `每${this.cornerFrequency.value}个`;
        this.cornerFrequencyRandomValue.textContent = `${this.cornerFrequencyRandom.value}%`;
        this.cornerSizeValue.textContent = `${this.cornerSize.value}px`;
        this.cornerSizeRandomValue.textContent = `${this.cornerSizeRandom.value}%`;
        this.borderWidthValue.textContent = `${this.borderWidth.value}px`;
        this.borderWidthRandomValue.textContent = `${this.borderWidthRandom.value}%`;
        this.borderLengthValue.textContent = `${this.borderLength.value}%`;
        this.borderLengthRandomValue.textContent = `${this.borderLengthRandom.value}%`;
        this.borderOffsetValue.textContent = `${this.borderOffset.value}px`;
        this.textSizeValue.textContent = `${this.textSize.value}px`;
        this.lineWidthValue.textContent = `${this.lineWidth.value}px`;
    }

    /**
     * 触发实时预览
     * 使用防抖机制避免频繁重绘
     */
    triggerRealtimePreview() {
        // 清除之前的定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        // 设置新的定时器，100ms后执行
        this.debounceTimer = setTimeout(() => {
            if (this.originalImage) {
                this.applyEffects();
            }
        }, 100);
    }

    /**
     * 处理文件选择事件
     * @param {Event} e - 文件选择事件对象
     */
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    /**
     * 处理拖拽悬停事件
     * @param {DragEvent} e - 拖拽事件对象
     */
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    /**
     * 处理拖拽离开事件
     * @param {DragEvent} e - 拖拽事件对象
     */
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    /**
     * 处理文件拖放事件
     * @param {DragEvent} e - 拖放事件对象
     */
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        // 验证文件类型是否为图片
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file);
        }
    }

    /**
     * 加载图片文件
     * 使用FileReader读取文件并创建Image对象
     * @param {File} file - 要加载的图片文件
     */
    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // 保存原始图片
                this.originalImage = img;
                // 隐藏占位符，显示画布
                this.placeholder.style.display = 'none';
                this.canvas.style.display = 'block';
                // 立即应用效果
                this.applyEffects();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    /**
     * 获取当前所有参数值
     * @returns {Object} 包含所有效果参数的对象
     */
    getParams() {
        return {
            // 灰度参数
            grayscale: parseInt(this.grayscale.value) / 100,
            
            // 对比度亮度参数
            contrast: parseInt(this.contrast.value) / 100,
            brightness: parseInt(this.brightness.value) / 100,
            
            // 整体缩放参数
            scale: parseInt(this.scale.value) / 100,
            
            // 背景颜色
            bgColor: this.bgColor.value,
            
            // 切片参数
            sliceCount: parseInt(this.sliceCount.value),
            sliceMinHeight: parseInt(this.sliceMinHeight.value),
            sliceMaxHeight: parseInt(this.sliceMaxHeight.value),
            sliceHeightRandom: parseInt(this.sliceHeightRandom.value) / 100,
            sliceMinWidth: parseInt(this.sliceMinWidth.value),
            sliceMaxWidth: parseInt(this.sliceMaxWidth.value),
            sliceWidthRandom: parseInt(this.sliceWidthRandom.value) / 100,
            sliceGap: parseInt(this.sliceGap.value),
            sliceGapRandom: parseInt(this.sliceGapRandom.value) / 100,
            tiltAngle: parseInt(this.tiltAngle.value),
            tiltAngleRandom: parseInt(this.tiltAngleRandom.value) / 100,
            
            // 切角参数
            cornerFrequency: parseInt(this.cornerFrequency.value),
            cornerFrequencyRandom: parseInt(this.cornerFrequencyRandom.value) / 100,
            cornerSize: parseInt(this.cornerSize.value),
            cornerSizeRandom: parseInt(this.cornerSizeRandom.value) / 100,
            cornerType: this.cornerType,
            
            // 边框参数
            borderEnabled: this.borderEnabled.checked,
            borderColor: this.borderColor.value,
            borderWidth: parseInt(this.borderWidth.value),
            borderWidthRandom: parseInt(this.borderWidthRandom.value) / 100,
            borderLength: parseInt(this.borderLength.value) / 100,
            borderLengthRandom: parseInt(this.borderLengthRandom.value) / 100,
            borderOffset: parseInt(this.borderOffset.value),
            
            // 装饰参数
            decorText: this.decorText.value,
            textSize: parseInt(this.textSize.value),
            textColor: this.textColor.value,
            lineWidth: parseInt(this.lineWidth.value),
            lineColor: this.lineColor.value
        };
    }

    /**
     * 应用所有效果到图片
     * 这是主要的渲染函数，按顺序执行各种效果
     */
    applyEffects() {
        // 检查是否有图片
        if (!this.originalImage) return;

        // 获取当前参数
        const params = this.getParams();
        const imgWidth = this.originalImage.width;
        const imgHeight = this.originalImage.height;
        
        // 设置画布尺寸（原图尺寸）
        this.canvas.width = imgWidth;
        this.canvas.height = imgHeight;
        
        // 1. 绘制背景
        this.drawBackground(params);
        
        // 2. 绘制带效果的图片
        this.drawImageWithEffects(params);
        
        // 3. 绘制边框装饰
        if (params.borderEnabled) {
            this.drawBorders(params);
        }
        
        // 4. 绘制装饰线条和文字
        this.drawDecorations(params);
    }

    /**
     * 绘制背景
     * 使用背景颜色填充整个画布
     * @param {Object} params - 效果参数对象
     */
    drawBackground(params) {
        this.ctx.fillStyle = params.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 绘制带效果的图片
     * 将图片分割成多个切片，每个切片应用灰度和倾斜效果
     * 缩放仅影响切片区域，边框位置保持不变
     * @param {Object} params - 效果参数对象
     */
    drawImageWithEffects(params) {
        const imgWidth = this.originalImage.width;
        const imgHeight = this.originalImage.height;
        
        // 计算缩放后的尺寸
        const scaleFactor = params.scale;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = imgHeight * scaleFactor;
        
        // 计算居中偏移（保持边框位置不变）
        const offsetX = (imgWidth - scaledWidth) / 2;
        const offsetY = (imgHeight - scaledHeight) / 2;
        
        // 保存当前绘图状态
        this.ctx.save();
        
        // 移动到中心点进行缩放
        this.ctx.translate(offsetX, offsetY);
        this.ctx.scale(scaleFactor, scaleFactor);
        
        // 生成切片配置（基于原始尺寸）
        const slices = this.generateSlices(params, imgHeight);
        
        // 绘制每个切片
        let currentY = 0;
        slices.forEach((slice, index) => {
            this.drawSlice(slice, index, params, imgWidth, currentY);
            // 计算下一个切片的Y位置
            const gap = this.getRandomizedGap(params);
            currentY += slice.height + gap;
        });
        
        // 恢复绘图状态
        this.ctx.restore();
    }

    /**
     * 生成切片配置数组
     * 根据参数生成每个切片的高度和位置信息
     * @param {Object} params - 效果参数对象
     * @param {number} totalHeight - 图片总高度
     * @returns {Array} 切片配置数组
     */
    generateSlices(params, totalHeight) {
        const slices = [];
        let remainingHeight = totalHeight;
        let sliceIndex = 0;
        
        // 根据切片数量计算平均高度
        const avgHeight = totalHeight / params.sliceCount;
        
        while (remainingHeight > 0 && sliceIndex < params.sliceCount) {
            // 计算基础高度
            let baseHeight = avgHeight;
            
            // 应用随机变化
            if (params.sliceHeightRandom > 0) {
                const range = params.sliceMaxHeight - params.sliceMinHeight;
                const randomFactor = Math.random() * params.sliceHeightRandom;
                const randomHeight = params.sliceMinHeight + Math.random() * range;
                baseHeight = baseHeight * (1 - randomFactor) + randomHeight * randomFactor;
            }
            
            // 确保高度不超过剩余高度
            const height = Math.min(remainingHeight, Math.max(10, baseHeight));
            
            slices.push({
                height: height,
                y: totalHeight - remainingHeight,
                index: sliceIndex
            });
            
            remainingHeight -= height;
            sliceIndex++;
        }
        
        return slices;
    }

    /**
     * 获取随机化的间隙值
     * @param {Object} params - 效果参数对象
     * @returns {number} 随机化后的间隙值
     */
    getRandomizedGap(params) {
        if (params.sliceGapRandom === 0) {
            return params.sliceGap;
        }
        const randomFactor = 1 + (Math.random() - 0.5) * 2 * params.sliceGapRandom;
        return Math.max(0, Math.round(params.sliceGap * randomFactor));
    }

    /**
     * 获取随机化的倾斜角度
     * @param {Object} params - 效果参数对象
     * @returns {number} 随机化后的倾斜角度（弧度）
     */
    getRandomizedTiltAngle(params) {
        if (params.tiltAngleRandom === 0) {
            return (params.tiltAngle * Math.PI) / 180;
        }
        const maxVariation = 10 * params.tiltAngleRandom;
        const randomAngle = params.tiltAngle + (Math.random() - 0.5) * 2 * maxVariation;
        return (randomAngle * Math.PI) / 180;
    }

    /**
     * 判断切片是否应该有切角
     * @param {number} index - 切片索引
     * @param {Object} params - 效果参数对象
     * @returns {boolean} 是否应该有切角
     */
    shouldHaveCorner(index, params) {
        const baseFrequency = params.cornerFrequency;
        const shouldHaveCornerBase = (index + 1) % baseFrequency === 0;
        
        if (params.cornerFrequencyRandom > 0) {
            if (shouldHaveCornerBase) {
                return Math.random() > params.cornerFrequencyRandom * 0.3;
            } else {
                return Math.random() < params.cornerFrequencyRandom * 0.2;
            }
        }
        
        return shouldHaveCornerBase;
    }

    /**
     * 获取随机化的切角大小
     * @param {Object} params - 效果参数对象
     * @returns {number} 随机化后的切角大小
     */
    getRandomizedCornerSize(params) {
        if (params.cornerSizeRandom === 0) {
            return params.cornerSize;
        }
        const randomFactor = 1 + (Math.random() - 0.5) * params.cornerSizeRandom;
        return Math.max(5, Math.round(params.cornerSize * randomFactor));
    }

    /**
     * 绘制单个切片
     * @param {Object} slice - 切片配置对象
     * @param {number} index - 切片索引
     * @param {Object} params - 效果参数对象
     * @param {number} imgWidth - 图片宽度
     * @param {number} currentY - 当前Y坐标
     */
    drawSlice(slice, index, params, imgWidth, currentY) {
        // 计算随机化的切片宽度
        const sliceWidth = this.getRandomizedWidth(params, imgWidth);
        const xOffset = (imgWidth - sliceWidth) / 2;
        
        // 创建临时画布用于切片处理
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = sliceWidth;
        sliceCanvas.height = slice.height;
        const sliceCtx = sliceCanvas.getContext('2d');
        
        // 从原图绘制切片内容（居中裁剪）
        sliceCtx.drawImage(
            this.originalImage,
            xOffset, slice.y, sliceWidth, slice.height,
            0, 0, sliceWidth, slice.height
        );
        
        // 应用灰度效果
        this.applyGrayscale(sliceCtx, sliceCanvas, params.grayscale);
        
        // 应用对比度和亮度
        this.applyContrastBrightness(sliceCtx, sliceCanvas, params.contrast, params.brightness);
        
        // 判断是否需要切角
        const hasCorner = this.shouldHaveCorner(index, params);
        const cornerSize = hasCorner ? this.getRandomizedCornerSize(params) : 0;
        
        // 获取随机倾斜角度
        const tiltAngle = this.getRandomizedTiltAngle(params);
        
        // 保存绘图状态
        this.ctx.save();
        
        // 移动到切片中心点进行旋转
        this.ctx.translate(imgWidth / 2, currentY + slice.height / 2);
        this.ctx.rotate(tiltAngle);
        this.ctx.translate(-sliceWidth / 2, -slice.height / 2);
        
        // 根据是否有切角选择绘制方式
        if (hasCorner && cornerSize > 0) {
            if (params.cornerType === 'rightAngle') {
                this.drawWithRightAngleCorners(sliceCanvas, sliceWidth, slice.height, cornerSize);
            } else {
                this.drawWithCorners(sliceCanvas, sliceWidth, slice.height, cornerSize);
            }
        } else {
            this.ctx.drawImage(sliceCanvas, 0, 0);
        }
        
        // 恢复绘图状态
        this.ctx.restore();
    }

    /**
     * 获取随机化的切片宽度
     * @param {Object} params - 效果参数对象
     * @param {number} maxWidth - 最大可用宽度
     * @returns {number} 随机化后的宽度值
     */
    getRandomizedWidth(params, maxWidth) {
        const minWidth = Math.min(params.sliceMinWidth, maxWidth);
        const maxWidthParam = Math.min(params.sliceMaxWidth, maxWidth);
        
        if (params.sliceWidthRandom === 0) {
            return Math.min(maxWidthParam, maxWidth);
        }
        
        const range = maxWidthParam - minWidth;
        const randomFactor = Math.random() * params.sliceWidthRandom;
        const width = minWidth + range * (0.5 + (Math.random() - 0.5) * randomFactor);
        
        return Math.max(minWidth, Math.min(maxWidth, Math.round(width)));
    }

    /**
     * 绘制带切角的切片
     * @param {HTMLCanvasElement} imgCanvas - 切片画布
     * @param {number} width - 切片宽度
     * @param {number} height - 切片高度
     * @param {number} cornerSize - 切角大小
     */
    drawWithCorners(imgCanvas, width, height, cornerSize) {
        const path = new Path2D();
        
        // 绘制带切角的矩形路径（四个角都切除）
        path.moveTo(cornerSize, 0);
        path.lineTo(width - cornerSize, 0);
        path.lineTo(width, cornerSize);
        path.lineTo(width, height - cornerSize);
        path.lineTo(width - cornerSize, height);
        path.lineTo(cornerSize, height);
        path.lineTo(0, height - cornerSize);
        path.lineTo(0, cornerSize);
        path.closePath();
        
        // 使用路径裁剪
        this.ctx.save();
        this.ctx.clip(path);
        this.ctx.drawImage(imgCanvas, 0, 0);
        this.ctx.restore();
    }

    /**
     * 绘制带直角切除的切片
     * 从一个角出发切除一个方形区域
     * @param {HTMLCanvasElement} imgCanvas - 切片画布
     * @param {number} width - 切片宽度
     * @param {number} height - 切片高度
     * @param {number} cornerSize - 切角大小
     */
    drawWithRightAngleCorners(imgCanvas, width, height, cornerSize) {
        const path = new Path2D();
        
        // 随机选择一个角
        const corner = Math.floor(Math.random() * 4);
        
        // 限制cornerSize不超过短边的一半
        const maxCornerSize = Math.min(width, height) / 2;
        const actualCornerSize = Math.min(cornerSize, maxCornerSize);
        
        // 直角切除：切除一个方形区域
        // 定义保留区域的路径（排除方形）
        
        switch (corner) {
            case 0: // 左上角 - 切除左上角方形
                // 保留区域：从(actualCornerSize, 0)开始，绕过方形
                path.moveTo(actualCornerSize, 0);
                path.lineTo(width, 0);
                path.lineTo(width, height);
                path.lineTo(0, height);
                path.lineTo(0, actualCornerSize);
                path.lineTo(actualCornerSize, actualCornerSize);
                path.lineTo(actualCornerSize, 0);
                break;
            case 1: // 右上角 - 切除右上角方形
                path.moveTo(0, 0);
                path.lineTo(width - actualCornerSize, 0);
                path.lineTo(width - actualCornerSize, actualCornerSize);
                path.lineTo(width, actualCornerSize);
                path.lineTo(width, height);
                path.lineTo(0, height);
                path.lineTo(0, 0);
                break;
            case 2: // 左下角 - 切除左下角方形
                path.moveTo(0, 0);
                path.lineTo(width, 0);
                path.lineTo(width, height);
                path.lineTo(actualCornerSize, height);
                path.lineTo(actualCornerSize, height - actualCornerSize);
                path.lineTo(0, height - actualCornerSize);
                path.lineTo(0, 0);
                break;
            case 3: // 右下角 - 切除右下角方形
                path.moveTo(0, 0);
                path.lineTo(width, 0);
                path.lineTo(width, height - actualCornerSize);
                path.lineTo(width - actualCornerSize, height - actualCornerSize);
                path.lineTo(width - actualCornerSize, height);
                path.lineTo(0, height);
                path.lineTo(0, 0);
                break;
        }
        
        path.closePath();
        
        // 使用路径裁剪
        this.ctx.save();
        this.ctx.clip(path);
        this.ctx.drawImage(imgCanvas, 0, 0);
        this.ctx.restore();
    }

    /**
     * 应用灰度效果
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {HTMLCanvasElement} canvas - 画布元素
     * @param {number} intensity - 灰度强度（0-1）
     */
    applyGrayscale(ctx, canvas, intensity) {
        if (intensity === 0) return;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = data[i] + (gray - data[i]) * intensity;
            data[i + 1] = data[i + 1] + (gray - data[i + 1]) * intensity;
            data[i + 2] = data[i + 2] + (gray - data[i + 2]) * intensity;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * 应用对比度和亮度效果
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {HTMLCanvasElement} canvas - 画布元素
     * @param {number} contrast - 对比度（0-1）
     * @param {number} brightness - 亮度（-0.5 到 0.5）
     */
    applyContrastBrightness(ctx, canvas, contrast, brightness) {
        if (contrast === 0 && brightness === 0) return;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 对比度因子
        const contrastFactor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        // 亮度偏移
        const brightnessOffset = brightness * 255;
        
        for (let i = 0; i < data.length; i += 4) {
            // 应用对比度
            data[i] = this.clamp(contrastFactor * (data[i] - 128) + 128 + brightnessOffset);
            data[i + 1] = this.clamp(contrastFactor * (data[i + 1] - 128) + 128 + brightnessOffset);
            data[i + 2] = this.clamp(contrastFactor * (data[i + 2] - 128) + 128 + brightnessOffset);
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * 限制数值在0-255范围内
     * @param {number} value - 输入值
     * @returns {number} 限制后的值
     */
    clamp(value) {
        return Math.max(0, Math.min(255, Math.round(value)));
    }

    /**
     * 绘制边框装饰
     * 在图片四边绘制可随机化的边框线条
     * @param {Object} params - 效果参数对象
     */
    drawBorders(params) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const offset = params.borderOffset;
        
        this.ctx.strokeStyle = params.borderColor;
        this.ctx.lineCap = 'square';
        
        // 绘制四条边的边框
        // 顶边
        this.drawBorderLine(
            offset, offset,
            width - offset, offset,
            params, 'top'
        );
        
        // 底边
        this.drawBorderLine(
            offset, height - offset,
            width - offset, height - offset,
            params, 'bottom'
        );
        
        // 左边
        this.drawBorderLine(
            offset, offset,
            offset, height - offset,
            params, 'left'
        );
        
        // 右边
        this.drawBorderLine(
            width - offset, offset,
            width - offset, height - offset,
            params, 'right'
        );
    }

    /**
     * 绘制单条边框线
     * @param {number} x1 - 起点X坐标
     * @param {number} y1 - 起点Y坐标
     * @param {number} x2 - 终点X坐标
     * @param {number} y2 - 终点Y坐标
     * @param {Object} params - 效果参数对象
     * @param {string} position - 边框位置（top/bottom/left/right）
     */
    drawBorderLine(x1, y1, x2, y2, params, position) {
        // 计算线段长度
        const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        
        // 应用长度随机
        let actualLength = lineLength * params.borderLength;
        if (params.borderLengthRandom > 0) {
            const randomFactor = 1 + (Math.random() - 0.5) * 2 * params.borderLengthRandom;
            actualLength = lineLength * params.borderLength * Math.min(1, randomFactor);
        }
        
        // 应用粗细随机
        let actualWidth = params.borderWidth;
        if (params.borderWidthRandom > 0) {
            const randomFactor = 1 + (Math.random() - 0.5) * 2 * params.borderWidthRandom;
            actualWidth = Math.max(1, Math.round(params.borderWidth * randomFactor));
        }
        
        // 计算起点偏移（居中显示）
        const lengthDiff = lineLength - actualLength;
        const startOffset = lengthDiff / 2;
        
        // 根据方向计算实际坐标
        let actualX1 = x1, actualY1 = y1, actualX2 = x2, actualY2 = y2;
        
        if (position === 'top' || position === 'bottom') {
            actualX1 = x1 + startOffset;
            actualX2 = x2 - startOffset;
        } else {
            actualY1 = y1 + startOffset;
            actualY2 = y2 - startOffset;
        }
        
        // 绘制边框线
        this.ctx.beginPath();
        this.ctx.lineWidth = actualWidth;
        this.ctx.moveTo(actualX1, actualY1);
        this.ctx.lineTo(actualX2, actualY2);
        this.ctx.stroke();
    }

    /**
     * 绘制装饰元素
     * 包括角落装饰线条和文字
     * @param {Object} params - 效果参数对象
     */
    drawDecorations(params) {
        // 保存绘图状态
        this.ctx.save();
        
        // 绘制四角装饰
        this.drawCornerDecorations(params);
        
        // 绘制文字装饰
        this.drawTextDecorations(params);
        
        // 恢复绘图状态
        this.ctx.restore();
    }

    /**
     * 绘制四角装饰线条
     * @param {Object} params - 效果参数对象
     */
    drawCornerDecorations(params) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 设置线条样式
        this.ctx.strokeStyle = params.lineColor;
        this.ctx.lineWidth = params.lineWidth;
        this.ctx.lineCap = 'round';
        
        // 计算装饰线条大小
        const cornerSize = Math.min(width, height) * 0.05;
        
        // 绘制四个角的装饰
        // 左上角
        this.drawCorner(cornerSize, cornerSize, cornerSize, true, true);
        // 右上角
        this.drawCorner(width - cornerSize, cornerSize, cornerSize, false, true);
        // 左下角
        this.drawCorner(cornerSize, height - cornerSize, cornerSize, true, false);
        // 右下角
        this.drawCorner(width - cornerSize, height - cornerSize, cornerSize, false, false);
        
        // 绘制内层装饰线
        const innerCornerSize = cornerSize * 0.6;
        
        // 左上角
        this.drawCorner(innerCornerSize, innerCornerSize, innerCornerSize, true, true);
        // 右上角
        this.drawCorner(width - innerCornerSize, innerCornerSize, innerCornerSize, false, true);
        // 左下角
        this.drawCorner(innerCornerSize, height - innerCornerSize, innerCornerSize, true, false);
        // 右下角
        this.drawCorner(width - innerCornerSize, height - innerCornerSize, innerCornerSize, false, false);
    }

    /**
     * 绘制单个角的装饰线条
     * @param {number} x - 角的X坐标
     * @param {number} y - 角的Y坐标
     * @param {number} size - 装饰线条大小
     * @param {boolean} left - 是否在左侧
     * @param {boolean} top - 是否在顶部
     */
    drawCorner(x, y, size, left, top) {
        this.ctx.beginPath();
        const dirX = left ? 1 : -1;
        const dirY = top ? 1 : -1;
        
        this.ctx.moveTo(x, y - dirY * size);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x - dirX * size, y);
        this.ctx.stroke();
    }

    /**
     * 绘制文字装饰
     * 在边框的四个方向绘制装饰文字
     * @param {Object} params - 效果参数对象
     */
    drawTextDecorations(params) {
        if (!params.decorText.trim()) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 设置文字样式
        this.ctx.font = `bold ${params.textSize}px Arial, sans-serif`;
        this.ctx.fillStyle = params.textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const text = params.decorText.toUpperCase();
        const offset = params.borderOffset + 25;
        
        // 顶部文字
        this.ctx.save();
        this.ctx.translate(width / 2, offset);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
        
        // 底部文字
        this.ctx.save();
        this.ctx.translate(width / 2, height - offset);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
        
        // 左侧文字（旋转-90度）
        this.ctx.save();
        this.ctx.translate(offset, height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
        
        // 右侧文字（旋转90度）
        this.ctx.save();
        this.ctx.translate(width - offset, height / 2);
        this.ctx.rotate(Math.PI / 2);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }

    /**
     * 重置参数到默认值
     */
    resetParams() {
        // 灰度参数
        this.grayscale.value = 0;
        
        // 对比度亮度
        this.contrast.value = 0;
        this.brightness.value = 0;
        
        // 整体缩放
        this.scale.value = 100;
        this.updateScalePresetButtons(100);
        
        // 背景颜色
        this.bgColor.value = '#ffffff';
        
        // 切片参数
        this.sliceCount.value = 12;
        this.sliceMinHeight.value = 20;
        this.sliceMaxHeight.value = 80;
        this.sliceHeightRandom.value = 50;
        this.sliceMinWidth.value = 500;
        this.sliceMaxWidth.value = 2000;
        this.sliceWidthRandom.value = 30;
        this.sliceGap.value = 8;
        this.sliceGapRandom.value = 50;
        this.tiltAngle.value = 3;
        this.tiltAngleRandom.value = 30;
        
        // 切角参数
        this.cornerFrequency.value = 3;
        this.cornerFrequencyRandom.value = 40;
        this.cornerSize.value = 25;
        this.cornerSizeRandom.value = 50;
        this.cornerType = 'corner';
        this.cornerTypeBtns.forEach(btn => {
            if (btn.getAttribute('data-type') === 'corner') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 边框参数
        this.borderEnabled.checked = true;
        this.borderColor.value = '#000000';
        this.borderWidth.value = 3;
        this.borderWidthRandom.value = 0;
        this.borderLength.value = 50;
        this.borderLengthRandom.value = 0;
        this.borderOffset.value = 10;
        
        // 装饰参数
        this.decorText.value = 'IMAGE EFFECT';
        this.textSize.value = 20;
        this.textColor.value = '#333333';
        this.lineWidth.value = 2;
        this.lineColor.value = '#666666';
        
        // 更新所有显示值
        this.updateAllSliderValues();
        
        // 如果有图片，重新应用效果
        if (this.originalImage) {
            this.applyEffects();
        }
    }

    /**
     * 重新生成效果
     */
    regenerateEffect() {
        if (this.originalImage) {
            this.applyEffects();
        }
    }

    /**
     * 下载处理后的图片
     */
    downloadImage() {
        if (!this.originalImage) return;
        
        const link = document.createElement('a');
        link.download = 'image-effect.png';
        link.href = this.canvas.toDataURL('image/png', 1.0);
        link.click();
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ImageEffectGenerator();
});
