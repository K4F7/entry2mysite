# A2A 美术交付与验证

2026-09-15：已使用 `@oh-my-pi/pi-coding-agent` 18.1.22 完成三轮非交互协作，三个进程均退出 0。用户供应商与模型配置未改动。

## 交付与采纳

- 第一轮概念方案 → 主代理纠正发光、素材名与材质建议 → 第二轮设计规范 → 第三轮独立 HTML 样稿。
- 采纳奶油底色、深色文本、KayKit 原材质、48px 触摸目标；Portal 分为居中卡片、侧栏、紧凑入口条三种结构。
- 常用入口只在 Portal，进入 World 后留下角色占位和底部骰子；骰子默认静止，无呼吸光。
- 场景仍使用已下载的 KayKit hub/home/mill/tree/pine/rock/Rogue，动画接入应使用实际存在的 Idle / Walking_A / Running_A。
- 美术灯光数值只作为初始建议，尚未完成真实 KayKit 场景调光；不能称为 3D 美术验收。

## 主代理集成修复

OMP 输出后修复：骰子从 div 改为原生 button 并真正 disabled；点数绘制；悬停横移；48px 目标；切换/返回清理计时器；移动端侧栏转换为上部紧凑面板；新增左右切换按钮和 contenteditable 键盘保护；修复点阵 span 高度为零的问题。

## 已实际验证

- 浏览器打开样稿，常用入口弹出“入口占位”面板，关闭正常。
- 进入 World 时 Portal 隐藏；投掷时 accessibility tree 报 disabled；结束后恢复可用并显示随机点数。
- 点击角色才打开返回气泡，返回按钮回到 Portal。
- A/B/C 切换更新 URL；刷新 C 保持 C。
- 390×844：B、C 与 World HUD 截图检查，气泡、骰子和底部切换条可见且无重叠；六点点阵清晰。
- 1440×900：C 顶部横排入口截图检查通过。

未验证：真实手机浏览器安全区、完整键盘焦点陷阱、真实 3D 角色投影到屏幕边缘、模型光照/阴影、完整游戏移动。这些不因样稿通过而被视为完成。

## 原型位置

HTML 样稿随 `codex/world-prototype` 分支保存于 `a2a/ui-preview.html`，主分支只保存 A2A 文档。工作树：`D:/19016/Documents/Workload/entry-world-prototype`。

在原型工作树执行 `pnpm dev --host 127.0.0.1 --port 5192`，访问 `/a2a/ui-preview.html?variant=A`。也可以直接打开该独立 HTML 文件。

当前成果是可审阅的美术/UI样稿与规范，不是完整游戏原型修复。运行时缺口见 `002-integration-review.md`。
