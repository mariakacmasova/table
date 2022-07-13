import { ActionIcon, Group, NumberInput, Select, Text, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Trash } from "tabler-icons-react";
import { DataFieldSelector } from "../../../../settings/common/data-field-selector";
import { MantineColorSelector } from "../../../../settings/common/mantine-color";
import { ICartesianChartConf, IRegressionConf } from "../../type";

const regressionOptions = [
  { label: 'Linear', value: 'linear', },
  { label: 'Exponential', value: 'exponential', },
  { label: 'Logarithmic', value: 'logarithmic', },
  { label: 'Polynomial', value: 'polynomial', },
]

interface IRegressionField {
  control: Control<ICartesianChartConf, any>;
  regressionItem: IRegressionConf;
  index: number;
  remove: UseFieldArrayRemove;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
  data: any[];
}

export function RegressionField({ control, regressionItem, index, remove, yAxisOptions, data }: IRegressionField) {
  const method = regressionItem.transform.config.method;
  return (
    <Group key={index} direction="column" grow my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Controller
        name={`regressions.${index}.name`}
        control={control}
        render={(({ field }) => (
          <TextInput
            label="Name"
            required
            sx={{ flex: 1 }}
            {...field} />
        ))}
      />
      <Group direction="row" grow noWrap>
        <Controller
          name={`regressions.${index}.y_axis_data_key`}
          control={control}
          render={(({ field }) => (
            <DataFieldSelector label="Value Field" required data={data} sx={{ flex: 1 }} {...field} />
          ))}
        />
        <Controller
          name={`regressions.${index}.plot.yAxisIndex`}
          control={control}
          render={(({ field: { value, onChange, ...rest } }) => (
            <Select
              label="Y Axis"
              data={yAxisOptions}
              disabled={yAxisOptions.length === 0}
              {...rest}
              value={value?.toString() ?? ''}
              onChange={(value: string | null) => {
                if (!value) {
                  onChange(0);
                  return;
                }
                onChange(Number(value))
              }}
              sx={{ flex: 1 }}
            />

          ))}
        />
      </Group>
      <Group direction="row" grow noWrap>
        <Controller
          name={`regressions.${index}.transform.config.method`}
          control={control}
          render={(({ field }) => (
            <Select
              label="Method"
              data={regressionOptions}
              sx={{ flex: 1 }}
              {...field} />
          ))}
        />
        {method === 'polynomial' && (
          <Controller
            name={`regressions.${index}.transform.config.order`}
            control={control}
            render={(({ field }) => <NumberInput label="Order" sx={{ flex: 1 }} {...field} />)}
          />
        )}
      </Group>
      <Group direction="column" grow spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`regressions.${index}.plot.color`}
          control={control}
          render={(({ field }) => (
            <MantineColorSelector {...field} />
          ))}
        />
      </Group>
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>

  )
}