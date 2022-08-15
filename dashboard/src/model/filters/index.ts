import _ from 'lodash';
import { types, cast } from 'mobx-state-tree';
import { FilterModel, FilterModelInstance } from './filter';

export const FiltersModel = types
  .model('FiltersModel', {
    original: types.optional(types.array(FilterModel), []),
    current: types.optional(types.array(FilterModel), []),
    values: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
    get changed() {
      return !_.isEqual(self.original, self.current);
    },
    get firstID() {
      if (self.current.length === 0) {
        return undefined;
      }
      return self.current[0].id;
    },
    get inOrder() {
      return _.sortBy(self.current, 'order');
    },
    get empty() {
      return self.current.length === 0;
    },
  }))
  .actions((self) => {
    return {
      reset() {
        self.current = _.cloneDeep(self.original);
      },
      replace(current: Array<FilterModelInstance>) {
        self.current = cast(current);
      },
      append(item: FilterModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      setValues(values: Record<string, any>) {
        self.values = values;
      },
      setValueByKey(key: string, value: Record<string, any>) {
        self.values[key] = value;
      },
      getValueByKey(key: string) {
        return self.values[key];
      },
    };
  });

export * from './filter';

export function getInitialFiltersPayload(filters: FilterModelInstance[]) {
  const values = filters.reduce((ret, filter) => {
    // @ts-expect-error
    ret[filter.key] = filter.config.default_value ?? '';
    return ret;
  }, {} as Record<string, any>);
  return {
    original: filters,
    current: filters,
    values,
  };
}
