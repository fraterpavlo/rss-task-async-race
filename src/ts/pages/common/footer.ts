import { Control } from '../../common/templates/control';

export class Footer extends Control {
  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = ['footer']
  ) {
    super(parentNode, tagName, classesArr);

    this.node.innerHTML = `
      <div class="container footer__container">
        <div class="personal-data">
          <span class="personal-data__year">© 2022</span>
          <a href="https://rs.school/js/" target="_blank">
            <span class="personal-data__school-icon"></span>
          </a>
          <a href="https://github.com/fraterpavlo" target="_blank">
            <span class="personal-data__github">fraterpavlo</span>
          </a>
        </div>
      </div>
  `;
  }
}
