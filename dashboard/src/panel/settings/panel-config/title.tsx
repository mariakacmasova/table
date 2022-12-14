import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { usePanelContext } from '../../../contexts/panel-context';

export const EditTitle = observer(() => {
  const { panel } = usePanelContext();
  const { title, setTitle } = panel;
  const [localTitle, setLocalTitle] = useInputState(title);

  const changed = title !== localTitle;

  const submit = React.useCallback(() => {
    if (!changed) {
      return;
    }
    setTitle(localTitle);
  }, [changed, localTitle]);

  return (
    <TextInput
      value={localTitle}
      onChange={setLocalTitle}
      label={
        <Group align="apart">
          <Text sx={{ flexGrow: 1 }}>Panel Title</Text>
          <ActionIcon variant="subtle" color="blue" disabled={!changed} onClick={submit}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
      }
      styles={{
        label: {
          display: 'block',
          paddingBottom: '4px',
        },
      }}
    />
  );
});
