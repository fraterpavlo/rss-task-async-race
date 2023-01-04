import { Control } from '../../../common/templates/control';
import { GarageTableHeader } from './garage-table-header';
import { GarageTableBody } from './garage-table-body';
import { carsApi } from '../../../common/data/cars-API';

export class GarageTable extends Control {
  pullRowsInstancesArrFromGarageTableToGarageSettings: CallableFunction =
    () => {};
  garageTableHeader: GarageTableHeader;
  garageTableBody: GarageTableBody;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);

    this.garageTableHeader = new GarageTableHeader(this.node, 'div', [
      'garage-table__head-wrap',
      'table-head',
    ]);
    this.garageTableBody = new GarageTableBody(this.node, 'div', [
      'garage-table__body-wrap',
      'table-body',
    ]);

    this.initListeners();
    this.passFunctionToComponents();
  }

  initListeners() {
    this.garageTableHeader.nextPageBtn.addEventListener(
      'click',
      this.onChangeTablePageListener.bind(this)
    );
    this.garageTableHeader.prevPageBtn.addEventListener(
      'click',
      this.onChangeTablePageListener.bind(this)
    );
  }

  passFunctionToComponents() {
    this.garageTableBody.renderGarageTable = this.render.bind(this);
  }

  async onChangeTablePageListener(event: Event) {
    const clickedElement: HTMLElement = event.currentTarget as HTMLElement;
    if (clickedElement.classList.contains('table-head__navigation_prev')) {
      --carsApi.state.carsCurrentPage;
    } else if (
      clickedElement.classList.contains('table-head__navigation_next')
    ) {
      ++carsApi.state.carsCurrentPage;
    } else {
      console.error(
        `invalid element for change garage table page: ${clickedElement}`
      );
      return;
    }

    await carsApi.fetchCarsListToState();
    this.render();
  }

  async render() {
    this.garageTableHeader.render();
    this.garageTableBody.render();
    this.pullRowsInstancesArrFromGarageTableToGarageSettings();
    return this.node;
  }
}
