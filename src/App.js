import './App.css';
import {cereWebSDK} from '@cere/sdk-js/dist/web';
import {useEffect, useState} from 'react';

const deployments = {
  DEV: 'dev',
  STAGE: 'stage',
  PROD: 'prod',
};

const deploymentToApp = {
  [deployments.DEV]: '2354',
  [deployments.STAGE]: '2096',
  [deployments.PROD]: '2096',
};

const users = [
  {id: '112112112', name: 'Gold Access User'},
  {id: '113113113', name: 'Diamond Access User'},
  {id: '114114114', name: 'Platinum Access User'}, 
  {id: 'e-112112112', name: 'Adam Carolla Show'}
];

const MOCKED_USER_TOKEN = '1234567890'; // This token should be provided from authorized user by Live One

export function App() {
  const [sdk, setSdk] = useState();
  const [externalUserId, setExternalUserId] = useState(users.length ? users[0].id : null);
  const [deployment, setDeployment] = useState(deployments.DEV);

  useEffect(() => {
    let sdk = cereWebSDK(deploymentToApp[deployment], null, {
      authMethod: {
        type: 'TRUSTED_3RD_PARTY',
        externalUserId, // replace with user id in Live One system
        token: MOCKED_USER_TOKEN,
      },
      deployment,
    });
    /**
     * Specify the action after engagement data received.
     * Please note: this action happens asynchronously.
     */
    sdk.onEngagement(onEngagementAction, null);

    setSdk(sdk);
  }, [externalUserId, deployment]);

  /**
   * Action to be triggered after engagement received.
   */
  function onEngagementAction(template) {
    const doc = document.getElementById('contentIFrame').contentWindow.document;
    doc.open();
    doc.write(template);
    doc.close();
  }

  const sendSdkEvent = async () => {
    /**
     * Send event to Cere system for to get user's NFT-.
     */
    let timestamp = Number(new Date());

    let signature = await sdk.signMessage(`${timestamp}`);

    let payload = {
      timestamp,
      signature,
    };

    console.log(JSON.stringify(payload));

    sdk.sendEvent('LIVE_ONE_CONTEXTUAL_ENTERED', payload);
  };

  return (
    <div className="App">
      <div>
        <select
          value={externalUserId}
          onChange={(e) => {
            setExternalUserId(e.target.value);
          }}
        >
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          value={deployment}
          onChange={(e) => {
            setDeployment(e.target.value);
          }}
        >
          {Object.keys(deployments).map((env) => (
            <option value={deployments[env]} key={env}>
              {env.toUpperCase()}
            </option>
          ))}
        </select>
        <button onClick={sendSdkEvent}>Send Sdk Event</button>
      </div>
      <iframe title={'Action Window'} id="contentIFrame" width={550} height={1100} frameBorder={3} color={'white'} />
    </div>
  );
}
