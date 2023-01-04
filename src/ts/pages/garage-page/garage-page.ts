import { Control } from '../../common/templates/control';
import { GarageTable } from './components/garage-table';
import { GarageSettings } from './components/garage-settings';
import { carsApi } from '../../common/data/cars-API';

export class GaragePage extends Control {
  container: Control<HTMLElement>;
  garageSettings: GarageSettings;
  garageTable: GarageTable;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = [],
    id: string
  ) {
    super(parentNode, tagName, classesArr);
    this.node.id = id;
    this.container = new Control(this.node, 'div', [
      'garage__container',
      'container',
    ]);

    this.garageSettings = new GarageSettings(this.container.node, 'div', [
      'garage__settings-wrap',
      'garage-settings',
    ]);
    this.garageTable = new GarageTable(this.container.node, 'div', [
      'garage__table',
      'garage-table',
    ]);

    this.initListeners();
    this.passFunctionToComponents();
  }

  initListeners() {
    this.garageSettings.createCarBtn.addEventListener(
      'click',
      this.onCreateCarListener.bind(this)
    );
  }

  passFunctionToComponents() {
    this.garageSettings.renderGarageTable = this.garageTable.render.bind(
      this.garageTable
    );
    this.garageTable.garageTableBody.setUpdateInputsInGarage =
      this.garageSettings.setUpdateInputs.bind(this.garageSettings);
    this.garageTable.garageTableBody.setListenerForUpdateBtnInGarage =
      this.garageSettings.setListenerForUpdateBtn.bind(this.garageSettings);
    this.garageTable.pullRowsInstancesArrFromGarageTableToGarageSettings =
      this.pullRowsInstancesArrFromGarageTableToGarageSettings.bind(this);
  }

  pullRowsInstancesArrFromGarageTableToGarageSettings() {
    this.garageSettings.rowsInstancesArrInGarageTable =
      this.garageTable.garageTableBody.rowsInstancesArr;
  }

  async onCreateCarListener() {
    if (this.garageSettings.createCarTextInput.value.trim() === '') return;

    const carData = {
      name: this.garageSettings.createCarTextInput.value,
      color: this.garageSettings.createCarColorInput.value,
    };
    this.garageSettings.resetCreateInputs();
    await carsApi.createCar(carData);
    await this.garageTable.render();
  }

  async render() {
    await carsApi.fetchCarsListToState();
    this.garageTable.render();
    this.passFunctionToComponents();
    return this.node;
  }
}
