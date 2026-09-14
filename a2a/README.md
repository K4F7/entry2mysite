# A2A 美术 / UI 协作

这里是主代理与 Claude 的非交互交接目录。文件采用追加式轮次交接，避免直接修改对方正在工作的代码。

- `brief.md`：主代理发给 Claude 的当前视觉任务与硬约束
- `claude-response.md`：Claude 的方案、素材选择和待确认问题
- `integration-notes.md`：主代理记录已采纳内容与集成结果

Claude 只负责美术方向、KayKit 素材组合和 DOM UI 视觉建议；Three.js 运行时、领域逻辑、mock 与生产边界由主代理负责。
