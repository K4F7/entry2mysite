# 个人站入口 World 原型 - 视觉与 UI 方案

基于 Cozy Low-Poly Diorama 风格与 Three.js 技术栈，针对 24×24 外围网格、DOM Overlay 交互及 KayKit 资产库的最小可用（Throwaway Prototype）视觉建议。

## 1. 色彩、材质与灯光建议

*   **色彩基调 (Color Palette)**：暖色调为主，低对比度的护眼自然色。背景（ClearColor）建议使用浅奶油色（`#FDF6E3`）或温暖的天蓝色（`#A3CEF1`），避免纯黑纯白。
*   **材质 (Materials)**：统一使用 Three.js 的 `MeshStandardMaterial`，为符合 KayKit 低多边形风格，必须设置 `flatShading: true`。`roughness` 设为 `0.8 - 1.0`，`metalness` 设为 `0.0`，消除塑料反光感。
*   **灯光 (Lighting)**：
    *   **环境光**：`HemisphereLight`，天空色用淡暖白（`#FFFFFF`，强度 `0.6`），地面色用暗绿/土褐（`#4A5D23`，强度 `0.3`），确保背光面不死黑。
    *   **主光源**：`DirectionalLight`，偏黄的阳光（`#FFF4D2`，强度 `1.2`），带有角度（如 `x: 5, y: 10, z: 5`），开启投射阴影（`castShadow = true`）。
*   **Portal 区分**：Portal 中心区域可增加一个微弱的紫色/金色 `PointLight`（强度 `2.0`，距离 `5`），或让中心区块的材质自发光（`emissive`），与外围普通的自然网格形成冷暖对比。

## 2. KayKit 最小资产组合与替代方案

*   **中心 Portal**：
    *   *首选*：`Medieval Hexagon` 里的带魔法阵/地砖的六边形基础块（如果与方形网格冲突，使用其缩放变体），或拼合4个带装饰的方形石板。
    *   *替代*：`Prototype Bits` 的 `Primitive_Floor` 着以金色。
*   **外围 24×24 地形与道路**：
    *   *道路 (可通行网格)*：`City Builder Bits` 中的 `Road_Straight`, `Road_Corner`, `Road_Cross`, `Road_T`。需要按 3D 坐标严格对应至24x24的方格点。
    *   *障碍与装饰 (不可通行网格)*：`Forest Nature` 中的 `Tree_Pine_Small`, `Rock_Mossy`, `Bush` 随机散布。
*   **主角**：
    *   *首选*：`Adventurers` 中的 `Rogue`。需要提取 `Idle`（静止站立）与 `Run`/`Walk`（移动中）动画。

## 3. d6 骰子 UI（底部中央）

此部件完全由 DOM Overlay 实现，需与 3D 画布脱离，使用 CSS 绝对定位。

*   **尺寸与布局**：固定在 `bottom: 0`, `left: 50%`, `transform: translateX(-50%)`。桌面端尺寸建议 `120x120px`，移动端缩至 `80x80px`。
*   **安全区 (Safe Area)**：必须在 CSS 增加 `padding-bottom: env(safe-area-inset-bottom, 20px)`，防止被 iOS 底部小黑条遮挡。
*   **层级**：`z-index: 100`，确保永远在 WebGL 画布和气泡之上。
*   **状态样式**：
    *   *Default (可点击)*：轻微的上下浮动动画 (CSS `translateY` 关键帧)，加上微弱的发光 `box-shadow`。
    *   *Hover (悬停)*：`transform: translateX(-50%) scale(1.1)` 放大。
    *   *Rolling (掷骰中)*：CSS 模糊 (`filter: blur(2px)`) 并快速切换数字帧，不可点击。
    *   *Disabled (移动中)*：透明度降至 `0.5`，灰度过滤 (`filter: grayscale(100%)`)。

## 4. 主角气泡按钮（Return to Portal）

*   **定位**：在 `render` 循环中，使用 Three.js 的 `Vector3.project(camera)` 将主角的 3D 世界坐标转换为屏幕 2D 坐标。气泡在 Y 轴向上偏移约 `60px`（避免挡住角色头部）。
*   **可读性**：必须采用高对比度。白底（`#FFFFFF`）黑字（`#333333`），圆角矩形（`border-radius: 8px`），下方带一个指向角色的小三角指示器。添加 `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` 将其从 3D 场景中剥离出来。
*   **移动端处理**：触摸目标必须大于 `44x44px`。字体大小至少 `14px`。文字两侧必须有充足的内边距 (`padding: 12px 20px`)。

## 5. UI 变体方案 (Variant A / B / C)

针对 URL 参数 `?variant=A|B|C`，在**保持核心逻辑和固定位置不变**的前提下，提供以下三种视觉结构：

### Variant A: Minimal Immersive (极简沉浸)
*   **d6**：无边框，无背景底座，只有一个大而清晰的立体感骰子图标/CSS绘制的六面体浮在底部中央。
*   **气泡**：药丸状（Pill-shape），无边框，极细的投影。无小三角指示器，极简无干扰。
*   **场景互动**：完全依靠 3D 场景本身的色彩对比，UI 做到最隐形。

### Variant B: Boardgame Tray (桌游底盘)
*   **d6**：底部中央包含一个木纹或深色羊皮纸质感的半圆弧形“托盘”背景（横跨底部中央 200px 宽度）。骰子放置在托盘正中央，点击时有按压反馈。
*   **气泡**：边缘不规则的羊皮纸风格，粗衬线字体（Serif），配合黑色的边框线，强化跑团（TRPG）体验。

### Variant C: Glassmorphism HUD (现代毛玻璃)
*   **d6**：放置在一个带有毛玻璃效果（`backdrop-filter: blur(10px)` + `background: rgba(255,255,255,0.2)`）的圆角正方形卡片内。
*   **气泡**：同样采用半透明毛玻璃效果，文字使用高反差的纯白色加上黑色文字阴影，科技感与低多边形的碰撞。

## 6. 需浏览器截图验证的风险清单

以下项目由于 Three.js 和前端渲染的动态性，必须在代码实现后，通过实际截图或 Smoke Test 确认：

1.  **Low-Poly 阴影瑕疵 (Shadow Acne)**：确认大面积纯色网格上是否出现阴影波纹，可能需要调整 `DirectionalLight.shadow.bias` 甚至 `normalBias`。
2.  **材质色彩冲突**：`City Builder Bits`（道路）与 `Forest Nature`（植被）的调色板能否自然融合，若对比度过大可能需要用代码统一调整材质的 `color` 或引入后期色调映射 (`toneMapping`)。
3.  **气泡 UI 屏幕边缘裁剪**：当主角走到 24x24 边缘时，屏幕空间坐标转换后的气泡是否会超出屏幕视口（Viewport）边界而被隐藏。需验证边缘碰撞处理逻辑。
4.  **移动端底部遮挡**：在真实 iOS Safari/Chrome 上，d6 骰子是否被地址栏缩放机制或系统底部安全区（Home Indicator）遮挡。