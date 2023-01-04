import { Control } from '../../../../common/templates/control';
import { IWinnerData, ICarData } from '../../../../common/data/interfaces';
import { carsApi } from '../../../../common/data/cars-API';
import { WinnerCarImage } from './winner-image-template';

export class RowOfWinnersTable extends Control {
  winnerId!: number | null;
  winnerName: HTMLSpanElement;
  carIconSvg: HTMLSpanElement;

  constructor(
    parentNode: HTMLElement | null = null,
    tagName = 'div',
    classesArr: string[] = [],
    winnerData: IWinnerData
  ) {
    super(parentNode, tagName, classesArr);

    if (winnerData.id) {
      this.winnerId = winnerData.id;
      // this.node.id = winnerData.id.toString();
      this.node.dataset.winnerId = winnerData.id.toString();
    } else {
      console.error('invalid id of winner');
      this.winnerId = null;
      // this.node.id = 'unknown';
      this.node.dataset.winnerId = 'unknown';
    }

    this.node.innerHTML = `
      <span class="winner__id">${winnerData.id}</span>
      <span class="winner__car-image-wrap"></span>
      <span class="winner__name">unknown</span>
      <span class="winner__wins">${winnerData.wins}</span>
      <span class="winner__best-time">${winnerData.time} s</span>
    `;

    this.winnerName = this.node.querySelector('.winner__name')!;
    this.carIconSvg = this.node.querySelector('.winner__car-image-wrap')!;
  }

  drawCarImage(color: string) {
    this.carIconSvg.innerHTML = new WinnerCarImage(
      null,
      'div',
      ['car__image'],
      color
    ).render();
  }

  async getCarDataFromApi(id: number): Promise<ICarData> {
    return await carsApi.getSpecifiedCar(id);
  }

  async render() {
    if (this.winnerId) {
      const carDataResponse = await this.getCarDataFromApi(this.winnerId);
      this.winnerName.textContent = carDataResponse.name;
      this.drawCarImage(carDataResponse.color);
    }
    return this.node;
  }
}
