import { ActionIcon, Box, Group, LoadingOverlay, Stack, Table, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Refresh } from 'tabler-icons-react';
import { useModelContext } from '../../contexts';

function DataTable({ data }: { data: $TSFixMe[] }) {
  if (data.length === 0) {
    return <Box sx={{ height: '5em' }} />;
  }
  return (
    <Table>
      <thead>
        <tr>
          {Object.keys(data?.[0]).map((label) => (
            <th key={label}>
              <Text weight={700} color="#000">
                {label}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 10).map((row: Record<string, $TSFixMe>, index: number) => (
          <tr key={`row-${index}`}>
            {Object.values(row).map((v: $TSFixMe, i) => (
              <td key={`${v}--${i}`}>
                <Group sx={{ '&, .mantine-Text-root': { fontFamily: 'monospace' } }}>
                  <Text>{v}</Text>
                </Group>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export const DataPreview = observer(function _DataPreview({ id }: { id: string }) {
  const model = useModelContext();
  const { data, state } = model.getDataStuffByID(id);
  const loading = state === 'loading';
  const refresh = () => {
    model.queries.refetchDataByQueryID(id);
  };
  return (
    <Stack my="xl" sx={{ border: '1px solid #eee' }}>
      <Group position="apart" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Group position="left">
          <Text weight={500}>Preview Data</Text>
          {data.length > 10 && (
            <Text size="sm" color="gray">
              Showing 10 rows of {data.length}
            </Text>
          )}
        </Group>
        <ActionIcon mr={15} variant="subtle" color="blue" disabled={loading} onClick={refresh}>
          <Refresh size={15} />
        </ActionIcon>
      </Group>
      <Box sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <DataTable data={data} />
      </Box>
    </Stack>
  );
});
