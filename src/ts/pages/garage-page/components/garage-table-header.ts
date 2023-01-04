import { Control } from '../../../common/templates/control';
import { carsApi } from '../../../common/data/cars-API';

export class GarageTableHeader extends Control {
  // renderGarageTable: CallableFunction = () => { };
  totalCarsCount: HTMLSpanElement;
  currentPageIndicator: HTMLSpanElement;
  prevPageBtn: HTMLButtonElement;
  nextPageBtn: HTMLButtonElement;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);

    this.node.innerHTML = `
      <div class="table-head__information-wrap">
        <div class="table-head__total-indicator-wrap">
          <span class="table-head__total-indicator-label">Total cars</span>
          <span class="table-head__total-indicator-value">unknown</span>
        </div>
        <div class="table-head__page-indicator-wrap">
          <span class="table-head__page-indicator-label">Page #</span>
          <span class="table-head__page-indicator-value">unknown</span>
        </div>
      </div>
      <div class="table-head__navigation-wrap">
        <button class="table-head__navigation table-head__navigation_prev common-btn">prev page</button>
        <button class="table-head__navigation table-head__navigation_next common-btn">next page</button>
      </div>
    `;

    this.totalCarsCount = this.node.querySelector(
      '.table-head__total-indicator-value'
    )!;
    this.currentPageIndicator = this.node.querySelector(
      '.table-head__page-indicator-value'
    )!;
    this.prevPageBtn = this.node.querySelector('.table-head__navigation_prev')!;
    this.nextPageBtn = this.node.querySelector('.table-head__navigation_next')!;

    // this.initListeners();
  }

  // initListeners() {
  //   this.nextPageBtn.addEventListener('click', this.onChangeTablePageListener);
  //   this.prevPageBtn.addEventListener('click', this.onChangeTablePageListener);
  // }

  // async onChangeTablePageListener(event: Event) {
  //   const clickedElement: HTMLElement = event.currentTarget as HTMLElement;
  //   if (clickedElement.classList.contains('table-head__navigation_prev')) {
  //     --carsApi.state.carsCurrentPage;
  //   } else if (clickedElement.classList.contains('table-head__navigation_next')) {
  //     ++carsApi.state.carsCurrentPage;
  //   } else {
  //     console.error(`invalid element for change garage table page: ${clickedElement}`);
  //     return;
  //   }

  //   await carsApi.fetchCarsListToState();
  //   //! функция пробрасывается но в этом месте она снова undefined
  //   console.log(this.renderGarageTable);
  //   this.renderGarageTable();
  // }

  checkIfBtnNeedDisable() {
    const currentPage = carsApi.state.carsCurrentPage;
    const totalPage = Math.ceil(
      carsApi.state.countCars / carsApi.state.limitPageCarsList
    );

    this.prevPageBtn.disabled = false;
    this.nextPageBtn.disabled = false;

    if (currentPage === 1) this.prevPageBtn.disabled = true;
    if (totalPage <= currentPage) this.nextPageBtn.disabled = true;
  }

  render() {
    this.checkIfBtnNeedDisable();
    this.totalCarsCount.textContent = carsApi.state.countCars.toString();
    this.currentPageIndicator.textContent =
      carsApi.state.carsCurrentPage.toString();
    return this.node;
  }
}
