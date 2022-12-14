import { Box, Button, Group, Stack, Tabs } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { PlaylistAdd, Recycle, Trash } from 'tabler-icons-react';
import { useModelContext } from '../../contexts';
import { FilterModelInstance } from '../../model';
import { DashboardFilterType } from '../../model/filters/filter/common';
import { createFilterConfig_TextInput } from '../../model/filters/filter/text-input';
import { FilterSetting } from './filter-setting';
import './filter-settings.css';

export const FilterSettings = observer(function _FilterSettings() {
  const model = useModelContext();
  const filters = model.filters.current;

  const addFilter = () => {
    const id = randomId();
    const filter = {
      id,
      key: id,
      label: id,
      order: filters.length + 1,
      type: DashboardFilterType.TextInput,
      config: createFilterConfig_TextInput(),
      visibleInViewsIDs: ['Main'],
    } as FilterModelInstance;
    model.filters.append(filter);
  };

  return (
    <Box sx={{ height: '90vh', maxHeight: 'calc(100vh - 185px)' }} p={0}>
      <Group sx={{ position: 'absolute', top: '16px', right: '16px' }}>
        <Button
          size="xs"
          color="red"
          leftIcon={<Recycle size={20} />}
          disabled={!model.filters.changed}
          onClick={model.filters.reset}
        >
          Revert Changes
        </Button>
      </Group>
      <Tabs
        className="filter-settings-tabs"
        orientation="vertical"
        defaultValue={model.filters.firstID}
        styles={{
          root: {
            display: 'block',
          },
        }}
      >
        <Group sx={{ height: '100%' }}>
          <Stack sx={{ height: '100%' }}>
            <Tabs.List position="left" sx={{ flexGrow: 1, width: '200px' }}>
              {model.filters.current.map((field) => (
                <Tabs.Tab key={field.id} value={field.id} sx={{ maxWidth: '100%', overflow: 'scroll' }}>
                  {field.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Button size="xs" color="blue" leftIcon={<PlaylistAdd size={20} />} onClick={addFilter}>
              Add a Filter
            </Button>
          </Stack>
          <Box sx={{ flexGrow: 1, height: '100%' }}>
            {model.filters.current.map((filter, index) => (
              <Tabs.Panel key={filter.id} value={filter.id} sx={{ height: '100%' }}>
                <Stack sx={{ height: '100%' }} spacing="sm">
                  <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'scroll' }}>
                    <FilterSetting filter={filter} index={index} />
                  </Box>
                  <Group position="right" pt={10}>
                    <Button
                      size="xs"
                      color="red"
                      leftIcon={<Trash size={20} />}
                      onClick={() => model.filters.remove(index)}
                    >
                      Delete this filter
                    </Button>
                  </Group>
                </Stack>
              </Tabs.Panel>
            ))}
          </Box>
        </Group>
      </Tabs>
    </Box>
  );
});
