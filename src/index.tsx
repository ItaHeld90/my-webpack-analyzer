import * as React from "react";
import * as ReactDOM from "react-dom";

import { AnalyzerMain } from "./components/AnalyzerMain";
import { dependencyMap, sizesMap, modulesById } from './index';

console.log(sizesMap);

ReactDOM.render(
    <AnalyzerMain />,
    document.getElementById("example")
);