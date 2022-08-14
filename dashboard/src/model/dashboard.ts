import _ from 'lodash';
import { types, Instance } from 'mobx-state-tree';
import { IDashboard } from '../types';
import { ContextModel, ContextInfoType } from './context';
import { FiltersModel } from './filters';
import { QueriesModel } from './queries';
import { SQLSnippetsModel } from './sql-snippets';

const DashboardModel = types
  .model({
    id: types.identifier,
    name: types.string,
    filters: FiltersModel,
    queries: QueriesModel,
    sqlSnippets: SQLSnippetsModel,
    context: ContextModel,
  })
  .views((self) => ({
    get data() {
      const data = self.queries.current.map(({ id, data }) => ({ id, data }));
      return data.reduce((ret, curr) => {
        ret[curr.id] = curr.data;
        return ret;
      }, {} as Record<string, any[]>);
    },
    getDataStuffByID(queryID: string) {
      const q = self.queries.findByID(queryID);
      if (!q) {
        return {
          data: [],
          state: 'idle',
          error: undefined,
        };
      }
      return {
        data: q.data.toJSON(),
        state: q.state,
        error: undefined,
      };
    },
    getDataStateByID(queryID: string) {
      return self.queries.findByID(queryID)?.state ?? [];
    },
    getDataErrorByID(queryID: string) {
      return self.queries.findByID(queryID)?.error ?? [];
    },
  }));

export function createDashboardModel(
  { id, name, filters, definition: { queries, sqlSnippets } }: IDashboard,
  context: ContextInfoType,
) {
  return DashboardModel.create({
    id,
    name,
    filters: {
      original: filters,
      current: filters,
    },
    queries: {
      original: queries,
      current: queries,
    },
    sqlSnippets: {
      original: sqlSnippets,
      current: sqlSnippets,
    },
    context,
  });
}

export function createEmptyDashboardModel() {
  return DashboardModel.create({
    id: 'initial',
    name: '',
    filters: {
      original: [],
      current: [],
    },
    queries: {
      original: [],
      current: [],
    },
    sqlSnippets: {
      original: [],
      current: [],
    },
    context: {},
  });
}

export type DashboardModelInstance = Instance<typeof DashboardModel>;
