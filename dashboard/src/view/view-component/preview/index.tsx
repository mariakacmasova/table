import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { ViewModelInstance } from '~/model';
import { EViewComponentType } from '~/types';
import { PreviewViewDivision } from './division';
import { PreviewViewModal } from './modal';

export const PreviewViewComponent = observer(({ view, children }: { view: ViewModelInstance; children: ReactNode }) => {
  switch (view.type) {
    case EViewComponentType.Modal:
      return <PreviewViewModal view={view}>{children}</PreviewViewModal>;
    case EViewComponentType.Division:
    default:
      return <PreviewViewDivision>{children}</PreviewViewDivision>;
  }
});
