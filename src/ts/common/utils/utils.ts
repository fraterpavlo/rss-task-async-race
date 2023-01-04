import { carsModels } from '../data/cars-models';
import { carsBrands } from '../data/cars-brands';
import { IDriveAnimationResponse } from '../data/interfaces';

export function getRandomNum(min: number, max: number) {
  const minN = Math.ceil(min);
  const maxN = Math.floor(max);
  return Math.floor(Math.random() * (maxN - minN + 1)) + minN;
}

export function getRandomColor() {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[getRandomNum(0, letters.length - 1)];
  }
  return color;
}

export function getRandomCarName() {
  const brand = carsBrands[getRandomNum(0, carsBrands.length - 1)];
  const model = carsModels[getRandomNum(0, carsModels.length - 1)];
  return `${brand} ${model}`;
}

export function getCenterOfPosition(element: HTMLElement) {
  const { top, left, width, height } = element.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

export function getDistanceBetweenElements(el1: HTMLElement, el2: HTMLElement) {
  const Position1 = getCenterOfPosition(el1);
  const Position2 = getCenterOfPosition(el2);
  return Math.hypot(Position1.x - Position2.x, Position1.y - Position2.y);
}

export function driveAnimation(
  carImage: HTMLElement,
  distance: number,
  duration: number
) {
  function step(time: number) {
    let timePart = (time - startTime) / duration;
    if (timePart > 1) timePart = 1;

    const progress = timePart * distance;
    state.progress = progress;
    carImage.style.transform = `translate(${progress}px)`;

    timePart < 1
      ? (state.AnimationFrameId = window.requestAnimationFrame(step))
      : (state.ended = true);
  }

  let startTime = performance.now();
  const state: IDriveAnimationResponse = {
    AnimationFrameId: window.requestAnimationFrame(step),
    progress: 0,
    ended: false,
    stopped: false,
  };

  return state;
}
