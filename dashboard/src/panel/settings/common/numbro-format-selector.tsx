import { Group, NumberInput, Select, Stack, Switch, Text } from '@mantine/core';
import numbro from 'numbro';
import React from 'react';
import { ArrowRight } from 'tabler-icons-react';
import { ErrorBoundary } from '../../error-boundary';

export type TNumbroFormat = {
  mantissa: number;
  output: 'percent' | 'number';
  average?: boolean;
  trimMantissa?: boolean;
};

export const defaultNumbroFormat: TNumbroFormat = {
  mantissa: 0,
  output: 'number',
  trimMantissa: false,
  average: false,
};

interface INumbroFormatSelector {
  value: TNumbroFormat;
  onChange: (v: TNumbroFormat) => void;
}

function _NumbroFormatSelector({ value, onChange }: INumbroFormatSelector, ref: $TSFixMe) {
  const changeOutput = (output: TNumbroFormat['output']) => {
    onChange({ ...value, output });
  };
  const changeMantissa = (mantissa: TNumbroFormat['mantissa']) => {
    const trimMantissa = mantissa === 0 ? false : value.trimMantissa;
    onChange({ ...value, mantissa, trimMantissa });
  };
  const changeTrimMantissa = (event: $TSFixMe) => {
    onChange({ ...value, trimMantissa: event.currentTarget.checked });
  };
  const changeAverage = (event: $TSFixMe) => {
    onChange({ ...value, average: event.currentTarget.checked });
  };
  return (
    <Stack ref={ref}>
      <Group grow>
        <Select
          label="Format"
          data={[
            { label: '1234', value: 'number' },
            { label: '99%', value: 'percent' },
          ]}
          value={value.output}
          onChange={changeOutput}
          sx={{ flexGrow: 1 }}
        />
        <Switch
          label={
            <Stack spacing={0}>
              <Text>Average</Text>
              <Text size={12} color="gray">
                like 1.234k, 1.234m
              </Text>
            </Stack>
          }
          checked={value.average}
          onChange={changeAverage}
          disabled={value.output !== 'number'}
          sx={{ flexGrow: 1 }}
          styles={{
            root: {
              alignSelf: 'flex-end',
            },
            body: {
              alignItems: 'center',
            },
            label: {
              display: 'block',
            },
          }}
        />
      </Group>
      <Group grow>
        <NumberInput
          label="Mantissa"
          defaultValue={0}
          min={0}
          step={1}
          max={4}
          value={value.mantissa}
          onChange={changeMantissa}
        />
        <Switch
          label="Trim mantissa"
          checked={value.trimMantissa}
          onChange={changeTrimMantissa}
          disabled={value.mantissa === 0}
          styles={{
            root: {
              alignSelf: 'flex-end',
            },
            body: {
              alignItems: 'center',
            },
          }}
        />
      </Group>
      <Stack spacing={0}>
        <Text weight="bold">Preview</Text>
        <ErrorBoundary>
          <Group position="apart">
            <Text size={12} color="gray">
              123456789 <ArrowRight size={9} /> {numbro(123456789).format(value)}
            </Text>
            <Text size={12} color="gray">
              1234 <ArrowRight size={9} /> {numbro(1234).format(value)}
            </Text>
            <Text size={12} color="gray">
              0.1234 <ArrowRight size={9} /> {numbro(0.1234).format(value)}
            </Text>
          </Group>
        </ErrorBoundary>
      </Stack>
    </Stack>
  );
}

export const NumbroFormatSelector = React.forwardRef(_NumbroFormatSelector);
