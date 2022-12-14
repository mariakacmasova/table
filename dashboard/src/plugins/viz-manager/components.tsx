import { omit } from 'lodash';
import { IPanelInfoEditor, VizConfigContext, VizContext, VizInstance, VizViewContext } from '~/types/plugin';
import { JsonPluginStorage } from '../json-plugin-storage';
import { IPanelInfo, IVizManager } from './types';

function createCommonContext(instance: VizInstance, data: $TSFixMe, vizManager: IVizManager): VizContext {
  return {
    vizManager,
    /**
     * todo: locale not implemented
     */
    locale: 'zh',
    msgChannels: instance.messageChannels,
    instanceData: instance.instanceData,
    /**
     * todo: implement plugin scope storage, that is shared
     * between instances
     */
    pluginData: new JsonPluginStorage({}),
    /**
     * todo: color palette not implemented
     */
    colorPalette: {
      getColor() {
        return () => '';
      },
    },
    data,
  };
}

export type IViewPanelInfo = IPanelInfo & { layout: { w: number; h: number } };
export type IViewComponentProps<TDebug = Record<string, unknown>> = {
  panel: IViewPanelInfo;
  data: $TSFixMe;
  vizManager: IVizManager;
} & TDebug;
export const VizViewComponent = <T,>(props: IViewComponentProps<T>) => {
  const { panel, vizManager, data } = props;
  const comp = vizManager.resolveComponent(panel.viz.type);
  const instance = vizManager.getOrCreateInstance(panel);
  const context: VizViewContext = {
    ...createCommonContext(instance, data, vizManager),
    viewport: { width: panel.layout.w, height: panel.layout.h },
  };
  const Comp = comp.viewRender;
  return <Comp context={context} instance={instance} {...omit(props, ['panel', 'vizManager', 'data'])} />;
};
export type IConfigComponentProps<TDebug = Record<string, unknown>> = {
  panel: IPanelInfo;
  panelInfoEditor: IPanelInfoEditor;
  vizManager: IVizManager;
  data: $TSFixMe;
} & TDebug;
export const VizConfigComponent = <T,>(props: IConfigComponentProps<T>) => {
  const { vizManager, panel, panelInfoEditor, data } = props;
  const vizComp = vizManager.resolveComponent(panel.viz.type);
  const instance = vizManager.getOrCreateInstance(panel);
  const context: VizConfigContext = {
    ...createCommonContext(instance, data, vizManager),
    panelInfoEditor: panelInfoEditor,
  };
  const Comp = vizComp.configRender;
  return (
    <Comp context={context} instance={instance} {...omit(props, ['panel', 'vizManager', 'data', 'panelInfoEditor'])} />
  );
};
