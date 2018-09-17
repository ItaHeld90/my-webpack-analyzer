import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AnalyzerMain } from './components/AnalyzerMain';
import { dependencyMap, sizesMap, modulesById, rootId } from './index';

ReactDOM.render(
	<AnalyzerMain dependencyMap={dependencyMap} sizesMap={sizesMap} modulesById={modulesById} rootId={rootId} />,
	document.getElementById('example')
);
