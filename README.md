# gitbook-kit README

由于Gitbook Editor的Mac版本存在一些bug，使用起来并不方便。当单个页面长度需要滑动时，每次删除都会异常卡、慢，令人困扰。Gitbook-Kit为VSCode添加了相关功能支持。

Since there're some bugs in Gitbook Editor(Mac version), I made this extension so that I could use VSCode as the gitbook editor.

![preview](https://www.hoyt-tian.com/content/images/2018/09/preview.png)

## 功能 Features

* 若存在SUMMARY.md文件，自动激活插件
* 文档结构树支持编辑功能，可以增加、删除、重命名节点
* 文档借口树的变动会自动同步到SUMMARY.md文件中
* SUMMARY.md文件发上变动时，左侧文档树会同步更新

* Extension will be actived when SUMMARY.md exits.
* You can edit book structure in the Gitbook Struct Explorer View. (Create node, rename node or delete node)
* All changes made in the structure view will be synchronized to SUMMARY.md
* Gitbook struct will be updated once SUMMARY.md changed.

### 更多信息 More

* [Source code／ Issue discussion on Github](https://github.com/hoyt-tian/vscode-gitbook-kit)
* [Detail about extension on my Blog](https://www.hoyt-tian.com/vscode-extension-for-gitbook/)

**Enjoy!**