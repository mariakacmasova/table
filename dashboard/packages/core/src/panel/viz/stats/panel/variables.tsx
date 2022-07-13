import { Button, Group, Text } from "@mantine/core";
import React from "react";
import { Control, useFieldArray, UseFormWatch } from "react-hook-form";
import { IVizStatsConf } from "../types";
import { VariableField } from "./variable";
import { getANewVariable } from '../../../../utils/template/editor';

interface IVariablesField {
  control: Control<IVizStatsConf, any>;
  watch: UseFormWatch<IVizStatsConf>;
  data: any[];
}
export function VariablesField({ control, watch, data }: IVariablesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variables"
  });

  const watchFieldArray = watch("variables");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const add = () => append(getANewVariable());

  return (
    <Group direction="column" grow>
      {controlledFields.map((_variableItem, index) => (
        <VariableField
          control={control}
          index={index}
          remove={remove}
          data={data}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>
          Add a Variable
        </Button>
      </Group>
    </Group>
  )
}
