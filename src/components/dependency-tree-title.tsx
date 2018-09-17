import * as React from 'react';
import { ModuleData } from '..';
import { Tooltip } from 'antd';
import { getFileName } from '../utils/helper-utils';

import 'antd/lib/tooltip/style/css';

export interface DependencyTreeTitleProps {
	moduleData: ModuleData;
	calculatedSize: number;
}

export class DependencyTreeTitle extends React.Component<DependencyTreeTitleProps> {
	render() {
		const { moduleData, calculatedSize } = this.props;

		return (
			<div style={{ display: 'flex' }}>
				<div style={{ marginRight: 10 }}>
					<Tooltip placement="rightBottom" title={moduleData.name}>
						{getFileName(moduleData.name)}
					</Tooltip>
				</div>
				<div style={{ display: 'flex', flex: 1, color: '#ddd', justifyContent: 'space-around' }}>
					<div style={{ marginRight: 10 }}>{`self size: ${moduleData.size}`}</div>
					<div style={{ marginRight: 10 }}>{`total size: ${calculatedSize}`}</div>
				</div>
			</div>
		);
	}
}