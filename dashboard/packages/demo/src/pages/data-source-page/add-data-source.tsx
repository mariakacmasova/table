import { ActionIcon, Box, Button, Checkbox, Divider, Group, Modal, NumberInput, PasswordInput, SegmentedControl, Select, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useRequest } from "ahooks";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistAdd } from "tabler-icons-react";
import { DatasourceAPI } from "../../api-caller/datasource";
import { DataSourceType, IDataSourceConfig } from "../../api-caller/datasource.typed";

interface IFormValues {
  type: DataSourceType;
  key: string;
  config: IDataSourceConfig;
}

function AddDataSourceForm({ postSubmit }: { postSubmit: () => void }) {
  const { control, handleSubmit, formState: { errors, isValidating, isValid } } = useForm<IFormValues>({
    defaultValues: {
      type: 'postgresql',
      key: '',
      config: {
        host: '',
        port: 5432,
        username: '',
        password: '',
        database: '',
      }
    }
  });

  const AddDataSource = async ({ type, key, config }: IFormValues) => {
    showNotification({
      id: 'for-creating',
      title: 'Pending',
      message: 'Adding data source...',
      loading: true,
    })
    await DatasourceAPI.create(type, key, config);
    updateNotification({
      id: 'for-creating',
      title: 'Successful',
      message: 'Data source is added',
      color: 'green'
    })
    postSubmit()
  }

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(AddDataSource)}>
        <Controller
          name='type'
          control={control}
          render={(({ field }) => (
            <SegmentedControl
              fullWidth
              mb="md"
              data={[
                { label: 'PostgreSQL', value: 'postgresql' },
                { label: 'MySQL', value: 'mysql' },
                { label: 'HTTP', value: 'http', disabled: true },
              ]}
              {...field}
            />
          ))}
        />

        <Controller
          name='key'
          control={control}
          render={(({ field }) => (
            <TextInput
              mb="md"
              required
              label="Name"
              placeholder="A unique name"
              {...field}
            />
          ))}
        />

        <Divider label="Connection Info" labelPosition="center"/>

        <Group direction="row" grow>
          <Controller
            name='config.host'
            control={control}
            render={(({ field }) => (
              <TextInput
                mb="md"
                required
                label="Host"
                sx={{ flexGrow: 1 }}
                {...field}
              />
            ))}
          />
          <Controller
            name='config.port'
            control={control}
            render={(({ field }) => (
              <NumberInput
                mb="md"
                required
                label="Port"
                hideControls
                sx={{ width: '8em' }}
                {...field}
              />
            ))}
          />
        </Group>

        <Controller
          name='config.username'
          control={control}
          render={(({ field }) => (
            <TextInput
              mb="md"
              required
              label="Username"
              {...field}
            />
          ))}
        />
        <Controller
          name='config.password'
          control={control}
          render={(({ field }) => (
            <PasswordInput
              mb="md"
              required
              label="Password"
              {...field}
            />
          ))}
        />
        <Controller
          name='config.database'
          control={control}
          render={(({ field }) => (
            <TextInput
              mb="md"
              required
              label="Database"
              {...field}
            />
          ))}
        />

        <Group position="apart" mt="md">
          <Button disabled>Test</Button>
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Box>
  )
}

interface IAddDataSource {
  onSuccess: () => void;
}

export function AddDataSource({ onSuccess }: IAddDataSource) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    onSuccess()
    close()
  }

  return (
    <>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a data source"
        trapFocus
        onDragStart={e => { e.stopPropagation() }}
      >
        <AddDataSourceForm postSubmit={postSubmit} />
      </Modal>
      <Button size="sm" onClick={open} leftIcon={<PlaylistAdd size={20} />}>Add a Data Source</Button>
    </>
  )
}