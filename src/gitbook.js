const path = require('path');
const fs = require('fs');
const vscode = require('vscode');
const Outline = require('./outline');
const treeDataProvider = require('./treedata');
const I18n = require('./i18n');
const { createNewNode } = require('./util');

class Gitbook {

  constructor() {
    this.i18n = new I18n('zh-CN');
    this.fileName = path.join(vscode.workspace.rootPath, 'SUMMARY.md');
    vscode.workspace.onDidChangeTextDocument(event => {
      const { document } = event;
      if (document.fileName === this.fileName) {
        this.outline.update(Outline.from(document.getText()));
      }
    });

    /**
     * register commands
     */
    this.commands = {
      treeContext: vscode.commands.registerCommand('gitbook.addRootEntry', treeElement => {
        createNewNode(treeElement).then(({ text, link }) => {
          const parent = treeElement ? treeElement : this.outline;
          parent.children = parent.children || [];
          const item = {
            type: parent.type,
            level: parent.level+1,
            text,
            link,
            parent,
          };
          parent.children.push(item);
          fs.writeFileSync(this.fileName, this.outline.toText(), 'utf8');
          vscode.workspace.openTextDocument(this.fileName);
          this.outline.update();
        }, err => {
          console.error(err);
        });
      }),
    };
    

    console.log(this.commands.treeContext);
  }

  bootstrap(context) {
    if (fs.existsSync(this.fileName)) {
      this.readOutlineFromFile(this.fileName).then(outline => {
        this.setOutline(outline);
      }, err => console.error(err));
    } else {
      vscode.window.showWarningMessage(this.i18n.get('catalog404'));
      this.setOutline({ children: [] });
    }
  }

  setOutline(outline) {
    const flag = outline && outline.children;
    this.outline = outline;
    vscode.window.registerTreeDataProvider('bookstruct', treeDataProvider.wrapper(outline));   
    vscode.commands.executeCommand('setContext', 'showOutline', !!flag);
  }

  readOutlineFromFile(uri) {
    return new Promise((resolve, reject) => {
      fs.readFile(uri, { encoding: 'utf8' }, (err, data) => {
        if (err) reject(err);
        return resolve(Outline.from(data));
      });
    });
  }
  
  active(context) {
    this.bootstrap(context);
  }

  deactive() {

  }
}
module.exports = Gitbook;
