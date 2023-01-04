import { Control } from '../../../common/templates/control';
import { ICarData } from '../../../common/data/interfaces';
import { carsApi } from '../../../common/data/cars-API';
import { RowOfCarsTable } from './templates/row-garage-table';
export class GarageSettings extends Control {
  renderGarageTable: CallableFunction = () => {};
  rowsInstancesArrInGarageTable?: RowOfCarsTable[];
  createCarTextInput: HTMLInputElement;
  createCarColorInput: HTMLInputElement;
  createCarBtn: HTMLButtonElement;
  updateCarTextInput: HTMLInputElement;
  updateCarColorInput: HTMLInputElement;
  updateCarBtn: HTMLButtonElement;
  raceBtn: HTMLButtonElement;
  resetRaceBtn: HTMLButtonElement;
  generateCarsBtn: HTMLButtonElement;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);

    this.node.innerHTML = `
      <div class="garage-settings__create-wrap create-car">
        <span class="create-car__label">Create car :</span>
        <div class="create-car__settings-wrap create-settings">
          <span class="create-settings__name-label">name</span>
          <input class="create-settings__name-input" type="text" id="create-input">
          <span class="create-settings__color-label">color</span>
          <input class="create-settings__color-input" type="color" name="color" id="create-color" value="#000000">
          <button class="create-settings__create-btn common-btn">create</button>
        </div>
      </div>

      <div class="garage-settings__update-wrap update-car">
        <div class="update-car__label">Update car :</div>
        <div class="update-car__settings-wrap update-settings">
          <span class="update-settings__name-label ">name</span>
          <input class="update-settings__name-input" type="text" id="update-input" disabled>
          <span class="update-settings__color-label">color</span>
          <input class="update-settings__color-input" type="color" id="update-color" value="#c2c2c2" disabled>
          <button class="update-settings__update-btn common-btn" disabled>update</button>
        </div>
      </div>

      <div class="garage-settings__main-btns-wrap main-btns">
        <button class="main-btns__race-btn common-btn">Race</button>
        <button class="main-btns__reset-btn common-btn">Reset</button>
        <button class="main-btns__generate-btn common-btn">Generate 100 cars</button>
      </div>
    `;

    this.createCarTextInput = this.node.querySelector('#create-input')!;
    this.createCarColorInput = this.node.querySelector('#create-color')!;
    this.createCarBtn = this.node.querySelector(
      '.create-settings__create-btn'
    )!;

    this.updateCarTextInput = this.node.querySelector('#update-input')!;
    this.updateCarColorInput = this.node.querySelector('#update-color')!;
    this.updateCarBtn = this.node.querySelector(
      '.update-settings__update-btn'
    )!;

    this.raceBtn = this.node.querySelector('.main-btns__race-btn')!;
    this.resetRaceBtn = this.node.querySelector('.main-btns__reset-btn')!;
    this.generateCarsBtn = this.node.querySelector('.main-btns__generate-btn')!;

    this.initListeners();
  }

  initListeners() {
    this.generateCarsBtn.addEventListener(
      'click',
      this.onGenerateCarsBtnListener.bind(this)
    );

    this.resetRaceBtn.addEventListener(
      'click',
      this.onResetRaceBtnListener.bind(this)
    );

    this.raceBtn.addEventListener('click', this.onRaceBtnListener.bind(this));
  }

  async onGenerateCarsBtnListener() {
    this.generateCarsBtn.disabled = true;

    await carsApi.generateManyCars();
    await this.renderGarageTable();

    this.generateCarsBtn.disabled = false;
  }

  setUpdateInputs(carData: ICarData) {
    this.makeUpdateSettingsClickable();
    this.updateCarTextInput.value = carData.name;
    this.updateCarColorInput.value = carData.color;
  }

  setListenerForUpdateBtn(carId: number) {
    const bindUpdateCarBtnListener = this.updateCarBtnListener.bind(this);
    const alreadyBeginUpdateCarId = carsApi.state.currentUpdateCarId;
    if (alreadyBeginUpdateCarId) {
      //! не удаляет слушателя
      this.updateCarBtn.removeEventListener('click', bindUpdateCarBtnListener);
      carsApi.state.currentUpdateCarId = null;
    }

    if (!carsApi.state.currentUpdateCarId) {
      carsApi.state.currentUpdateCarId = carId;
      this.updateCarBtn.addEventListener('click', bindUpdateCarBtnListener, {
        once: true,
      });
    }
  }

  async updateCarBtnListener() {
    const carData = {
      name: this.updateCarTextInput.value,
      color: this.updateCarColorInput.value,
    };
    const carId = carsApi.state.currentUpdateCarId;
    await carsApi.updateCar(carData, carId!);
    await this.renderGarageTable();

    this.resetUpdateInputs();
    this.makeUpdateSettingsDisable();

    carsApi.state.currentUpdateCarId = null;
  }

  resetCreateInputs() {
    this.createCarTextInput.value = '';
    this.createCarColorInput.value = '#000000';
  }

  resetUpdateInputs() {
    this.updateCarTextInput.value = '';
    this.updateCarColorInput.value = '#c2c2c2';
  }

  makeUpdateSettingsClickable() {
    this.updateCarTextInput.disabled = false;
    this.updateCarColorInput.disabled = false;
    this.updateCarBtn.disabled = false;
  }

  async onResetRaceBtnListener() {
    if (!this.rowsInstancesArrInGarageTable) {
      console.error('rowsInstancesArrInGarageTable for reset not found');
      return;
    }
    carsApi.state.canceledRase = true;
    const allResetPromises: Promise<void>[] = [];
    this.rowsInstancesArrInGarageTable.forEach((rowOfTable) =>
      allResetPromises.push(
        rowOfTable.onResetBtnListener(rowOfTable.carData.id!)
      )
    );

    await Promise.allSettled(allResetPromises);
    this.setSettingsIntoDefaultStates();
  }

  async onRaceBtnListener() {
    if (!this.rowsInstancesArrInGarageTable) {
      console.error('rowsInstancesArrInGarageTable for race not found');
      return;
    }

    carsApi.state.canceledRase = false;
    carsApi.state.isWinnerAlreadyChosen = false;
    this.setSettingsIntoRaceStates();

    const allGoPromises: Promise<void>[] = [];
    this.rowsInstancesArrInGarageTable.forEach((rowOfTable) =>
      allGoPromises.push(rowOfTable.onGoBtnListener(rowOfTable.carData, true))
    );

    await Promise.allSettled(allGoPromises);
  }

  makeUpdateSettingsDisable() {
    this.updateCarTextInput.disabled = true;
    this.updateCarColorInput.disabled = true;
    this.updateCarBtn.disabled = true;
  }

  setSettingsIntoRaceStates() {
    this.makeUpdateSettingsDisable();
    this.createCarTextInput.disabled = true;
    this.createCarColorInput.disabled = true;
    this.createCarBtn.disabled = true;
    this.raceBtn.disabled = true;
    this.generateCarsBtn.disabled = true;
    this.resetRaceBtn.disabled = false;
  }

  setSettingsIntoDefaultStates() {
    this.createCarTextInput.disabled = false;
    this.createCarColorInput.disabled = false;
    this.createCarBtn.disabled = false;
    this.raceBtn.disabled = false;
    this.generateCarsBtn.disabled = false;
    this.resetRaceBtn.disabled = false;
  }
}
