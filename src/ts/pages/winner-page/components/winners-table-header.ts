import { Control } from '../../../common/templates/control';
import { carsApi } from '../../../common/data/cars-API';

export class WinnersTableHeader extends Control {
  // onChangeSortListener: CallableFunction = () => { };
  winnersTotalCount: HTMLSpanElement;
  winnersCurrentPageIndicator: HTMLSpanElement;
  prevPageBtn: HTMLButtonElement;
  nextPageBtn: HTMLButtonElement;
  choiceSortId: HTMLDivElement;
  choiceSortWins: HTMLDivElement;
  choiceSortTime: HTMLDivElement;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);

    this.node.innerHTML = `
      <div class="table-head__information-wrap">
        <div class="table-head__total-indicator-wrap">
          <span class="table-head__total-indicator-label">Winners:</span>
          <span class="table-head__total-indicator-value">unknown</span>
        </div>
        <div class="table-head__page-indicator-wrap">
          <span class="table-head__page-indicator-label">Page #</span>
          <span class="table-head__page-indicator-label">unknown</span>
        </div>
      </div>
      <div class="table-head__navigation-wrap">
        <button class="table-head__navigation table-head__navigation_prev common-btn">prev page</button>
        <button class="table-head__navigation table-head__navigation_next common-btn">next page</button>
      </div>
      <div class="table-head__table-hat-wrap table-hat">
        <div class="table-hat__id">ID</div>
        <div class="table-hat__car">Car</div>
        <div class="table-hat__name">Name</div>
        <div class="table-hat__wins">Wins</div>
        <div class="table-hat__best-time">Best time</div>
      </div>
    `;

    this.winnersTotalCount = this.node.querySelector(
      '.table-head__total-indicator-value'
    )!;
    this.winnersCurrentPageIndicator = this.node.querySelector(
      '.table-head__page-indicator-label'
    )!;
    this.prevPageBtn = this.node.querySelector('.table-head__navigation_prev')!;
    this.nextPageBtn = this.node.querySelector('.table-head__navigation_next')!;
    this.choiceSortId = this.node.querySelector('.table-hat__id')!;
    this.choiceSortWins = this.node.querySelector('.table-hat__wins')!;
    this.choiceSortTime = this.node.querySelector('.table-hat__best-time')!;
  }

  checkIfBtnNeedDisable() {
    const currentPage = carsApi.state.winnersCurrentPage;
    const totalPage = Math.ceil(
      carsApi.state.countWinners / carsApi.state.limitPageWinnersList
    );

    this.prevPageBtn.disabled = false;
    this.nextPageBtn.disabled = false;

    if (currentPage === 1) this.prevPageBtn.disabled = true;
    if (totalPage <= currentPage) this.nextPageBtn.disabled = true;
  }

  render() {
    this.checkIfBtnNeedDisable();
    this.winnersTotalCount.textContent = carsApi.state.countWinners.toString();
    this.winnersCurrentPageIndicator.textContent =
      carsApi.state.winnersCurrentPage.toString();

    return this.node;
  }
}
