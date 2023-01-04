import { Control } from '../../common/templates/control';
import { carsApi } from '../../common/data/cars-API';
import { WinnersTable } from './components/winners-table';

export class WinnersPage extends Control {
  container: Control<HTMLElement>;
  winnersTable: WinnersTable;

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = [],
    id: string
  ) {
    super(parentNode, tagName, classesArr);
    this.node.classList.add(`${id}`, 'page');
    this.node.id = id;
    this.container = new Control(this.node, 'div', [
      'winners__container',
      'container',
    ]);

    this.winnersTable = new WinnersTable(this.container.node, 'div', [
      'winners__table',
      'winners-table',
    ]);
  }

  async render() {
    await carsApi.fetchWinnersListToState();
    await this.winnersTable.render();
    return this.node;
  }
}
