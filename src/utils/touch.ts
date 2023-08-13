export function addEvent(
  el: EventTarget,
  type: string,
  fn: EventListener,
  capturing?: boolean
) {
  return el.addEventListener(type, fn, capturing ?? { passive: true });
}

export function removeEvent(
  el: EventTarget,
  type: string,
  fn: EventListener,
  capturing?: boolean
) {
  return el.removeEventListener(type, fn, capturing);
}

const touch = {
  mouseup: "touchend",
  mouseout: "touchend",
  mousedown: "touchstart",
  mousemove: "touchmove",
};

type MouseType = "mouseup" | "mouseout" | "mousedown" | "mousemove";

export type TouchyEvent = MouseEvent & TouchEvent;

/**
 * @from https://github.com/bevacqua/dragula/blob/e0bcdc72ae8e0b85e17f154957bdd0cc2e2e35db/dragula.js#L498
 */
export function touchy(
  el: EventTarget,
  // eslint-disable-next-line @typescript-eslint/ban-types
  event: Function,
  type: MouseType,
  fn: (evt: TouchyEvent) => void
) {
  event(el, touch[type], fn);
  event(el, type, fn);
}
