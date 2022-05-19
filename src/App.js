import './App.css';
import {cereWebSDK} from '@cere/sdk-js/dist/web';
import {useEffect, useState} from 'react';

function App() {
    const [sdk, setSdk] = useState();
    const [externalUserId, setExternalUserId] = useState('212121');
    const [appId, setAppId] = useState('2354');

    useEffect(() => {
        let sdk = cereWebSDK(appId, null, {
            authMethod: {
                type: 'TRUSTED_3RD_PARTY',
                externalUserId: externalUserId, // replace with user id in Live One system
                token: '1234567890', // This token should be provided from authorized user by Live One
            },
            deployment: 'dev',
        });
        /**
         * Specify the action after engagement data received.
         * Please note: this action happens asynchronously.
         */
        sdk.onEngagement(onEngagementAction, null);

        setSdk(sdk);
    }, [appId, externalUserId]);

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
            <div>
                <select value={appId} onChange={e => {
                    setAppId(e.target.value);
                }}>
                    <option value="2095">2095 - Cere Dev</option>
                    <option value="2354">2354 - Dedicated Live One Dev</option>
                </select>
                <select value={externalUserId} onChange={e => {
                    setExternalUserId(e.target.value);
                }}>
                    <option value="212121">Gold Access User</option>
                    <option value="313131">Diamond Access User</option>
                    <option value="414141">Platinum Access User</option>
                </select>
                <button onClick={sendSdkEvent}>Send Sdk Event</button>
            </div>
            <iframe title={'Action Window'} id="contentIFrame" width={550} height={1100} frameBorder={3}
                    color={'white'}/>
        </div>
    );
}

export default App;
