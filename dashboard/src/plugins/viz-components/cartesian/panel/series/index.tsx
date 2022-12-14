import { Button, Group, Stack } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import React from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { SeriesItemField } from './series-item';

interface ISeriesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  data: $TSFixMe[];
}
export function SeriesField({ control, watch, data }: ISeriesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'series',
  });

  const watchFieldArray = watch('series');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addSeries = () =>
    append({
      type: 'bar',
      name: randomId(),
      showSymbol: false,
      symbolSize: 5,
      y_axis_data_key: 'value',
      yAxisIndex: 0,
      label_position: 'top',
      display_name_on_line: false,
      stack: '',
      color: '#000',
      step: false,
      smooth: false,
      barWidth: '10',
      barGap: '0%',
      lineStyle: {
        type: 'solid',
        width: 1,
      },
    });

  const yAxes = watch('y_axes');

  const yAxisOptions = React.useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  return (
    <Stack>
      {controlledFields.map((seriesItem, index) => (
        <SeriesItemField
          key={seriesItem.id}
          control={control}
          index={index}
          remove={remove}
          seriesItem={seriesItem}
          yAxisOptions={yAxisOptions}
          data={data}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={addSeries}>Add a Series</Button>
      </Group>
    </Stack>
  );
}
