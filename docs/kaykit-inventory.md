# KayKit 素材盘点

核对日期：2026-09-15。范围：官方发布页与官方 GitHub 模型目录；尚未下载整包、渲染模型或验证实际尺寸、原点与动画剪辑。此文是下一轮原型的输入，不是已完成接入的声明。

## 结论

KayKit 足以覆盖建筑、自然装饰和可动画主角。当前主要缺口是符合方格地图的自然道路组合，以及现成 d6 模型。保留 24×24 方格规则，不因素材默认六边格而自动改变玩法。

推荐先采用 Medieval Hexagon 的独立建筑 + Forest 免费版 + Adventurers 免费版；方格底面可从 Prototype Bits 取材。City Builder 提供完整直角道路，但现代城市道路的视觉是否适合温馨自然沙盘，需要原型对照后决定。

## 候选包

| 素材包 | 已核实内容 | 用途与限制 |
| --- | --- | --- |
| [Medieval Hexagon](https://kaylousberg.itch.io/kaykit-medieval-hexagon) | 免费版 200+ 模型，建筑、自然物、六边形道路和水系；FBX/GLTF/OBJ | Hub 与外围建筑首选。道路、水岸属于六边格，不直接用于方格拼接。EXTRA 的单位不算免费内容。 |
| [Forest Nature](https://kaylousberg.itch.io/kaykit-forest) | 免费版 100+ 树木、岩石、灌木和草；FBX/GLTF/OBJ | 外围装饰首选。模块化地形及更多配色属于 EXTRA，当前页面价格 $9.99。无需先购买。 |
| [Adventurers](https://kaylousberg.itch.io/kaykit-adventurers) | 免费版 5 个绑定角色、基础移动动画与配件；FBX/GLTF | 主角首选，可不配武器。itch 当前为 2.0，GitHub 仓库名仍带 1.0；接入时记录实际版本，不假定两处内容完全相同。 |
| [City Builder Bits](https://kaylousberg.itch.io/city-builder-bits) | 免费版 32+ 模型；FBX/GLTF/OBJ | 方格道路备选，包含直路、弯路、T 路口和十字路口。现代街道风格需实景验证；公园 EXTRA 不计入免费清单。 |
| [Prototype Bits](https://github.com/KayKit-Game-Assets/KayKit-Prototype-Bits-1.0) | 官方目录有 Floor、Floor_Dirt、Primitive_Floor、Primitive_Cube 等 GLTF | 方格底面与道路占位候选。需验证尺寸和拼缝，不等同于现成自然道路全套。 |

以上四个 itch 发布页明确标注 CC0、允许个人及商业用途且无需署名；Prototype Bits 官方仓库提供 LICENSE.txt。导入时保留各包许可证与来源记录。免费版与付费扩展分开记录，不把页面宣传的全版本总数当作免费模型数量。

## 已核实文件与初选组合

- [Medieval 官方目录](https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0/tree/main/addons/kaykit_medieval_hexagon_pack/Assets/gltf)：`buildings/blue/building_tavern_blue.gltf`、`building_home_A_blue.gltf`、`building_windmill_blue.gltf`、`building_castle_blue.gltf` 可作为建筑候选。推荐先试 tavern 作为 Hub，home 与 windmill 作外围地标；这是待视觉验证的选择。
- [City 官方目录](https://github.com/KayKit-Game-Assets/KayKit-City-Builder-Bits-1.0/tree/main/addons/kaykit_city_builder_bits/Assets/gltf)：`road_straight.gltf`、`road_corner.gltf`、`road_tsplit.gltf`、`road_junction.gltf`，另有 `building_A_withoutBase.gltf` 至 H 系列可选。
- [Adventurers 官方角色目录](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/tree/main/addons/kaykit_character_pack_adventures/Characters/gltf)：`Barbarian.glb`、`Knight.glb`、`Mage.glb`、`Rogue.glb`、`Rogue_Hooded.glb`。初选不带武器的 Rogue，待检查待机/行走动画与相机下辨识度。
- Forest：先选 3 种树、2 种岩石、2 种灌木和 1 种草；具体文件名等免费包解包后确认。
- d6：本轮已核对目录与发布页中未确认到成品骰子，不能据此断言 KayKit 全系列没有。底部骰子可作为程序化 UI 控件绘制六面点数，不需要引入第三方美术包；这是原型实现建议。

## 接入时需要验证

1. GLTF 资源不是一律单文件：已见 `.gltf + .bin + PNG`，角色则有 `.glb`；按引用关系复制，不能只取模型入口文件。
2. 读取实际包版本、包内许可证、包围盒、原点和贴图引用；统一 Tile 尺度与角色脚底锚点。
3. 角色动画以实际剪辑名称为准；扩展动画只在基础包不够时引入。
4. 每包独立图集，不能假设跨包共用同一纹理。只加载初选模型，首屏大小以实际网络数据计量，不以整包 ZIP 大小推算。
5. 原型先比较自然土路与 City 道路，并验证建筑是否独立于六边形底座；正式地形分类暂不固定，水岸暂列候选。
6. 素材 manifest 与 dev/mock 共用模型标识；HMR 替换模型需清理旧对象和资源引用，同时保留开发 Seed 与角色位置的可控重置入口。

## 下一轮 Prototype 要回答的问题

使用上述最小素材组合，在固定 Portal 与每日随机外围中，验证沙盘尺度、方格道路的自然感、底部 d6 是否遮挡角色、角色气泡定位以及近景拉远的连续感。Prototype 留在独立分支，本轮不创建或修改运行时代码。
