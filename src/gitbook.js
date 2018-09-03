const path = require('path');
const fs = require('fs');
const vscode = require('vscode');
const Outline = require('./outline');
const treeDataProvider = require('./treedata');

class Gitbook {
  constructor() {

  }

  bootstrap(context) {
    const filePath = path.join(vscode.workspace.rootPath, 'SUMMARY.md');
    if (fs.existsSync(filePath)) {
      this.readOutlineFromFile(filePath).then(outline => {
        this.setOutline(outline);
      }, err => console.error(err));
    }
  }

  setOutline(outline) {
    const flag = outline && outline.children && outline.children.length;
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
