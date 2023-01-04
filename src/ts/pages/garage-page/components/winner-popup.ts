import { Control } from '../../../common/templates/control';

export class WinnerPopup extends Control {
  backArea: HTMLDivElement;
  body: HTMLDivElement;
  closeBtn: HTMLButtonElement;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = [],
    content: string = 'content not found'
  ) {
    super(parentNode, tagName, classesArr);

    this.node.innerHTML = `
      <div class="popup__back-area">
        <div class="popup__body">
          ${content}
          <button class="popup__close-btn common-btn">OK</button>
        </div>
      </div>
    `;

    this.backArea = this.node.querySelector('.popup__back-area')!;
    this.body = this.node.querySelector('.popup__body')!;
    this.closeBtn = this.node.querySelector('.popup__close-btn')!;

    this.backArea.addEventListener('click', (e) => {
      e.stopPropagation();
      this.destroy();
    });
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.destroy();
    });
  }

  render() {
    return this.node;
  }
}
