import { Container, Group, Text } from "@mantine/core";
import React from "react";
import { PanelContext } from "../../../contexts";
import { ErrorBoundary } from "../../error-boundary";
import { DescriptionPopover } from "../../panel-description";

export function PreviewPanel() {
  const { title } = React.useContext(PanelContext);
  return (
    <ErrorBoundary>
      <Group direction="column" grow noWrap mx="auto" mt="xl" p="5px" spacing="xs" sx={{
        width: '600px',
        height: '450px',
        background: 'transparent',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)',
      }}>
        <Group position='apart' noWrap sx={{ borderBottom: '1px solid #eee', paddingBottom: '5px', flexGrow: 0, flexShrink: 0 }}>
          <Group>
            <DescriptionPopover position="bottom" trigger="hover" />
          </Group>
          <Group grow position="center">
            <Text lineClamp={1} weight="bold">{title}</Text>
          </Group>
          <Group
            position="right"
            spacing={0}
            sx={{ height: '28px' }}
          />
        </Group>
        <Group sx={{ background: '#eee', flexGrow: 1 }}/>
      </Group>
    </ErrorBoundary>
  )
}