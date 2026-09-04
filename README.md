# Entry d20

个人网站的 d20 入口 prototype。用户进入页面后会自动看到一次投掷示范；第一阶段通过点击投掷和拖拽旋转验证骰子本体、入口布局与游戏式引导。

当前 prototype 使用 Vite、TypeScript 与 Three.js，专注桌面端视觉和交互，不接入文章推荐、路由、主题持久化或正式结果池。

详细范围和验收标准见 [`docs/prototype-plan.md`](./docs/prototype-plan.md)，领域词汇见 [`CONTEXT.md`](./CONTEXT.md)，关键技术与范围决策见 [`docs/adr/0001-prototype-stack-and-scope.md`](./docs/adr/0001-prototype-stack-and-scope.md)。

## 本地运行 prototype

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:5173/prototype/d20?variant=A`。使用底部原型切换条或 URL 中的 `variant=A|B|C` 查看三种视觉方案；点击骰子投掷，拖拽骰子旋转。
