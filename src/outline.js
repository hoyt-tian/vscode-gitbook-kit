class Outline {
  constructor() {
    this.children = [];
    this.level = 0;
    this.type = '#';
  }


  static from(text = '') {
    const outline = new Outline();
    const lines = text.split(/\r?\n/);
    const hReg = /[#\*\t]+\s+\[.+\]\(.*\)/;
    const hRgroup = /([#\*\t]+)\s+\[(.+)\]\((.*)\)/;

    const hlReg = /^#\s+.+/
    const slReg = /^\*\s+.*/
    const tlReg = /^\s+\*\s+.*/
    const linkReg = /\[.+\]\(.*\)/
    const linkGroup = /\[(.+)\]\((.*)\)/


    let parent = outline;

    lines.forEach(line => {
      if(line == null || line.length < 1) return;
      else {
        let data = null;
        const item = {
          type: null,
          level: -1,
          text: null,
          link: null,
          parent: null,
        };
        if (hlReg.test(line)) {
          item.type = '#';
          item.level = 1;
          if (linkReg.test(line)) {
            data  = line.match(linkGroup);
            item.text = data[1];
            item.link = data[2];
          } else {
            data = line.match(/#\s+(.*)/);
            item.link = null;
            item.text = data[1];
          }
        } else if (slReg.test(line)) {
          item.level = 2;
          if (linkReg.test(line)) {
            data  = line.match(linkGroup);
            item.text = data[1];
            item.link = data[2];
          } else {
            data = line.match(/\*\s+(.*)/);
            item.link = null;
            item.text = data[1];
          }
        } else if (tlReg.test(line)) {
          item.level = 3;
          if (linkReg.test(line)) {
            data  = line.match(linkGroup);
            item.text = data[1];
            item.link = data[2];
          } else {
            data = line.match(/\s+\*\s+(.*)/);
            item.link = null;
            item.text = data[1];
          }
        } else if (hReg.test(lilne)){
          data = line.match(hRgroup);
          item.type = data[1][0];
          item.level = data[1].length;
          item.text = data[2];
          item.link = data[3];
          item.parent = parent;
        } else {
          return;
        }
        
        if (item.level === parent.level) { // 新节点与当前parent节点平级
          parent = parent.parent;
          item.parent = parent;
          parent.children.push(item);
        } else if (item.level < parent.level ) {  // 新节点比当前parent节点level小，任意级别跨越
          for(let i = parent.level - item.level; i >= 0; i--) {
            parent = parent.parent;
          }
          item.parent = parent;
          parent.children.push(item);
        } else if (item.level === parent.level + 1) { // 新节点比当前parent节点level大1级，恰好是paren的子节点
          parent.children = parent.children || [];
          item.parent = parent
          parent.children.push(item);
        } else if (item.level === parent.level + 2) { // 新节点比当前parent节点level大2级，是parent最后一个子节点的子节点
          parent = parent.children[parent.children.length - 1];
          parent.children = parent.children || [];
          item.parent = parent
          parent.children.push(item);
        } else { // 其他情况都是异常
          throw new Error('unexception case');
        }
      }
    });
    return outline;
  }

  static toLevel(item) {
    switch(item.level) {
      case 1:
        return '#';
      case 2:
        return '*';
      case 3:
        return '\t*';
      default:
        return new Array(item.level).fill(item.type).join('');
    }
  }

  toText() {
    const lines = [];
    const flattern = (children, result) => {
      children.forEach(item => {
        result.push(`${Outline.toLevel(item)} [${item.text}](${item.link}) `);
        if (item.children && item.children.length) {
          flattern(item.children, result);
        }
      });
    }
    flattern(this.children, lines);
    return lines.join('\r\n');
  }
}

module.exports = Outline;