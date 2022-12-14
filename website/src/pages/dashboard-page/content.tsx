import React from 'react';

import { Dashboard, IDashboard, ReadOnlyDashboard } from '@devtable/dashboard';

import { LoadingOverlay } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useRequest } from 'ahooks';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useUrlState from '@ahooksjs/use-url-state';
import { DashboardAPI } from '../../api-caller/dashboard';
import { useAccountContext } from '../../frames/require-auth/account-context';
import './content.css';

export function DashboardPageContent({ id }: { id: string }) {
  const [search, setSearch] = useUrlState({
    full_screen_panel_id: '',
  });
  const {
    data: dashboard,
    loading,
    refresh,
  } = useRequest(
    async () => {
      const resp = await DashboardAPI.details(id);
      return resp;
    },
    {
      refreshDeps: [id],
    },
  );

  const [context] = React.useState({});

  const updateDashboard = React.useCallback(async (d: IDashboard) => {
    showNotification({
      id: 'for-updating',
      title: 'Pending',
      message: 'Updating dashboard...',
      loading: true,
    });
    await DashboardAPI.update(d);
    updateNotification({
      id: 'for-updating',
      title: 'Successful',
      message: 'This dashboard is updated',
      color: 'green',
    });
    refresh();
  }, []);

  const { canEdit } = useAccountContext();

  const setFullScreenPanelID = (id: string) => {
    const s = {
      ...search,
      full_screen_panel_id: id,
    };
    setSearch(s);
  };

  if (!dashboard) {
    return null;
  }

  const ready = !loading;
  const DashboardComponent = canEdit ? Dashboard : ReadOnlyDashboard;
  return (
    <div className="dashboard-page-content">
      <LoadingOverlay visible={!ready} exitTransitionDuration={0} />
      {ready && (
        <DashboardComponent
          context={context}
          dashboard={dashboard}
          update={updateDashboard}
          config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }}
          fullScreenPanelID={search.full_screen_panel_id}
          setFullScreenPanelID={setFullScreenPanelID}
        />
      )}
    </div>
  );
}
