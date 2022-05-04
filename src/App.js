import './App.css';
import {cereWebSDK} from '@cere/sdk-js/dist/web';
import {useEffect, useState} from 'react';

function App() {
  const [sdk, setSdk] = useState();

  useEffect(() => {
    const LIVE_ONE_APP_ID = '2095';

    let sdk = cereWebSDK(LIVE_ONE_APP_ID, null, {
      authMethod: {
        type: 'TRUSTED_3RD_PARTY',
        externalUserId: '212121', // replace with user id in Live One system
        token: '1234567890', // This token should be provided from authorized user by Live One
      },


      deployment: 'dev',
    });

    /**
     * Specify the action after engagement data received.
     * Please note: this action happens asynchronously.
     */
    sdk.onEngagement(onEngagementAction);

    setSdk(sdk);
  }, []);

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

    console.log(JSON.stringify(payload))

    sdk.sendEvent('LIVE_ONE_CONTEXTUAL_ENTERED', payload);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={sendSdkEvent}>Send Sdk Event</button>
        <iframe title={'Action Window'} id="contentIFrame" width={550} height={900} frameBorder={3} color={'white'} />
      </header>
    </div>
  );
}

export default App;
