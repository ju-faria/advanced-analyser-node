import { fill } from "lodash";
import { WindowFunctionTypes } from "../types";
import { notImplemented } from "../../tests/utils";
import { windowFunctionsMap} from "./window-functions";

const testWindowResult = (windowFn: (samples: Float32Array, alpha?:number) => void, expected: Float32Array|number[], tolerance = 7) => {
  const array = Float32Array.from(fill(new Array(expected.length), 1));
  windowFn(array);
  array.forEach((val, i) => {
    expect(val).toBeCloseTo(expected[i], tolerance);
  });
};


describe("Window functions", () => {
  it("rectangular", () => {
    // rectangular window function does essentially nothing to the signal
    [
      [1, 1 ,1 ,1],
      [1, 1, 1 ,1, 1],
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap.rectangular, expected);
    });

  });
  it("hann", () => {
    [
      [0, 0.25, 0.75, 1.0, 0.75, 0.25,0],
      [0, 0.1882550990706332, 0.6112604669781572, 0.9504844339512095, 0.9504844339512095, 0.6112604669781572, 0.1882550990706332, 0],
      [0, 0.3454915028125263, 0.9045084971874737, 0.9045084971874737, 0.3454915028125263, 0],
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap.hann, expected);
    });
  });
  it("hamming", () => {
    [
      [0.08, 0.2531946911449826, 0.6423596296199047, 0.9544456792351128, 0.9544456792351128,  0.6423596296199047, 0.2531946911449826, 0.08],
      [0.08, 0.3978521825875242, 0.9121478174124757, 0.9121478174124757, 0.3978521825875242, 0.08],
      [0.08, 0.31, 0.77, 1.0, 0.77, 0.31, 0.08]
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap.hamming, expected);
    });
  });
  it("bartlett", () => {
    [
      [0, 0.4, 0.8, 0.8, 0.4, 0],
      [0, 1/3, 2/3, 1.0, 2/3, 1/3, 0],
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap.bartlett, expected);
    });
  });
  notImplemented("tukey");
  it("blackman", () => {
    const array = Float32Array.from(fill(new Array(7), 1));
    windowFunctionsMap.blackman(array);
    [
      [0, 0.13, 0.63, 1.0, 0.63, 0.13, 0],
      [0, 0.09045342435412804, 0.4591829575459636, 0.9203636180999081, 0.9203636180999081, 0.4591829575459636, 0.09045342435412804, 0],
      [0, 0.2007701432625305, 0.8492298567374694, 0.8492298567374694, 0.2007701432625305, 0],
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap.blackman, expected);
    });
  });

  it("nuttall", () => {
    [
      [0,0.09866506606340408,0.7907549142837524,0.7907549142837524,0.09866506606340408,0]
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap.nuttall, expected);
    });
  });

  it("blackmanNuttall", () => {
    [
      [0.00036279999767430127,0.11051525175571442,0.7982581257820129,0.7982581257820129,0.11051525175571442,0.00036279999767430127]
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap[WindowFunctionTypes.blackmanNuttall], expected);
    });
  });

  it("blackmanHarris", () => {
    [
      [0.00005999999848427251,0.10301148891448975,0.7938334941864014,0.7938334941864014,0.10301148891448975,0.00005999999848427251]
    ].forEach((expected) => {
      testWindowResult(windowFunctionsMap[WindowFunctionTypes.blackmanHarris], expected);
    });
  });
});