declare function _default(commandLineArgs: any): {
    input: string;
    output: {
        file: string;
        format: string;
        name: string;
    };
    plugins: import("rollup").Plugin[];
}[];
export default _default;
