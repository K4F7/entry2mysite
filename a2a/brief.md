# Claude 美术 / UI 任务简报

请以非交互方式完成一次视觉方案输出，结果写入同目录的 `claude-response.md`（如果无法写文件，则输出完整 Markdown）。

## 项目

个人站入口 World 原型，风格为 Cozy Low-Poly Diorama。默认固定 Portal，向外拖拽进入每日固定 Seed 的 24×24 方格外围地图。普通 d6 固定在屏幕底部中央，点数直接决定主角沿道路前进格数；点击主角显示 `Return to Portal` 气泡。

## 技术约束

- Three.js + TypeScript + Vite
- KayKit 是唯一素材来源；优先使用 Medieval Hexagon、Forest Nature、Adventurers、City Builder Bits、Prototype Bits
- 需要 GLTF/GLB 资产组合、光照、色彩和模型比例建议
- DOM Overlay 承载骰子控制区和主角气泡
- 这是 throwaway prototype，先解决视觉和交互可读性，不写正式业务内容

## 当前已核实

- Medieval Hexagon：建筑、自然物、六边道路；CC0
- Forest Nature：免费版树、岩石、灌木和草；CC0
- Adventurers：Rogue 等 5 个带动画角色；CC0
- City Builder Bits：直路、弯路、T 路口、十字路口；CC0
- Prototype Bits：Floor / Primitive_Floor 等占位模型；CC0

## 请输出

1. Portal 与外围地图的色彩、材质、灯光建议
2. KayKit 最小资产组合和替代方案
3. 底部中央 d6 UI 的尺寸、层级、安全区和状态样式
4. 主角气泡按钮的定位、可读性和移动端处理
5. 3 个结构不同的 UI 变体（A/B/C），用于 `?variant=` 切换
6. 明确指出哪些建议需要在浏览器截图中验证

不要改变已经确定的 Portal、24×24 方格、每日 Seed、d6、底部中央骰子和点击主角返回规则。
