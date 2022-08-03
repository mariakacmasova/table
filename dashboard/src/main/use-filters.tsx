import React from "react";
import { IDashboard, IDashboardFilter } from "../types";

export function useFilters(dashboard: IDashboard) {
  const [filters, setFilters] = React.useState<IDashboardFilter[]>(dashboard.filters);
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>(() => {
    const filters = dashboard.filters;
    return filters.reduce((ret, filter) => {
      // @ts-expect-error
      ret[filter.key] = filter.config.default_value ?? ''
      return ret;
    }, {} as Record<string, any>)
  });
  return {
    filters, setFilters,
    filterValues, setFilterValues,
  }
}