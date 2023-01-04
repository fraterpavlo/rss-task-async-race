import { Control } from '../../common/templates/control';

//!кажется, читабельнее и проще делать через innerHTML
// interface INavbarLinkData {
//   hash: string;
//   linkClass: string;
//   linkTextContent: string;
// }

// export const headerLinksDataArr: INavbarLinkData[] = [
//   {
//     hash: "garage",
//     linkClass: "header__navbar-link",
//     linkTextContent: "to garage",
//   },
//   {
//     hash: "winners",
//     linkClass: "header__navbar-link",
//     linkTextContent: "to winners",
//   },
// ];

export class Header extends Control {
  toGarageLink: HTMLLinkElement;
  toWinnersLink: HTMLLinkElement;
  // navbarAllLinks: NodeListOf<Element>;
  // headerContainer: Control<HTMLElement>;
  // navbar: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = ['header']
  ) {
    super(parentNode, tagName, classesArr);

    // this.headerContainer = new Control(this.node, "div", ["container", "header__container"]);
    // this.navbar = this.createNavbar();

    this.node.innerHTML = `
      <div class="container header__container">
        <ul class="header__navbar">
          <li class="header__navbar-item">
            <a class="header__navbar-link" 
              href="#garage" >to garage</a>
          </li>
          <li class="header__navbar-item">
            <a class="header__navbar-link" 
              href="#winners">to winners</a>
          </li>
        </ul>
      </div>
    `;

    this.toGarageLink = this.node.querySelector(
      '.header__navbar-link[href="#garage"]'
    )!;
    this.toWinnersLink = this.node.querySelector(
      '.header__navbar-link[href="#winners"]'
    )!;

    window.addEventListener(
      'hashchange',
      this.updateActivePageIndicator.bind(this)
    );
    window.addEventListener('load', this.updateActivePageIndicator.bind(this));
    // this.navbarAllLinks = this.node.querySelectorAll('.header__navbar-link')!;
    // this.navbarAllLinks.forEach(element => {
    //   element.addEventListener('click', this.linkOnClickListener);
    // });
  }

  updateActivePageIndicator() {
    const hash = location.hash.slice(1) || 'garage';

    switch (hash) {
      case 'garage':
        this.toGarageLink.classList.add('active-page');
        this.toWinnersLink.classList.remove('active-page');
        break;
      case 'winners':
        this.toWinnersLink.classList.add('active-page');
        this.toGarageLink.classList.remove('active-page');
        break;
      default:
        console.error(`${hash} page not found`);
    }
  }

  // createNavbar() {
  //   const headerNavBar = new Control(this.headerContainer.node, "ul", ["header__navbar"]);

  //   headerLinksDataArr.forEach(linkData => {
  //     const navbarItem = new Control(headerNavBar.node, "li", ["header__navbar-item"]);

  //     const navbarLink = new Control(navbarItem.node, "a", [`${linkData.linkClass}`], `${linkData.linkTextContent}`);
  //     (navbarLink.node as HTMLLinkElement).href = `#${linkData.hash}`;
  //     navbarLink.node.setAttribute("data-page", linkData.hash);
  //     // navbarLink.node.dataset.page = linkData.hash;

  //     if (navbarLink.node.getAttribute("data-page") === headerLinksDataArr[0].hash) navbarLink.node.classList.add("active-page");
  //   })

  //   return headerNavBar;
  // }

  //!не работает роутинг через history при перезагрузке страницы
  // linkOnClickListener(e: Event) {
  //   if ((e.target as HTMLElement).tagName !== 'A') return;
  //   e.preventDefault();

  //   const link = (e.target as HTMLLinkElement).getAttribute('href') || 'garage';
  //   routerInstance.changePage(link)
  // }
}
