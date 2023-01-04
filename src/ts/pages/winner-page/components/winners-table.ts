import { Control } from '../../../common/templates/control';
import { WinnersTableHeader } from './winners-table-header';
import { WinnersTableBody } from './winners-table-body';
import {
  EWinnersTableOrder,
  EWinnersTableSortMethod,
} from '../../../common/data/interfaces';
import { carsApi } from '../../../common/data/cars-API';

export class WinnersTable extends Control {
  winnersTableHeader: WinnersTableHeader;
  winnersTableBody: WinnersTableBody;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);

    this.winnersTableHeader = new WinnersTableHeader(this.node, 'div', [
      'winners-table__head-wrap',
      'table-head',
    ]);
    this.winnersTableBody = new WinnersTableBody(this.node, 'div', [
      'winners-table__body-wrap',
      'table-body',
    ]);

    this.initListeners();
  }

  initListeners() {
    this.winnersTableHeader.choiceSortId.addEventListener(
      'click',
      this.onChangeSortListener.bind(this, EWinnersTableSortMethod.id)
    );
    this.winnersTableHeader.choiceSortWins.addEventListener(
      'click',
      this.onChangeSortListener.bind(this, EWinnersTableSortMethod.wins)
    );
    this.winnersTableHeader.choiceSortTime.addEventListener(
      'click',
      this.onChangeSortListener.bind(this, EWinnersTableSortMethod.time)
    );

    this.winnersTableHeader.prevPageBtn.addEventListener(
      'click',
      this.onChangeTablePageListener.bind(this)
    );
    this.winnersTableHeader.nextPageBtn.addEventListener(
      'click',
      this.onChangeTablePageListener.bind(this)
    );
  }

  async onChangeTablePageListener(event: Event) {
    const clickedElement: HTMLElement = event.currentTarget as HTMLElement;
    if (clickedElement.classList.contains('table-head__navigation_prev')) {
      --carsApi.state.winnersCurrentPage;
    } else if (
      clickedElement.classList.contains('table-head__navigation_next')
    ) {
      ++carsApi.state.winnersCurrentPage;
    } else {
      console.error(
        `invalid element for change winners table page: ${clickedElement}`
      );
      return;
    }
    await carsApi.fetchWinnersListToState();
    await this.render();
  }

  async onChangeSortListener(sortMethod: EWinnersTableSortMethod) {
    if (sortMethod === carsApi.state.winnerPageSort) {
      carsApi.state.winnerPageOrder =
        carsApi.state.winnerPageOrder === EWinnersTableOrder.DESC
          ? EWinnersTableOrder.ASC
          : EWinnersTableOrder.DESC;

      await this.winnersTableBody.render();
      return;
    }

    switch (sortMethod) {
      case EWinnersTableSortMethod.id:
        carsApi.state.winnerPageSort = EWinnersTableSortMethod.id;
        break;
      case EWinnersTableSortMethod.wins:
        carsApi.state.winnerPageSort = EWinnersTableSortMethod.wins;
        break;
      case EWinnersTableSortMethod.time:
        carsApi.state.winnerPageSort = EWinnersTableSortMethod.time;
        break;
      default:
        carsApi.state.winnerPageSort = EWinnersTableSortMethod.id;
        break;
    }

    await this.winnersTableBody.render();
  }

  async render() {
    this.winnersTableHeader.render();
    await this.winnersTableBody.render();
    return this.node;
  }
}
