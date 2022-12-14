import { Box, Divider, Group, NumberInput, Select, Stack, Switch } from '@mantine/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';

const stepOptions = [
  { label: 'off', value: 'false' },
  { label: 'start', value: 'start' },
  { label: 'middle', value: 'middle' },
  { label: 'end', value: 'end' },
];

const lineTypeOptions = [
  { label: 'solid', value: 'solid' },
  { label: 'dashed', value: 'dashed' },
  { label: 'dotted', value: 'dotted' },
];

interface ILineFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
}

export function LineFields({ control, index }: ILineFields) {
  return (
    <>
      <Divider mb={-15} variant="dashed" label="Line Settings" labelPosition="center" />
      <Group grow>
        <Controller
          name={`series.${index}.lineStyle.type`}
          control={control}
          render={({ field }) => <Select label="Line Type" data={lineTypeOptions} sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.lineStyle.width`}
          control={control}
          render={({ field }) => <NumberInput label="Line Width" min={1} max={10} sx={{ flexGrow: 1 }} {...field} />}
        />
      </Group>
      <Group grow align="center">
        <Controller
          name={`series.${index}.step`}
          control={control}
          render={({ field }) => (
            <Select
              label="Step"
              data={stepOptions}
              sx={{ flexGrow: 1, maxWidth: '48%' }}
              {...field}
              value={String(field.value)}
              onChange={(v: string) => {
                const step = v === 'false' ? false : v;
                field.onChange(step);
              }}
            />
          )}
        />
        <Stack>
          <Controller
            name={`series.${index}.smooth`}
            control={control}
            render={({ field }) => (
              <Box sx={{ flexGrow: 1 }}>
                <Switch
                  label="Smooth Line"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              </Box>
            )}
          />
          <Controller
            name={`series.${index}.display_name_on_line`}
            control={control}
            render={({ field }) => (
              <Box sx={{ flexGrow: 1 }}>
                <Switch
                  label="Display Name on Line"
                  checked={field.value ?? false}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              </Box>
            )}
          />
        </Stack>
      </Group>
    </>
  );
}
