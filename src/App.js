import './App.css';
import {cereWebSDK} from "@cere/sdk-js/dist/web";
import {useEffect, useState} from "react";

function App() {

    const [sdk, setSdk] = useState('No result');
    const [html, setHtml] = useState();

    useEffect(() => {
        let sdk = cereWebSDK('2095', null, {
            authMethod: {
                type: 'TRUSTED_3RD_PARTY',
                externalUserId: '12345', // replace with user id in Live One system
                token: '1234567890' // <= hardcoded for integration phase only.
                // After migration should be replaced with token provided by LiveOne
            },
            deployment: 'dev'
        });

        /**
         * Specify the action after engagement data received.
         * Please note: this action happens asynchronously.
         */
        sdk.onEngagement(onEngagementAction, {});

        setSdk(sdk);
    }, []);

    /**
     * Action to be triggered after engagement received.
     */
    function onEngagementAction(template) {
        var doc = document.getElementById('contentIFrame').contentWindow.document;
        doc.open();
        doc.write(template);
        doc.close();
    }

    async function sendSdkEvent() {
        /**
         * Send event to Cere system for to get user's NFT-.
         */
        let timestamp = Number(new Date())

        let signature = await sdk.signMessage(`${timestamp}`);

        sdk.sendEvent('LIVE_ONE_LIST_OF_NFTS', {
            timestamp,
            signature
        });
    }

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={sendSdkEvent}>Send Sdk Event</button>
                <iframe id="contentIFrame" width={400} height={700} frameBorder={3} color={'white'}>
                </iframe>
            </header>
        </div>
    );
}

export default App;
