export class Control<NodeType extends HTMLElement = HTMLElement>{
  public node: NodeType;

  constructor (parentNode: HTMLElement | null = null, tagName = 'div', classesArr: string[] = [], content = '') {
    const el = document.createElement(tagName);
    el.classList.add(...classesArr);
    el.textContent = content;
    if (parentNode) {
      parentNode.append(el);
    }
    this.node = el as NodeType;
  }

  destroy() {
    this.node.remove();
  }
}

