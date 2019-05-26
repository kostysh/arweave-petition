import React, { useContext } from 'react';
import styled from 'styled-components';

import AppContext from '../../AppContext';

const Address = styled.span`

`;

const LogitOuter = styled.div`
cursor: pointer;
height: 200px;
border: 2px dashed #62666f;
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: relative;
margin: auto;
max-width: 300px;
`;

const Label = styled.div`
color: grey;
`;

const Info = styled.div`
color: grey;
`;

const FileDrop = styled.input`
opacity: 0;
position: absolute;
background: none;
width: 100%;
height: 100%;
`;

const processFile = (arweave, files, setloggedIn) => {
    const fr = new FileReader();

    fr.onload = async (ev) => {
        try {
            const wallet = JSON.parse(ev.target.result);
            const address = await arweave.wallets.jwkToAddress(wallet);            
            setloggedIn(address, wallet);
        } catch (err) {
            console.log('Error logging in: ', err);
        }
    };

    fr.readAsText(files[0]);
};

export default () => {
    const { arweave, loggedIn, setloggedIn } = useContext(AppContext);

    if (loggedIn) {
        return (
            <Address>{loggedIn}</Address>
        );
    }

    return (
        <div>
            <LogitOuter>
                <FileDrop
                    type="file" 
                    onChange={({target: { files }}) => processFile(arweave, files, setloggedIn)}
                />
                <Label>Drop a wallet keyfile to login</Label>                
            </LogitOuter>
            <Info>Don't have a wallet? Get one <a href="https://tokens.arweave.org/" rel="noopener noreferrer" target="_blank">here</a>!</Info>
        </div>
    );
};