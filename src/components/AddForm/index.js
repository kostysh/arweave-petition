import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import packageJson from '../../../package.json';
import AppContext from '../AppContext';
import Error from '../Error';

const FormOuter = styled.div`
display: flex;
flex-direction: column;
align-items: stretch;
justify-content: flex-start;
background-color: whitesmoke;
margin: 10px auto;
padding: 20px;
width: 60%;
border-radius: 5px;

button[type=submit] {
    border: none;
    outline: none;
    cursor: pointer;
    padding: 10px 30px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 16px;
    border-radius: 8px;
}
`;

const FieldOuter = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: stretch;
margin-bottom: 10px;

input {
    font-size: 16px;
    padding: 4px;
    flex-grow: 1;
    
    ::placeholder {
        opacity: 0.4;
    }
}

.label {
    margin-right: 5px;
    flex-grow: 0;
}
`;

const Label = styled.div`
font-size: 14px;
font-weight: bold;
color: gray;
`;

const Field = ({
    label, 
    type,
    placeholder,
    value,
    onChange = () => {},
}) => {

    return (
        <FieldOuter>
            <Label className="label">{label}:</Label>
            <input 
                type={type} 
                placeholder={placeholder} 
                value={value}
                onChange={({ target: { value }}) => onChange(value)}
            />
        </FieldOuter>
    );
};

const processAdd = async (
    arweave, 
    wallet,
    petition, 
    onSuccess = () => {}, 
    onError = () => {}
) => {
    try {
        const transaction = await arweave.createTransaction({
            data: petition,
        }, wallet);
        transaction.addTag('App-Name', packageJson.name);
        transaction.addTag('App-Version', packageJson.version);
        transaction.addTag('Unix-Time', Math.round((new Date()).getTime() / 1000));
        transaction.addTag('Type', 'petition');
        await arweave.transactions.sign(transaction, wallet);
        const response = await arweave.transactions.post(transaction);
        onSuccess(response);
    } catch (error) {
        onError(error);
    }
};

export default () => {
    const { arweave, wallet, loggedIn, addFormOpened, setAddFormOpened } = useContext(AppContext);
    const [petition, setPetition] = useState('');
    const [error, setError] = useState(false);

    if (!loggedIn || !addFormOpened) {
        return null;
    }

    return (
        <div>
            <FormOuter>
                <Field 
                    label="Petition"
                    type="text"
                    placeholder="Petition text" 
                    value={petition}
                    onChange={setPetition}
                />
                <div>
                    <button 
                        type="submit"
                        onClick={() => processAdd(
                            arweave, 
                            wallet,
                            petition, 
                            () => setAddFormOpened(false),
                            setError
                        )}
                    >Add</button>
                </div>
                <Error error={error} onClose={() => setError(false)} />
            </FormOuter>
        </div>
    );
};