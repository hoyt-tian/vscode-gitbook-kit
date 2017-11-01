const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const Type = {
    header:0,
    list:1
};

class BookStruct{
    
    constructor(rootPath){
        this.rootPath = rootPath;
        this.outline = {
            level:1,
            type:Type.header,
            children:[]
        };
    }

    parse(lines){
        let current = null;
        lines.forEach((line)=>{
            if(line == null || line.length < 1) return;
            else if(/^#+\s+.+/.test(line)){
                let data = line.match(/^(#+)\s+(.+)/);
                let header = data[1];
                if(header.length === 1){
                    current = this.outline;
                    return;
                }

                while(current.type === Type.list){
                    current = current.parent;
                }


                if(current.level >= header.length){
                    while(current.level+1 > header.length){
                        current = current.parent;
                    }
                }        
                let item  = {
                    level:header.length,
                    type:Type.header,
                    label: data[2],
                    link:null,
                    children:[],
                    parent:current
                };
                current.children.push(item);
                current.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
                current = item;         
            }else if(/^\*+\s+\[.+\]\(.+\)/.test(line)){
                let data = line.match(/^(\*+)\s+\[(.+)\]\((.+)\)/);

                let item = {
                    level:data[1].length,
                    type:Type.list,
                    label: data[2],
                    link:data[3],
                    children:[],
                    parent:current
                };
                while(current.type === Type.list && current.level > data[1].length){
                    ;
                }
                if(current.type === Type.header){
                    current.children.push(item);
                    current.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
                    current = item;
                }else{
                    if(current.level < data[1].length){
                        current.children.push(item);
                        current.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;                        
                        current = item;
                    }else if(current.level === data[1].length){
                        item.parent = current.parent;
                        current.parent.children.push(item);
                        current.parent.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;                        
                        current = item;
                    }
                }
            }
        });
        return this.outline.children;
    }

    getTreeItem(element){
        return element;
    }
    
    getChildren(element){
		return new Promise(resolve => {
			if (element) {
				resolve(element.children);
			} else {
                const outline = path.join(this.rootPath, 'SUMMARY.md');
                try{
                    this.parse(fs.readFileSync(outline,'utf8').split(/\r?\n/));
                    resolve(this.outline.children);
                }catch(e){
                    vscode.window.showErrorMessage(e.toString());
                    resolve([]);
                }
			}
		});
	}
}

let triggerFlag = false;

class Gitbook{

    constructor(context){
        this.context = context;
        context.subscriptions.push(this.disposable());  
        this.statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);      
        this.statusItem.text = 'Markdown Example Code';
        this.statusItem.command = "extension.markdownExample";
        this.statusItem.tooltip = "Show Markdown Code Examples";
    }

    openTreeItem(node){
        try{
            let file = path.join(vscode.workspace.rootPath, node.link ? node.link : "SUMMARY.md");
            return vscode.window.showTextDocument(vscode.Uri.file(file)).then(()=>{
                return Gitbook.previewToRight();
            }).then( ()=>{}, (e)=>console.error(e) );
        }catch(e){
            vscode.window.showWarningMessage("Can't find SUMMARY.md file in project root folder");        
        }
        
    }

    markdownExample(){
        return vscode.workspace.openTextDocument({
            content:"# Markdown Help\n"+
                    "| **Markdown**  | Result |\n"+
                    "| --------      | :----: |\n"+
                    "| \\*\\*text\\*\\*  | **blod** |\n"+
                    "| \\*text\\*	    | *Emphasize* |\n"+
                    "| \\~\\~text\\~\\~	    | ~~strike through~~ |\n"+
                    "| \\[text\\]\\(https://www.hoyt-tian.com/\\)	    | [link](https://www.hoyt-tian.com/)	 |\n"+
                    "|\\`code\\`   |	`Inline Code` |\n"+
                    "|\\!\\[alt\\]\\(uri\\)	|Image|\n"+
                    "| \\* item	| List |\n"+
                    "| \\> quote	| Blockquote |\n"+
                    "| \\# h1 | H1 |\n"+
                    "| \\# h2 | H2 |\n"+
                    "| \\# h3 | H3 |\n\n"+
                    "For further Markdown syntax reference: [Markdown Documentation](https://guides.github.com/features/mastering-markdown/#examples)"
            ,
            language:"markdown"
        }).then((doc)=>{
            return vscode.window.showTextDocument(doc).then(()=>{
                return Gitbook.previewToRight();
            }).then( ()=>{}, (e)=>console.error(e) );
        });
    }

    static previewToRight() {
        return vscode.commands.executeCommand("workbench.action.closeEditorsInOtherGroups")
        .then(() => vscode.commands.executeCommand("markdown.showPreviewToSide"))
        .then(() => {}, (e) => console.error(e));
    }

    static isMarkdown(doc){
        return doc && doc.languageId === 'markdown';
    }

    disposable(){
        let result = [];
        let openFlag = false;
        let lastFile = null;
        let openPreview = ()=>{
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                let doc = editor.document;
                if (Gitbook.isMarkdown(doc) && (doc.fileName != lastFile)) {
                    Gitbook.previewToRight();
                    lastFile = doc.fileName;
                    openFlag = true;
                }
            }
        };

        if(!this.bookStruct){
            this.bookStruct = new BookStruct(vscode.workspace.rootPath);
            vscode.window.registerTreeDataProvider('bookstruct', this.bookStruct);            
        }

        result.push(vscode.commands.registerCommand('extension.iedit', this.openTreeItem));

        vscode.workspace.onDidOpenTextDocument((doc)=>{

        });
        
        if(vscode.window.activeTextEditor){
            openPreview();
        }

        vscode.window.onDidChangeActiveTextEditor((active)=>{
            if(active && Gitbook.isMarkdown(active.document)){
                openPreview();                    
            }
        });
       

        result.push(vscode.commands.registerCommand('extension.markdownExample', this.markdownExample));

        if(vscode.window.activeTextEditor){
            if(vscode.window.activeTextEditor.document && vscode.window.activeTextEditor.document === "markdown"){
                this.statusItem.show();
            }
        }
        vscode.window.onDidChangeActiveTextEditor((function($this){
            return ()=>{
                let active = vscode.window.activeTextEditor;
                try{
                    if(active && active.document && active.document.languageId === "markdown"){
                        $this.statusItem.show();
                    }else{
                        $this.statusItem.hide();
                    }
                }catch(e){
                    // vscode.window.showErrorMessage(e.toString());
                    $this.statusItem.hide();                
                }
            }
        })(this));
        return result;
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "gitbook-kit" is now active!');
    let openFlag = false;
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
   
    const kit = new Gitbook(context);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;