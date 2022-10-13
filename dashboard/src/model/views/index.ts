import { randomId } from '@mantine/hooks';
import { selectRowsFn } from '@tanstack/react-table';
import _ from 'lodash';
import { cast, types } from 'mobx-state-tree';
import { EViewComponentType, IDashboardView } from '~/types';
import { ViewModel, ViewModelInstance } from './view';

export const ViewsModel = types
  .model('ViewsModel', {
    original: types.optional(types.array(ViewModel), []),
    current: types.optional(types.array(ViewModel), []),
    visibleViewIDs: types.array(types.string),
    idOfVIE: types.string, // VIE: view in edit
  })
  .views((self) => ({
    get changed() {
      if (self.original.length !== self.current.length) {
        return true;
      }
      return self.original.some((o, i) => {
        return !_.isEqual(o.json, self.current[i].json);
      });
    },
    get json() {
      return self.current.map((o) => o.json);
    },
    findByID(id: string) {
      return self.current.find((query) => query.id === id);
    },
    get firstVisibleView() {
      const [firstVisibleID] = self.visibleViewIDs;
      return self.current.find(({ id }) => id === firstVisibleID);
    },
    get VIE() {
      return self.current.find(({ id }) => id === self.idOfVIE);
    },
    get options() {
      return self.current.map((v) => ({
        label: v.id,
        value: v.id,
        type: v.type as EViewComponentType,
      }));
    },
  }))
  .actions((self) => {
    return {
      reset() {
        const o = self.original.map((o) => ({
          ...o,
        }));
        self.current.length = 0;
        self.current.unshift(...o);
      },
      replace(current: Array<ViewModelInstance>) {
        self.current = cast(current);
      },
      addANewView(id: string, type: EViewComponentType, config: Record<string, any>) {
        self.current.push({
          id,
          type,
          config,
          panels: {
            current: [],
            original: [],
          },
        });
      },
      append(item: ViewModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      removeByID(id: string) {
        const index = self.current.findIndex((o) => o.id === id);
        if (index === -1) {
          return;
        }
        self.current.splice(index, 1);
      },
      replaceByIndex(index: number, replacement: ViewModelInstance) {
        self.current.splice(index, 1, replacement);
      },
      setIDOfVIE(id: string) {
        self.idOfVIE = id;
      },
      addAPanelToVIE() {
        self.VIE?.panels.addANewPanel();
      },
    };
  })
  .actions((self) => ({
    addARandomNewView() {
      const id = randomId();
      self.addANewView(id, EViewComponentType.Division, {});
      self.setIDOfVIE(id);
    },
  }));

export * from './view';

export function createDashboardViewsModel(views: IDashboardView[]) {
  const visibleViewIDs = views.length > 0 ? [views[0].id] : [];
  const idOfVIE = views.length > 0 ? views[0].id : '';
  const processedViews = views.map((view) => ({
    ...view,
    panels: {
      original: view.panels,
      current: view.panels,
    },
  }));
  return ViewsModel.create({
    original: processedViews,
    current: processedViews,
    visibleViewIDs,
    idOfVIE,
  });
}