const vscode = require('vscode');

class TreeDataProvider {
  static wrapper(outline) {
    outline.emitter = new vscode.EventEmitter();
    outline.onDidChangeTreeData = outline.emitter.event;

    outline.update = function(nobj) { 
      this.children = nobj.children;
      this.emitter.fire();
    };

    outline.getParent = function(element) {
      return new Promise(resolve => resolve(element.parent));
    }

    outline.getTreeItem = function(element){
      const item = new vscode.TreeItem(element.text, element.children && element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.Expanded);
      item.tooltip = element.link;
      return item;
    };

    outline.getChildren = function(element){
      return new Promise(resolve => {
        if (element) {
          resolve(element.children || []);
        } else {
          resolve(outline.children);
        }
      });
    }
    return outline;
  }
}

module.exports = TreeDataProvider;
