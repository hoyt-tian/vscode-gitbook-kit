const vscode = require('vscode');


const  findAllMD = () => {
  return vscode.workspace.findFiles('**/*.md', '**/node_modules/**');
};

const showDoc = (fileName) => {
  vscode.window.showTextDocument(vscode.Uri.file(fileName), {
    viewColumn: vscode.ViewColumn.One
  }).then(f => {

  }, e => {
    console.log('fail to open');
  });
}

const createNewNode = (element) => {
  return new Promise((resolve, reject) => {
    const nameInput = vscode.window.createInputBox();
    const picker = vscode.window.createQuickPick();
    let name = null;

    Object.assign(nameInput, {
      title: 'Create Child Node',
      step: 1,
      totalSteps: 2,
      placeholder: 'name for new node',
      prompt: 'can be empty or space for the name',
    });

    nameInput.onDidAccept(() => {
      const val = nameInput.value;
      if (val && /^\s+$/.test(val)!==true) {
        nameInput.hide();
        name = val;

        findAllMD().then(files => {
          picker.items = files.map(i => {
            return {
              picker: false,
              label: vscode.workspace.asRelativePath(i.fsPath)
            };
          });
          picker.buttons = [vscode.QuickInputButtons.Back];
          picker.show();
        });
        
      } else {
        vscode.window.showErrorMessage('Can not be empty');
      }
    });


    Object.assign(picker, {
      title: 'Create Child Node',
      step: 2,
      totalSteps: 2,
      prompt: 'can be empty or space for the name',
    });

    picker.onDidTriggerButton(event => {
      picker.hide();
      nameInput.show();
    });

    picker.onDidAccept(event => {
      resolve({
        text: name,
        link: picker.selectedItems.length ? picker.selectedItems[0].label : picker.value
      });
    });

    nameInput.show();
  });
};

module.exports = {
  createNewNode,
  findAllMD,
  showDoc,
}