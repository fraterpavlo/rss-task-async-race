import { getRandomCarName, getRandomColor } from '../utils/utils';
import {
  ICarData,
  IWinnerData,
  EWinnersTableSortMethod,
  EWinnersTableOrder,
  IState,
  EnumEngineStatus,
} from './interfaces';

const baseUrl = 'http://127.0.0.1:3000';
const garage = `${baseUrl}/garage`;
const winners = `${baseUrl}/winners`;
const engine = `${baseUrl}/engine`;

export class CarsAPI {
  private _state: IState = {
    cars: [],
    countCars: 0,
    carsCurrentPage: 1,
    limitPageCarsList: 7,
    winners: [],
    countWinners: 0,
    winnersCurrentPage: 1,
    limitPageWinnersList: 10,
    currentUpdateCarId: null,
    generateManyCarsCount: 100,
    animatedCarsData: {},
    isWinnerAlreadyChosen: false,
    canceledRase: false,
    winnerPageSort: EWinnersTableSortMethod.id,
    winnerPageOrder: EWinnersTableOrder.ASC,
  };

  get state(): IState {
    return this._state;
  }

  set state(newState: IState) {
    this._state = newState;
  }

  async fetchCarsListToState() {
    const response = await fetch(
      `${garage}?_page=${this.state.carsCurrentPage}&_limit=${this.state.limitPageCarsList}`
    );
    const cars: ICarData[] = await response.json();
    const countCars = +response.headers.get('X-Total-Count')!;
    this.state.cars = cars;
    this.state.countCars = countCars;
    // return {cars, countCars};
  }

  async getSpecifiedCar(id: number) {
    const response = await fetch(`${garage}/${id}`);
    return await response.json();
  }

  async createCar(carData: ICarData) {
    await fetch(garage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    });
    await this.fetchCarsListToState();

    // return await response.json();
  }

  async deleteCar(id: number) {
    await fetch(`${garage}/${id}`, {
      method: 'DELETE',
    });
    await this.fetchCarsListToState();
    // return await response.json();
  }

  async fetchWinnersListToState() {
    const currentPage = this.state.winnersCurrentPage;
    const limitPage = this.state.limitPageWinnersList;

    const response = await fetch(
      `${winners}?_page=${currentPage}&_limit=${limitPage}&_sort=${this.state.winnerPageSort}&_order=${this.state.winnerPageOrder}`
    );
    const winnerCars: IWinnerData[] = await response.json();
    const countWinners = +response.headers.get('X-Total-Count')!;
    this.state.winners = winnerCars;
    this.state.countWinners = countWinners;
    // return {winnerCars, countWinners};
  }

  async updateWinner(winnerData: IWinnerData) {
    await fetch(`${winners}/${winnerData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerData),
    });
    await this.fetchWinnersListToState();
    // return await response.json();
  }

  async createWinner(winnerData: IWinnerData) {
    await fetch(winners, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerData),
    });
    await this.fetchWinnersListToState();
    // return await response.json();
  }

  async deleteWinner(id: number) {
    await fetch(`${winners}/${id}`, {
      method: 'DELETE',
    });
    await this.fetchWinnersListToState();
    // await response.json();
  }

  async updateCar(carData: ICarData, CarId: number) {
    await fetch(`${garage}/${CarId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    });
    await this.fetchCarsListToState();
    // return await response.json();
  }

  async generateManyCars() {
    const allPromisesArr: Promise<void>[] = [];
    for (let i = 0; i < this.state.generateManyCarsCount; i++) {
      const carData = {
        name: getRandomCarName(),
        color: getRandomColor(),
      };
      allPromisesArr.push(this.createCar(carData));
    }
    await Promise.all(allPromisesArr);
    await this.fetchCarsListToState();
  }

  async setStatusForCarsEngine(id: number, status: EnumEngineStatus) {
    const response = await fetch(`${engine}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    return await response.json();
  }
}

export const carsApi = new CarsAPI();
