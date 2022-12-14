import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EViewComponentType } from '~/types';

export const ViewModalConfigFields = observer(() => {
  const model = useModelContext();
  const VIE = model.views.VIE;
  if (!VIE || VIE.type !== EViewComponentType.Modal) {
    return null;
  }
  return (
    <Stack>
      <Divider mt={8} label="Modal settings" labelPosition="center" />
      <Group grow>
        <TextInput
          label="Width"
          value={VIE.config.width}
          onChange={(e) => VIE.updateConfig('width', e.currentTarget.value)}
          placeholder="600px / 50vw"
        />
        <TextInput
          label="Height"
          value={VIE.config.height}
          onChange={(e) => VIE.updateConfig('height', e.currentTarget.value)}
          placeholder="600px / 50vw"
        />
      </Group>
    </Stack>
  );
});
