import { Control } from '../../../common/templates/control';
import { carsApi } from '../../../common/data/cars-API';
import { ICarData } from '../../../common/data/interfaces';
import { RowOfCarsTable } from './templates/row-garage-table';

export class GarageTableBody extends Control {
  renderGarageTable: CallableFunction = () => {};
  setUpdateInputsInGarage: CallableFunction = () => {};
  setListenerForUpdateBtnInGarage: CallableFunction = () => {};
  rowsInstancesArr!: RowOfCarsTable[];

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);
    this.renderGarageTable(carsApi.state.cars);
  }

  renderRowsCarsTable(carsData: ICarData[]) {
    this.node.innerHTML = '';

    this.rowsInstancesArr = carsData.map((carData) => {
      const rowInstance = new RowOfCarsTable(
        this.node,
        'div',
        ['table-body__row', 'car'],
        carData
      );

      //passFunctionToComponents
      rowInstance.renderGarageTable = this.renderGarageTable;
      rowInstance.setUpdateInputsInGarage = this.setUpdateInputsInGarage;
      rowInstance.setListenerForUpdateBtnInGarage =
        this.setListenerForUpdateBtnInGarage;

      return rowInstance;
    });
  }

  render() {
    this.renderRowsCarsTable(carsApi.state.cars);
    return this.node;
  }
}
