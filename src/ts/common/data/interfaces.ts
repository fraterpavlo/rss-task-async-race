import { GaragePage } from '../../pages/garage-page/garage-page';
import { WinnersPage } from '../../pages/winner-page/winner-page';

export interface IPagesForLinks {
  [page: string]: GaragePage | WinnersPage;
}

export interface ICarData {
  name: string;
  color: string;
  id?: number;
}

export interface IWinnerData {
  wins: number;
  time: number;
  id?: number;
}

export enum EWinnersTableSortMethod {
  id = 'id',
  wins = 'wins',
  time = 'time',
}
export enum EWinnersTableOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IDriveAnimationResponse {
  AnimationFrameId: number;
  progress: number;
  ended: boolean;
  stopped: boolean;
}

interface IAnimatedCarsData {
  [key: number]: IDriveAnimationResponse;
}
export interface IState {
  cars: ICarData[];
  countCars: number;
  carsCurrentPage: number;
  limitPageCarsList: number;
  winners: IWinnerData[];
  countWinners: number;
  winnersCurrentPage: number;
  limitPageWinnersList: number;
  currentUpdateCarId: number | null;
  generateManyCarsCount: number;
  animatedCarsData: IAnimatedCarsData;
  isWinnerAlreadyChosen: boolean;
  canceledRase: boolean;
  winnerPageSort: EWinnersTableSortMethod;
  winnerPageOrder: EWinnersTableOrder;
}

export enum EnumEngineStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}

export interface IStartEngineResponse {
  velocity: number;
  distance: number;
}
