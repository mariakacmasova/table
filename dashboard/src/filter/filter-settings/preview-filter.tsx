import React from "react";
import { IDashboardFilter } from "../../types"
import { Filter } from "../filter";
import { Box, Stack, Text } from "@mantine/core";
import { UseFormWatch } from "react-hook-form";
import { IFilterSettingsForm } from "./types";

interface IPreviewFilter {
  filter: IDashboardFilter;
  index: number;
  watch: UseFormWatch<IFilterSettingsForm>;
}
export function PreviewFilter({ filter, index, watch }: IPreviewFilter) {
  // @ts-expect-error
  const [value, setValue] = React.useState(filter.config.default_value)
  watch(`filters.${index}`)
  return (
    <Box sx={{ maxWidth: '30em' }}>
      <Text pb="md" color="gray">Preview</Text>
      <Filter filter={filter} value={value} onChange={setValue} />
    </Box>
  )
}