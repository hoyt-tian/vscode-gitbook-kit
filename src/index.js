const Gitbook = require('./gitbook');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const extension = new Gitbook();

module.exports = {
    activate: extension.active.bind(extension),
    deactivate: extension.deactive.bind(extension),
};
