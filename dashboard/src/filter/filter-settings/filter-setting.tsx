import { Box, Divider, Group, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import React from "react";
import { Control, Controller, FieldArrayWithId, UseFormWatch } from "react-hook-form";
import { FilterEditorCheckbox } from "../filter-checkbox/editor";
import { FilterEditorDateRange } from "../filter-date-range/editor";
import { FilterEditorMultiSelect } from "../filter-multi-select/editor";
import { FilterEditorSelect } from "../filter-select/editor";
import { FilterEditorTextInput } from "../filter-text-input/editor";
import { PreviewFilter } from "./preview-filter";
import { IFilterSettingsForm } from "./types";

const editors = {
  'select': FilterEditorSelect,
  'multi-select': FilterEditorMultiSelect,
  'text-input': FilterEditorTextInput,
  'checkbox': FilterEditorCheckbox,
  'date-range': FilterEditorDateRange,
}

const filterTypeOptions = [
  { label: 'Select', value: 'select' },
  { label: 'Multi Select', value: 'multi-select' },
  { label: 'Text Input', value: 'text-input' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Date Range', value: 'date-range' },
]

interface IFilterSetting {
  field: FieldArrayWithId<IFilterSettingsForm, "filters", "id">;
  index: number;
  control: Control<IFilterSettingsForm, object>;
  watch: UseFormWatch<IFilterSettingsForm>;
}

export function FilterSetting({ field, index, control, watch }: IFilterSetting) {
  const FilterEditor = React.useMemo(() => {
    return editors[field.type]
  }, [field.type]);

  return (
    <SimpleGrid cols={2}>
      <Box pl="md">
        <Text pb="md" color="gray">Edit</Text>
        <Stack sx={{ maxWidth: '30em' }}>
          <Controller
            name={`filters.${index}.order`}
            control={control}
            render={({ field }) => (
              <TextInput label="Placement Order" required {...field} />
            )}
          />
          <Controller
            name={`filters.${index}.key`}
            control={control}
            render={({ field }) => (
              <TextInput label="Key" placeholder="A unique key to refer" required {...field} />
            )}
          />
          <Controller
            name={`filters.${index}.label`}
            control={control}
            render={({ field }) => (
              <TextInput label="Label" placeholder="Label for this field" required {...field} />
            )}
          />
          <Controller
            name={`filters.${index}.type`}
            control={control}
            render={({ field }) => (
              <Select label="Widget" data={filterTypeOptions} required {...field} />
            )}
          />
          <FilterEditor field={field} index={index} control={control} watch={watch} />
        </Stack>
      </Box>
      <PreviewFilter filter={field} index={index} watch={watch} />
    </SimpleGrid>
  )
}