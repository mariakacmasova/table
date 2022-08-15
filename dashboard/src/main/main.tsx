import React from 'react';
import _ from 'lodash';
import { DashboardMode, IDashboard, IDashboardConfig } from '../types/dashboard';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { DashboardLayout } from '../layout';
import { DashboardActions } from './actions';
import { DefinitionContext } from '../contexts/definition-context';
import { randomId } from '@mantine/hooks';
import { APIClient } from '../api-caller/request';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { ModalsProvider } from '@mantine/modals';
import { FullScreenPanel } from './full-screen-panel';
import { Box, Overlay } from '@mantine/core';
import { usePanelFullScreen } from './use-panel-full-screen';
import { Filters } from '../filter';
import { FilterValuesContext } from '../contexts/filter-values-context';
import { useFilters } from './use-filters';
import { createDashboardModel } from '../model';
import { observer } from 'mobx-react-lite';
import { createPluginContext, PluginContext } from '../plugins/plugin-context';
import { useCreation } from 'ahooks';
import { QueryModelInstance } from '../model/queries';
import { SQLSnippetModelInstance } from '../model/sql-snippets';
import { ModelContext } from '../contexts/model-context';
import { ContextInfoType } from '../model/context';

interface IDashboardProps {
  context: ContextInfoType;
  dashboard: IDashboard;
  className?: string;
  update: (dashboard: IDashboard) => Promise<void>;
  config: IDashboardConfig;
}

export const Dashboard = observer(function _Dashboard({
  context,
  dashboard,
  update,
  className = 'dashboard',
  config,
}: IDashboardProps) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }
  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit);

  const [panels, setPanels] = React.useState(dashboard.panels);
  const model = React.useMemo(() => createDashboardModel(dashboard, context), [dashboard]);

  React.useEffect(() => {
    model.context.replace(context);
  }, [context]);

  const { filterValues, setFilterValues } = useFilters(dashboard);

  const hasChanges = React.useMemo(() => {
    if (model.filters.changed) {
      return true;
    }
    if (model.queries.changed) {
      return true;
    }
    if (model.sqlSnippets.changed) {
      return true;
    }
    // local panels' layouts would contain some undefined runtime values
    const cleanJSON = (v: any) => JSON.parse(JSON.stringify(v));

    const panelsEqual = _.isEqual(cleanJSON(panels), cleanJSON(dashboard.panels));
    return !panelsEqual;
  }, [dashboard, panels, model.queries.changed, model.filters.changed]);

  const saveDashboardChanges = async () => {
    const queries = [...model.queries.current];
    const sqlSnippets = [...model.sqlSnippets.current];
    const d: IDashboard = {
      ...dashboard,
      filters: [...model.filters.current],
      panels,
      definition: { sqlSnippets, queries },
    };
    await update(d);
  };

  const revertDashboardChanges = () => {
    model.filters.reset();
    setPanels(dashboard.panels);
    model.sqlSnippets.reset();
    model.queries.reset();
  };

  const addPanel = () => {
    const id = randomId();
    const newItem = {
      id,
      layout: {
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 15,
      },
      title: `Panel - ${id}`,
      description: '<p><br></p>',
      queryID: '',
      viz: {
        type: 'table',
        conf: {},
      },
    };
    setPanels((prevs) => [...prevs, newItem]);
  };

  const duplidatePanel = (id: string) => {
    try {
      const panel = panels.find((p) => p.id === id);
      if (!panel) {
        throw new Error(`[duplicate panel] Can't find a panel by id[${id}]`);
      }
      const newPanel = {
        ...panel,
        id: randomId(),
        layout: {
          ...panel.layout,
          x: 0,
          y: Infinity,
        },
      };
      setPanels((prevs) => [...prevs, newPanel]);
    } catch (error) {
      console.error(error);
    }
  };

  const removePanelByID = (id: string) => {
    const index = panels.findIndex((p) => p.id === id);
    setPanels((prevs) => {
      prevs.splice(index, 1);
      return [...prevs];
    });
  };

  const inEditMode = mode === DashboardMode.Edit;
  const inLayoutMode = mode === DashboardMode.Layout;
  const inUseMode = mode === DashboardMode.Use;

  const getCurrentSchema = React.useCallback(() => {
    const queries = model.queries.current;
    const sqlSnippets = model.sqlSnippets.current;
    const filters = model.filters.current;
    return {
      filters,
      panels,
      definition: {
        sqlSnippets,
        queries,
      },
    };
  }, [panels, model]);

  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(panels);

  const pluginContext = useCreation(createPluginContext, []);
  return (
    <ModalsProvider>
      <ModelContext.Provider value={{ model }}>
        <FilterValuesContext.Provider value={filterValues}>
          <DashboardActionContext.Provider
            value={{
              addPanel,
              duplidatePanel,
              removePanelByID,
              viewPanelInFullScreen,
              inFullScreen,
            }}
          >
            <DefinitionContext.Provider value={{}}>
              <LayoutStateContext.Provider
                value={{
                  layoutFrozen,
                  freezeLayout,
                  mode,
                  inEditMode,
                  inLayoutMode,
                  inUseMode,
                }}
              >
                {inFullScreen && (
                  <FullScreenPanel panel={fullScreenPanel!} exitFullScreen={exitFullScreen} model={model} />
                )}
                <Box
                  className={className}
                  sx={{
                    position: 'relative',
                    display: inFullScreen ? 'none' : 'block',
                  }}
                >
                  <DashboardActions
                    mode={mode}
                    setMode={setMode}
                    hasChanges={hasChanges}
                    saveChanges={saveDashboardChanges}
                    revertChanges={revertDashboardChanges}
                    getCurrentSchema={getCurrentSchema}
                    model={model}
                  />
                  <Filters filterValues={filterValues} setFilterValues={setFilterValues} />
                  <PluginContext.Provider value={pluginContext}>
                    <DashboardLayout
                      model={model}
                      panels={panels}
                      setPanels={setPanels}
                      isDraggable={inLayoutMode}
                      isResizable={inLayoutMode}
                    />
                  </PluginContext.Provider>
                </Box>
              </LayoutStateContext.Provider>
            </DefinitionContext.Provider>
          </DashboardActionContext.Provider>
        </FilterValuesContext.Provider>
      </ModelContext.Provider>
    </ModalsProvider>
  );
});
