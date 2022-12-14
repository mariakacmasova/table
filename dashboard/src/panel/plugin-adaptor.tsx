import { Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useAsyncEffect, useCreation } from 'ahooks';
import React, { useEffect, useState } from 'react';
import {
  IConfigComponentProps,
  IViewComponentProps,
  VizConfigComponent,
  VizViewComponent,
} from '../plugins/viz-manager/components';
import { IVizManager } from '../plugins';
import { AnyObject, IVizConfig } from '../types';
import { VizInstance } from '../types/plugin';

function usePluginMigration(vizManager: IVizManager, instance: VizInstance, onMigrate?: () => void) {
  const migrations = useCreation(() => new Set<string>(), []);
  const comp = vizManager.resolveComponent(instance.type);
  const [migrated, setMigrated] = useState(false);
  useAsyncEffect(async () => {
    // we can have more than one component for a given viz instance
    if ((await comp.migrator.needMigration(instance)) && !migrations.has(instance.id)) {
      try {
        migrations.add(instance.id);
        await comp.migrator.migrate(instance);
        onMigrate?.();
      } finally {
        migrations.delete(instance.id);
        setMigrated(true);
      }
    } else {
      setMigrated(true);
    }
  }, [instance]);
  return migrated;
}

export function PluginVizConfigComponent({
  setVizConf,
  ...props
}: IConfigComponentProps & { setVizConf: (val: React.SetStateAction<IVizConfig['conf']>) => void }) {
  const { vizManager, panel } = props;
  const instance = vizManager.getOrCreateInstance(panel);
  const migrated = usePluginMigration(vizManager, instance, () => {
    showNotification({
      title: `${panel.title} - Updated`,
      message: 'Your plugin configuration has been migrated to the latest version',
    });
  });

  useAsyncEffect(async () => {
    await instance.instanceData.setItem(null, panel.viz.conf);
  }, [instance, panel.viz.type]);

  useEffect(() => {
    return instance.instanceData.watchItem<AnyObject>(null, (configData) => {
      setVizConf(configData);
    });
  }, [setVizConf, panel.viz.type]);

  if (!migrated) {
    return <Text>Checking update...</Text>;
  }
  return <VizConfigComponent {...props} />;
}

export function PluginVizViewComponent(props: IViewComponentProps) {
  const { vizManager, panel } = props;
  const instance = vizManager.getOrCreateInstance(panel);
  const migrated = usePluginMigration(vizManager, instance, () => {
    showNotification({
      title: `${panel.title} - Updated`,
      message: 'Your plugin configuration has been migrated to the latest version',
    });
  });
  if (!migrated) {
    return <Text>Checking update</Text>;
  }
  return <VizViewComponent {...props} />;
}
