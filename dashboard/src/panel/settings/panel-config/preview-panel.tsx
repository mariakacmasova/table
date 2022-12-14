import { Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { usePanelContext } from '../../../contexts';
import { ErrorBoundary } from '../../error-boundary';
import { DescriptionPopover } from '../../panel-description';

export const PreviewPanel = observer(() => {
  const {
    panel: {
      title,
      style: { border },
    },
  } = usePanelContext();
  return (
    <ErrorBoundary>
      <Stack
        mx="auto"
        mt="xl"
        p="5px"
        spacing={5}
        sx={{
          width: '600px',
          height: '450px',
          background: 'transparent',
          borderRadius: '5px',
          border: '1px solid #e9ecef',
          borderWidth: border.enabled ? '1px' : '0px',
        }}
      >
        <Group position="apart" noWrap sx={{ flexGrow: 0, flexShrink: 0 }}>
          <Group>
            <DescriptionPopover />
          </Group>
          <Group grow position="center">
            <Text lineClamp={1} weight="bold">
              {title}
            </Text>
          </Group>
          <Group position="right" spacing={0} sx={{ height: '28px' }} />
        </Group>
        <Group sx={{ background: '#eee', flexGrow: 1 }} />
      </Stack>
    </ErrorBoundary>
  );
});
