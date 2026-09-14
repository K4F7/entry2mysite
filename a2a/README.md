# A2A 美术 / UI 协作

这里是主代理与 OMP 美术代理的非交互交接目录。用户已要求从 Claude CLI 改为 Oh My Pi；不覆盖用户供应商或模型配置，也不把 OMP 输出冒称 Claude 输出。文件采用追加式轮次交接。

- `brief.md`：原始视觉任务与硬约束（历史标题保留）
- `001-omp-design.md`：OMP 第一轮方案，含已拒绝建议，不直接用于集成
- `002-integration-review.md`：主代理反馈与运行时缺口
- `003-omp-final-design.md`：第二轮方案，需结合下一轮修正使用
- `004-preview-request.md`：可运行 UI 样稿要求与第二轮修正
- `ui-preview.html`：OMP 输出的独立 UI 样稿，未接入 3D 场景
- `integration-notes.md`：主代理记录已采纳内容与集成结果

OMP 负责美术方向、KayKit 素材组合和 DOM UI；Three.js 运行时、领域逻辑、mock 与集成验证由主代理负责。

运行时：`@oh-my-pi/pi-coding-agent`，命令 `omp`。`oh-my-pi` 同名增强包和 `@oh-my-pi/cli` 插件管理器不是本次使用的代理运行时。

调用示例（在项目根目录）：

```bash
omp -p --no-title --no-tools --no-session @a2a/brief.md "返回纯 Markdown，不调用工具，不提问" > a2a/新轮次.md
```

主代理读取与审核输出后，再通过新的 Markdown 发出修订请求。`--no-tools` 将本轮美术模型限制为交付文本/HTML，写盘由调用方完成；模型配置与凭据保持不变。诊断日志不作为设计产物。
