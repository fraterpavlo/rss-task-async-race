import { Control } from '../../../common/templates/control';
import { carsApi } from '../../../common/data/cars-API';
import {
  EWinnersTableOrder,
  EWinnersTableSortMethod,
  IWinnerData,
} from '../../../common/data/interfaces';
import { RowOfWinnersTable } from './templates/row-winners-table';

export class WinnersTableBody extends Control {
  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);
  }

  sortWinnersList() {
    carsApi.state.winners.sort((a: IWinnerData, b: IWinnerData): number => {
      switch (carsApi.state.winnerPageSort) {
        case EWinnersTableSortMethod.id:
          if (!a.id || !b.id) {
            console.error(`winner id for sort not found`);
            return 0;
          }
          return a.id - b.id;
          break;
        case EWinnersTableSortMethod.time:
          return a.time - b.time;
          break;
        case EWinnersTableSortMethod.wins:
          return a.wins - b.wins;
          break;
        default:
          return 0;
      }
    });

    if (carsApi.state.winnerPageOrder === EWinnersTableOrder.DESC)
      carsApi.state.winners.reverse();
  }

  async renderRowsWinnersTable(winnersData: IWinnerData[]) {
    this.node.innerHTML = '';

    winnersData.forEach(async (winnerData) => {
      const newRow = await new RowOfWinnersTable(
        null,
        'div',
        ['table-body__row', 'winner'],
        winnerData
      ).render();

      this.node.append(newRow);
    });
  }

  async render() {
    this.sortWinnersList();
    await this.renderRowsWinnersTable(carsApi.state.winners);
    return this.node;
  }
}
