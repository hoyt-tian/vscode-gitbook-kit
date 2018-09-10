class Outline {
  constructor() {
    this.children = [];
    this.level = 0;
    this.type = '#';
  }

  static from(text = '') {
    const outline = new Outline();
    const lines = text.split(/\r?\n/);
    const hReg = /[#\*]+\s+\[.+\]\(.*\)/;
    const hRgroup = /([#\*]+)\s+\[(.+)\]\((.*)\)/;

    let parent = outline;

    lines.forEach(line => {
      if(line == null || line.length < 1) return;
      else if(hReg.test(line)) {
        const data = line.match(hRgroup);
        const item = {
          type: data[1][0],
          level: data[1].length,
          text: data[2],
          link: data[3] || null,
          parent: parent
        };
        
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

  toText() {
    const lines = [];
    const flattern = (children, result) => {
      children.forEach(item => {
        result.push(`${new Array(item.level).fill(item.type).join('')} [${item.text}](${item.link}) `);
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