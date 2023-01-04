import { Header } from '../pages/common/header';
import { GaragePage } from '../pages/garage-page/garage-page';
import { WinnersPage } from '../pages/winner-page/winner-page';
import { Footer } from '../pages/common/footer';
import { IPagesForLinks } from '../common/data/interfaces';

export class Router {
  appContainer: HTMLDivElement;
  links: IPagesForLinks;
  
  constructor () {
    this.appContainer = document.querySelector('#app')!;
    this.links = {
      garage: new GaragePage(null, 'div', ['garage', 'page'], 'garage'),
      winners: new WinnersPage(null, 'div', ['winners', 'page'], 'winners'),
    }
  }

  async updatePage() {
    const page = location.hash.slice(1) || 'garage';
    const pageHTML = await this.links[page].render();
    this.appContainer.innerHTML = '';
    this.appContainer.append(pageHTML || `page ${page} not found`);
  }

  // updateState (state: {'page': string}) {
  //   if (!state) return;

  //   this.appContainer.innerHTML = '';
  //   this.appContainer.append(this.links[state.page] || `page ${state.page} not found`);
  // }

  // changePage(link: string) {
  //   const state = {
  //     page: link
  //   };
  //   history.pushState(state, '', state.page);
  //   this.updateState(state);
  // }

  async start() {
    document.body.prepend(new Header(null).node);
    document.body.append(new Footer(null).node);

    window.addEventListener('hashchange', this.updatePage.bind(this));
    window.addEventListener('load', this.updatePage.bind(this));
    

    // window.addEventListener('load', () => {
    //   const currentUrl = window.location.href || document.URL;
    //   const link = currentUrl.split('/').slice(-1).join('') || 'garage';
    //   this.changePage(link);
    // })

    // document.addEventListener('popstate', function(e) {
    //   updateState(e.state);
    // })

  }
  
}


export const routerInstance = new Router();
