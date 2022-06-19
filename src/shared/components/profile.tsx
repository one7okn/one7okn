import { Avatar, Button, Stack, Tooltip } from '@mui/material';
import { FC } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

export const Profile: FC = () => {
  const { data: account } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  function GetAddress() {
    return `${account?.address?.substr(0, 5)}...${account?.address?.substr(account?.address?.length - 4)}`;
  }

  if (account) {
    return (
      <Stack spacing={2}>
        <Button variant="outlined" onClick={() => disconnect()}>
          <Tooltip title={`Disconnect ${connector.name}`}>
            <Stack direction="row" spacing={1}>
              <Avatar src={ensAvatar || ''} sx={{ width: 24, height: 24 }}>
                {ensName?.substring(0, 1).toUpperCase() || ''}
              </Avatar>
              <span> {ensName ? `${ensName} (${GetAddress()})` : GetAddress()}</span>
            </Stack>
          </Tooltip>
        </Button>
      </Stack>
    );
  }

  return (
    <Button variant="outlined" disabled={!connector.ready} onClick={() => connect(connector)}>
      <Tooltip title={`Connect ${connector.name}`}>
        <span>
          Connect
          {!connector.ready && ' (unsupported)'}
          {isConnecting && connector.id === pendingConnector?.id && 'ing'}
        </span>
      </Tooltip>
    </Button>
  );
};
