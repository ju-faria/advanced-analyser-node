/*
* The path below is not an external module. It's an alias (defined in tsconfig.json) to ./dist/processor.worklet.js
* The AudioWorkletProcessor is bundled first, and later imported here to be bundled as a base64 string, 
* to avoid needing to be manually imported and loaded by this module's consumers
*/
import processor from "processor";
import { AdvancedAnalyserNodeProperties } from "../types";

export const createAdvancedAnalyserNode = async (context: BaseAudioContext, options: AdvancedAnalyserNodeProperties = {}) => {
  if (IS_SERVER) {
    throw new Error(`
      AudioWorkletNode does not exist in this environment: 
      This typically happens if you try to run 'createAdvancedAnalyserNode' in the server
    `);
  } else {
    const processorUrl = "data:application/javascript;base64," + processor;
    await context.audioWorklet.addModule(processorUrl);
    const AdvancedAnalyserNode = (await import("./advanced-analyser-node")).AdvancedAnalyserNode;
    const advancedAnalyser = new AdvancedAnalyserNode(context, {
      ...options,
    });
    return advancedAnalyser;
  }
};
  