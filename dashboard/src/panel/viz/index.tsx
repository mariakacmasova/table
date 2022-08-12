import React from 'react';
import _ from 'lodash';
import { useElementSize } from '@mantine/hooks';
import { LoadingOverlay, Text } from '@mantine/core';

import { Sunbrust } from './sunburst';
import { VizCartesianChart } from './cartesian';
import { VizTable } from './table';
import { VizBar3D } from './bar-3d';
import './index.css';
import { IVizConfig } from '../../types/dashboard';
import { VizPie } from './pie';
import { VizStats } from './stats';
import { ErrorBoundary } from '../error-boundary';
import { VizRichText } from './rich-text';
import { observer } from 'mobx-react-lite';

function renderViz(width: number, height: number, data: any[], viz: IVizConfig) {
  const props = { width, height, data, conf: viz.conf };
  switch (viz.type) {
    case 'sunburst':
      return <Sunbrust {...props} />;
    case 'cartesian':
      // @ts-expect-error
      return <VizCartesianChart {...props} />;
    case 'table':
      // @ts-expect-error
      return <VizTable {...props} />;
    case 'stats':
      // @ts-expect-error
      return <VizStats {...props} />;
    case 'rich-text':
      // @ts-expect-error
      return <VizRichText {...props} />;
    case 'bar-3d':
      return <VizBar3D {...props} />;
    case 'pie':
      return <VizPie {...props} />;
    default:
      return null;
  }
}

const typesDontNeedData = ['rich-text'];

interface IViz {
  viz: IVizConfig;
  data: any;
  loading: boolean;
}

export const Viz = observer(function _Viz({ viz, data, loading }: IViz) {
  const { ref, width, height } = useElementSize();
  const empty = React.useMemo(() => !Array.isArray(data) || data.length === 0, [data]);

  const needData = !typesDontNeedData.includes(viz.type);
  if (!needData) {
    return (
      <div className="viz-root" ref={ref}>
        <ErrorBoundary>{renderViz(width, height, data, viz)}</ErrorBoundary>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="viz-root" ref={ref}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
      </div>
    );
  }
  return (
    <div className="viz-root" ref={ref}>
      {empty && (
        <Text color="gray" align="center">
          nothing to show
        </Text>
      )}
      {!empty && <ErrorBoundary>{renderViz(width, height, data, viz)}</ErrorBoundary>}
    </div>
  );
});
