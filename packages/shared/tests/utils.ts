import { noop } from "lodash";

export const notImplemented = (name?: string) => {
  it(`🚨 NO IMPLEMENTATION YET 🚨${name ? ` - ${name}`: ''}`, noop);
};

export const doNTimes = (n:number, fn: (iterator: number) => void) => {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
};