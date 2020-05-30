## 安装说明

获取已发布版本：[Releases](https://github.com/AidenLx/AutoDef/releases)

- unsigned版功能较新，尚未获得签名，但可正常使用
- alpha版处于测试阶段，可能策略较激进，请斟酌使用

🧐 [我该如何安装Marginnote插件？ ](https://bbs.marginnote.cn/t/topic/6246)

## 有问题/想增加新规则如何反馈？

1. GitHub添加新[issue](https://github.com/AidenLx/AutoDef/issues)
2. [论坛介绍页](https://bbs.marginnote.cn/t/topic/8153)下跟帖反馈

## 功能简介

打开插件后，选中含双语名称的摘录/标题的笔记时，标题自动更新为标题链接样式
（若内容不包含双语的话也可使用其快速更正标题内排版错误）

- 对基本的排版错误进行了后台处理（如中文间多余空格、标点符号等）

- 自动分离文本中的别称，创建标题链接，如：
  >称为直肠后隙(retrorectal space)或称骶前间隙

  可自动转化为：

  >骶前间隙;直肠后隙;Retrorectal Space
  
- A or B C→A C;B C，如：

  >睾丸动脉或卵巢动脉(testicular or ovarian artery

  可自动转化为：

  >睾丸动脉;卵巢动脉;Testicular Artery;Ovarian Artery

- 支持多条目合并笔记，多个含重叠部分的名称中保留最长版本，如：

  | 腹外斜肌\(External oblique muscle | //来自书本A的摘录 |
  | --- | ---|
  | External oblique                  | //来自书本B的摘录 |

  会自动筛选出不重复的条目生成标题：

  > 腹外斜肌;External Oblique Muscle
	
- 英文标题自动首字母大写

## 使用场景

- 学习医学相关条目时为存在中英双语的名词解释快速建立标题链接
- 学习双语教材时合并多本教材的条目并快速建立标题链接
- 为同一术语的多种别名快速创建标题链接

## 相关讨论

> [【标题-讨论集合】墙裂建议摘录内容可以直接保留为标题.](https://bbs.marginnote.cn/t/topic/5287)

## 使用方法
[论坛介绍页](https://bbs.marginnote.cn/t/topic/8153)

## 兼容性

> 3.6.7.4及更新版本
