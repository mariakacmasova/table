import { Box, Group, Table, Text } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { ScatterChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
/* @ts-expect-error type defs of echarts-stats */
import { transform } from 'echarts-stat';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaultsDeep } from 'lodash';
import numbro from 'numbro';
import { useMemo } from 'react';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { getOption } from './option';
import { getRegressionDescription } from './option/regression-expression';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

echarts.use([DataZoomComponent, ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
echarts.registerTransform(transform.regression);

export function VizRegressionChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;

  // convert strings as numbers
  const data = useMemo(() => {
    const rawData = context.data as $TSFixMe[];
    const key = conf?.regression?.y_axis_data_key;
    if (!key) {
      return rawData;
    }
    return rawData.map((row) => {
      if (typeof row[key] === 'number') {
        return row;
      }
      return {
        ...row,
        [key]: Number(row[key]),
      };
    });
  }, [context.data, conf?.regression.y_axis_data_key]);

  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), data);
  }, [conf, data]);

  const { expression, rSquared, adjustedRSquared } = useMemo(() => {
    return getRegressionDescription(data, conf);
  }, [conf, data]);

  if (!width || !height || !conf) {
    return null;
  }
  let finalHeight = height;
  if (expression) {
    finalHeight -= 20;
  }
  return (
    <Box>
      {expression && (
        <Text align="center" size={12}>
          {expression}
        </Text>
      )}
      <Group spacing={0} noWrap align="start" sx={{ '> *': { flexGrow: 0, flexShrink: 0 } }}>
        <ReactEChartsCore echarts={echarts} option={option} style={{ width: width - 190, height: finalHeight }} />
        {rSquared && (
          <Table mt={20} fontSize={12} sx={{ width: 180, border: '1px solid #999', td: { padding: '3px 8px' } }}>
            <tbody>
              <tr>
                <td>R-Sq</td>
                <td style={{ textAlign: 'right' }}>{numbro(rSquared).format({ output: 'percent', mantissa: 1 })}</td>
              </tr>
              <tr>
                <td>R-Sq(Adjusted)</td>
                <td style={{ textAlign: 'right' }}>
                  {numbro(adjustedRSquared).format({ output: 'percent', mantissa: 1 })}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </Group>
    </Box>
  );
}
