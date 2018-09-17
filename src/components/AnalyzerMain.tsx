import * as React from 'react';
import { observer } from 'mobx-react';

import { ModuleData, rootId } from '..';
import { DependencyTree } from './dependency-tree';

export interface AnalyzerMainProps {
	dependencyMap: { [id: number]: number[] };
	sizesMap: { [id: number]: number };
	modulesById: { [id: number]: ModuleData };
	rootId: number;
}

@observer
export class AnalyzerMain extends React.Component<AnalyzerMainProps, {}> {
	render() {
		return (
			<div>
				<DependencyTree {...this.props} />
			</div>
		);
	}
}
