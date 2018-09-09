
const Resource = {
  'en-US': {
    'catalog404': 'SUMMARY.md not found',
    'link404': 'Current link is broken, please pick up a file',
    'selectNode': 'Please select a node',
    'typeNodeName': 'Please type node name',
  },
  'zh-CN': {
    'catalog404': '找不到SUMMARY.md文件',
    'link404': '链接资源丢失，请重新选择文件资源',
    'selectNode': '请选中一个节点',
    'typeNodeName': '请输入节点名称',
  }
};

class I18n {
  constructor(language) {
    if (['zh' , 'cn' ,'zh-CN'].indexOf(language)) {
      this.language = 'zh-CN';
    } else {
      this.language = 'en-US';
    }
  }
  
  get(key, dkey = 'en-US') {
    let lang = Resource[this.language];
    if (lang && lang[key]) {
      return lang[key];
    } else if (Resource[dkey] && Resource[dkey][key]) {
      return Resource[dkey][key]
    } else {
      return `\$${key}-not-found-in-${this.language}\$`;
    }
  }
}

module.exports = I18n;