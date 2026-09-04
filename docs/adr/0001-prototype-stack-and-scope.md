# Prototype 使用 Vite、TypeScript 与 Three.js

prototype 采用 Vite + TypeScript + Three.js，先不引入 React 或完整物理引擎。第一阶段只验证桌面端全屏 d20 入口、静态 `sein31` 背景、点击投掷、拖拽旋转、程序化投掷动画和游戏式视觉引导；文章、路由、主题持久化与结果池暂不接入。选择直接使用 Three.js 是为了让场景、相机、灯光、骰子交互和动画边界保持清晰，并通过本地热重载快速迭代视觉与手感。
