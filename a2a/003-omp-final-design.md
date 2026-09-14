# 视觉与 UI 方案交付

本方案提供基于当前 KayKit 本地资产库与 DOM Overlay 的 UI/UX 规范及 CSS Tokens，用于整合至主分支。

## 1. 资产组合与场景光照

仅使用本地已有的 KayKit 资产，保留其原生材质与着色属性。地块与骰子采用程序化几何体。

*   **Portal 建筑群**：`hub` (Tavern) 作为主入口中心，`home` 与 `mill` 散布于周边点缀。
*   **外围 World 装饰**：随机散布 `tree`、`pine`、`rock`。
*   **主角**：`Rogue`，需集成 `Idle` 与 `Walk/Run` 动画。
*   **光照方案**：
    *   `HemisphereLight`：天空色 `#FFFFFF`，地面色 `#4A5D23`，全局统一 `intensity: 0.8`。
    *   `DirectionalLight`：偏黄阳光 `#FFF4D2`，`intensity: 1.2`，开启投射阴影，需主代理在运行时微调位置与 shadow bias。

## 2. CSS Tokens

```css
:root {
  /* Colors */
  --omp-color-bg-base: rgba(253, 246, 227, 0.95);
  --omp-color-bg-panel: rgba(255, 255, 255, 0.85);
  --omp-color-text-primary: #2D3748;
  --omp-color-text-secondary: #4A5568;
  --omp-color-border: #E2E8F0;
  
  /* Typography */
  --omp-font-sans: system-ui, -apple-system, sans-serif;
  --omp-text-base: 16px;
  --omp-text-sm: 14px;
  
  /* Dimensions & Spacing */
  --omp-space-sm: 8px;
  --omp-space-md: 16px;
  --omp-space-lg: 24px;
  --omp-radius-md: 8px;
  --omp-radius-lg: 12px;
  --omp-touch-target: 48px;
  
  /* Z-Index Hierarchy */
  --omp-z-canvas: 0;
  --omp-z-portal: 10;
  --omp-z-bubble: 20;
  --omp-z-dice: 30;
  --omp-z-prototype-bar: 40;
}
```

## 3. UI 组件状态与交互规范

### 3.1 d6 骰子 (底部中央)
完全脱离 3D 渲染，使用 DOM 元素定位。需避开底部原型切换条。

*   **定位约束**：`left: 50%; bottom: calc(env(safe-area-inset-bottom, 20px) + 60px); transform: translateX(-50%);` (60px 为原型切换条预留)。
*   **状态规范**：
    *   `Default`：静态显示，无浮动、无发光。指针为 `pointer`。
    *   `Hover`：`transform: translateX(-50%) scale(1.05);`，微小放大反馈。
    *   `Rolling`：CSS 快速关键帧切换数字/面，不可点击 (`pointer-events: none`)。
    *   `Disabled` (角色移动中)：`opacity: 0.4; filter: grayscale(1); pointer-events: none;`。

### 3.2 主角气泡 (Return to Portal)
跟随 3D 角色坐标映射到 2D 屏幕。

*   **样式**：白底黑字，圆角矩形，带向下指示小三角，基础阴影剥离 3D 背景。
*   **移动端约束**：点击区域最小 `48x48px`，内边距充足。
*   **边缘碰撞**：若坐标映射导致气泡超出视口，需通过 JS Clamp 逻辑或 CSS `max-width` / 动态 `transform` 将其限制在屏幕内，确保文字始终可读。

## 4. Portal 信息结构变体 (HTML DOM)

针对 `?variant=A|B|C` 的三套 Portal 信息层布局方案（仅改变 HTML 结构与排版位置，不含 3D 画布逻辑）。

### Variant A: Centered Modal (居中模态框)
经典卡片式居中，遮挡部分 3D 场景，信息聚焦。
```html
<div class="omp-portal-variant-a" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
  <div style="background: var(--omp-color-bg-panel); padding: var(--omp-space-lg); border-radius: var(--omp-radius-lg); pointer-events: auto; max-width: 400px; text-align: center; backdrop-filter: blur(8px);">
    <h1 style="margin-top: 0;">Portal Hub</h1>
    <p style="color: var(--omp-color-text-secondary);">Your fixed entry point to the daily seeded world.</p>
    <button style="min-height: var(--omp-touch-target); width: 100%;">Enter Daily World</button>
  </div>
</div>
```

### Variant B: Sidebar Drawer (侧边抽屉)
信息靠左对齐，右侧完全留给 3D 场景展示。
```html
<div class="omp-portal-variant-b" style="position: absolute; left: 0; top: 0; bottom: 0; width: 320px; background: var(--omp-color-bg-base); border-right: 1px solid var(--omp-color-border); padding: var(--omp-space-lg); display: flex; flex-direction: column;">
  <div style="flex-grow: 1;">
    <h1 style="font-size: 1.5rem;">Portal Hub</h1>
    <p>Select your destination.</p>
    <!-- 导航信息不重复 World 内部逻辑 -->
  </div>
  <button style="min-height: var(--omp-touch-target);">Enter Daily World</button>
</div>
```

### Variant C: Minimal Header (极简顶栏)
类似沉浸式游戏的顶部 HUD，对 3D 视觉干扰最小。
```html
<div class="omp-portal-variant-c" style="position: absolute; top: env(safe-area-inset-top, 20px); left: 50%; transform: translateX(-50%); display: flex; gap: var(--omp-space-md); background: var(--omp-color-bg-panel); padding: var(--omp-space-sm) var(--omp-space-lg); border-radius: 99px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <strong>Portal Hub</strong>
  <div style="width: 1px; height: 16px; background: var(--omp-color-border);"></div>
  <button style="background: transparent; border: none; font-weight: bold; cursor: pointer; padding: 0 var(--omp-space-sm);">Enter World</button>
</div>
```

## 5. 集成检查表 (待体验验证)

以下项需主代理在运行时集成后实际体验验证：

1. [ ] **3D 投影阴影**：验证 `DirectionalLight` 投射在低多边形网格上是否产生明显的 Shadow Acne（伪影），需调试 `bias` 参数。
2. [ ] **DOM Overlay 遮挡**：在移动端实测，确认骰子是否与底部浏览器工具栏、iOS Home Indicator 或原型的 Debug/Variant 切换条发生碰撞重叠。
3. [ ] **气泡视口边缘处理**：验证主角行走到 24x24 边缘最左侧或最右侧时，气泡通过 `Vector3.project(camera)` 计算出的坐标是否导致 DOM 被屏幕截断。
4. [ ] **动画过渡**：确认 Rogue 角色的 `Idle` 到 `Walk` 的 CrossFade 切换是否平滑，无默认 T-pose 闪烁。
