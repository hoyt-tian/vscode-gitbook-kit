
const Resource = {
  'en-US': {
    'catalog404': 'SUMMARY.md not found',
  },
  'zh-CN': {
    'catalog404': '找不到SUMMARY.md文件',
  }
};

class I18n {
  constructor(language) {
    if (['ch','zh-CN'].indexOf(language)) {
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