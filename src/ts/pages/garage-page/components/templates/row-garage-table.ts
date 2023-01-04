import { Control } from '../../../../common/templates/control';
import {
  ICarData,
  EnumEngineStatus,
  IStartEngineResponse,
} from '../../../../common/data/interfaces';
import { carsApi } from '../../../../common/data/cars-API';
import {
  getDistanceBetweenElements,
  driveAnimation,
} from '../../../../common/utils/utils';
import { WinnerPopup } from '../winner-popup';
import { GarageCarImage } from './car-image-template';

export class RowOfCarsTable extends Control {
  renderGarageTable: CallableFunction = () => {};
  setUpdateInputsInGarage: CallableFunction = () => {};
  setListenerForUpdateBtnInGarage: CallableFunction = () => {};
  carData: ICarData;
  editBtn: HTMLButtonElement;
  removeBtn: HTMLButtonElement;
  goBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  carIconSvg: HTMLSpanElement;
  finishLine: HTMLSpanElement;
  nameSpan: HTMLSpanElement;

  constructor(
    parentNode: HTMLElement | null = null,
    tagName = 'div',
    classesArr: string[] = [],
    carData: ICarData
  ) {
    super(parentNode, tagName, classesArr);
    if (typeof carData.id !== 'number') {
      console.error(`invalid car id fo create garage table row: ${carData.id}`);
      carData.id = Infinity;
    }
    this.carData = carData;

    this.node.innerHTML = `
      <div class="car__btns-wrap car-btns">
        <div class="car-btns__cahnge-column-wrap">
          <button class="car__btn car__btn_edit common-btn">edit</button>
          <button class="car__btn car__btn_remove common-btn">remove</button>
        </div>
        <div class="car-btns__action-column-wrap">
          <button class="car__btn car__btn_go common-btn">go</button>
          <button class="car__btn car__btn_reset common-btn" disabled>reset</button>
        </div>
      </div>
      <div class="car__image-contain">${this.drawCarImage(carData.color)}</div>
      <span class="car__finishline"></span>
      <span class="car__name">${carData.name}</span>
    `;

    this.editBtn = this.node.querySelector('.car__btn_edit')!;
    this.removeBtn = this.node.querySelector('.car__btn_remove')!;
    this.goBtn = this.node.querySelector('.car__btn_go')!;
    this.resetBtn = this.node.querySelector('.car__btn_reset')!;
    this.carIconSvg = this.node.querySelector('.car__image-contain')!;
    this.finishLine = this.node.querySelector('.car__finishline')!;
    this.nameSpan = this.node.querySelector('.car__name')!;
    // this.carIconSvg.style.backgroundColor = carData.color;
    this.nameSpan.style.color = carData.color; //! Изменить подход к присваиванию цвета

    this.initListeners(carData);
  }

  drawCarImage(color: string) {
    return new GarageCarImage(null, 'div', ['car__image'], color).render();
  }

  initListeners(carData: ICarData) {
    this.removeBtn.addEventListener('click', () => {
      if (!carData.id) {
        console.error(`invalid car data: carData.id = ${carData.id}`);
        return;
      }
      this.onRemoveBtnListener(carData.id);
    });

    this.editBtn.addEventListener('click', () => {
      this.onEditBtnListener(carData);
    });

    this.goBtn.addEventListener('click', () => {
      if (!this.carData.id) {
        console.error(`invalid car data: carData.id = ${carData.id}`);
        return;
      }
      this.onGoBtnListener(this.carData);
    });

    this.resetBtn.addEventListener('click', () => {
      if (!carData.id) {
        console.error(`invalid car data: carData.id = ${carData.id}`);
        return;
      }
      this.onResetBtnListener(carData.id);
    });
  }

  async onRemoveBtnListener(carId: number) {
    const countCarsInGarage = carsApi.state.countCars;
    const limitPageGarageTable = carsApi.state.limitPageCarsList;
    if ((countCarsInGarage - 1) % limitPageGarageTable === 0)
      carsApi.state.carsCurrentPage =
        carsApi.state.carsCurrentPage > 1 ? --carsApi.state.carsCurrentPage : 1;

    const countCarsInWinners = carsApi.state.countWinners;
    const limitPageWinnersTable = carsApi.state.limitPageWinnersList;
    if ((countCarsInWinners - 1) % limitPageWinnersTable === 0) {
      carsApi.state.winnersCurrentPage =
        carsApi.state.winnersCurrentPage > 1
          ? --carsApi.state.winnersCurrentPage
          : 1;
    }

    await carsApi.deleteCar(carId);
    const isWinner = carsApi.state.winners.some(
      (itemData) => itemData.id === carId
    );
    if (isWinner) await carsApi.deleteWinner(carId);
    await this.renderGarageTable();
  }

  async onEditBtnListener(carData: ICarData) {
    if (!carData.id) {
      console.error(`invalid car id for edit car: ${carData.id}`);
      return;
    }
    this.setUpdateInputsInGarage(carData);
    this.setListenerForUpdateBtnInGarage(carData.id);
  }

  setBtnsIntoRaceStatus() {
    this.editBtn.disabled = true;
    this.removeBtn.disabled = true;
    this.goBtn.disabled = true;
    this.resetBtn.disabled = false;
  }

  setBtnsIntoDefaultStatus() {
    this.editBtn.disabled = false;
    this.removeBtn.disabled = false;
    this.goBtn.disabled = false;
    this.resetBtn.disabled = true;
  }

  async onGoBtnListener(carData: ICarData, isRace?: boolean) {
    if (!carData.id) return;
    this.setBtnsIntoRaceStatus();
    const carImage = this.carIconSvg;
    const finishLine = this.finishLine;

    let drivingDuration;
    try {
      const startEngineResponse: IStartEngineResponse =
        await carsApi.setStatusForCarsEngine(
          carData.id,
          EnumEngineStatus.started
        );
      drivingDuration =
        startEngineResponse.distance / startEngineResponse.velocity;
    } catch (error) {
      console.error(error);
      return;
    }

    // добавляю половину длины машины чтобы машина полностью пересекала финиш
    const halfCarImageWidth = carImage.getBoundingClientRect().width / 2;
    const distanceToFinish = Math.floor(
      getDistanceBetweenElements(carImage, finishLine) + halfCarImageWidth
    );
    carsApi.state.animatedCarsData[carData.id] = driveAnimation(
      carImage,
      distanceToFinish,
      drivingDuration
    );

    try {
      const driveEngineResponse = await carsApi.setStatusForCarsEngine(
        carData.id,
        EnumEngineStatus.drive
      );

      if (isRace) {
        const isFinishReached =
          carsApi.state.animatedCarsData[carData.id].progress >=
          distanceToFinish;
        const isWinnerOfCurrentRace =
          !carsApi.state.isWinnerAlreadyChosen &&
          !carsApi.state.canceledRase &&
          driveEngineResponse.success &&
          isFinishReached;

        if (isWinnerOfCurrentRace)
          await this.chooseWinnerOfRace(drivingDuration, carData);
      }
    } catch (error) {
    } finally {
      if (carsApi.state.animatedCarsData[carData.id]) {
        const IdOfCurrentAnimationFrame =
          carsApi.state.animatedCarsData[carData.id].AnimationFrameId;
        cancelAnimationFrame(IdOfCurrentAnimationFrame);
        delete carsApi.state.animatedCarsData[carData.id];
      }

      await carsApi.setStatusForCarsEngine(
        carData.id,
        EnumEngineStatus.stopped
      );
    }
  }

  async chooseWinnerOfRace(time: number, carData: ICarData) {
    const currentTimeOfRace = +(time / 1000).toFixed(2);
    carsApi.state.isWinnerAlreadyChosen = true;
    const winnerAnnouncementContent = `${carData.name} wins <br> Time: ${currentTimeOfRace}s`;
    this.showWinnerPopup(winnerAnnouncementContent);
    let isAlreadyWon = carsApi.state.winners.some(
      (winnerData) => winnerData.id === carData.id
    );

    if (isAlreadyWon) {
      const currentWinnerData = carsApi.state.winners.find(
        (winnerData) => winnerData.id === carData.id
      )!;

      ++currentWinnerData.wins;
      currentWinnerData.time =
        currentTimeOfRace < currentWinnerData.time
          ? currentTimeOfRace
          : currentWinnerData.time;

      await carsApi.updateWinner(currentWinnerData);
    } else {
      const winnerData = {
        id: carData.id,
        wins: 1,
        time: currentTimeOfRace,
      };
      await carsApi.createWinner(winnerData);
    }
  }

  showWinnerPopup(message: string) {
    new WinnerPopup(
      this.node,
      'div',
      ['popup', 'winner-popup', 'active'],
      message
    );
  }

  async onResetBtnListener(carId: number) {
    if (carsApi.state.animatedCarsData[carId])
      cancelAnimationFrame(
        carsApi.state.animatedCarsData[carId].AnimationFrameId
      );

    this.carIconSvg.style.transform = 'translate(0px)';
    await carsApi.setStatusForCarsEngine(carId, EnumEngineStatus.stopped);
    this.setBtnsIntoDefaultStatus();
  }

  render() {
    return this.node;
  }
}
