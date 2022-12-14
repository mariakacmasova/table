import { AccountList } from '@devtable/settings-form';
import { Anchor, Box, Breadcrumbs, Group } from '@mantine/core';

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'Accounts', to: '/admin/account/list' },
].map((item, index) => (
  <Anchor href={item.to} key={index}>
    {item.name}
  </Anchor>
));

export function AccountsPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <AccountList config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }} />
    </Box>
  );
}
