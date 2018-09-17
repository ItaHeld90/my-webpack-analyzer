import * as React from 'react';
import { observer } from 'mobx-react';
import { ModuleData, rootId } from '..';

export interface AnalyzerMainProps {
	dependencyMap: { [id: number]: number[] };
	sizesMap: { [id: number]: number };
	modulesById: { [id: number]: ModuleData };
	rootId: number;
}

@observer
export class AnalyzerMain extends React.Component<AnalyzerMainProps, {}> {
	render() {
		const { rootId, sizesMap } = this.props;

		return <div>{
			`${rootId}: ${sizesMap[rootId]}`
		}</div>;
	}
}
