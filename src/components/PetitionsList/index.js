import React, { Component } from 'react';
import styled from 'styled-components';

import packageJson from '../../../package.json';
import AppContext from '../AppContext';
import Error from '../Error';

const ListOuter = styled.div`
margin: 20px auto;
width: 80%;
min-width: 450px;
`;

const LoadingOuter = styled.div`
margin-top: 20px;
`;

const Row = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: stretch;
padding: 10px 5px;
border-bottom: 1px solid rgba(0,0,0,0.3);

&:first-child {
    border-top: 1px solid rgba(0,0,0,0.3);
}

&:hover {
    background-color: rgba(0,0,0,0.1);
}
`;

const Title = styled.div`
text-align: left;
flex-grow: 1;
`;

const SignButtonOuter = styled.div`
flex-grow: 0;
margin-right: 10px;

button {
    padding: 3px 10px;
    font-size: 14px;
    border: none;
    outline: none;
    background-color: rgba(0,0,0,0.1);
    color: grey;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: white;
    }
}
`;

const SignButton = ({ active, onClick }) => {

    if (!active) {
        return null;
    }

    return (
        <SignButtonOuter>
            <button onClick={onClick}>Sign</button>
        </SignButtonOuter>
    );
};

const SignsOuter = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-end;
width: 150px;
text-align: right;
`;

const Signs = ({ value, active, onClick }) => (
    <SignsOuter>
        <SignButton 
            active={active}
            onClick={onClick}
        />
        [ {value} ]
    </SignsOuter>
);

class PetitionsList extends Component {
    state = {
        loading: false,
        error: false,
        records: []
    };

    setStateAsync = state => new Promise(resolve => this.setState(state, resolve));

    fetchSigns = async (id) => {
        try {
            const { arweave } = this.context;

            const txids = await arweave.arql({
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'App-Name',
                    expr2: packageJson.name
                },
                expr2: {
                    op: 'and',
                    expr1: {
                        op: 'equals',
                        expr1: 'Type',
                        expr2: 'sign'
                    },
                    expr2: {
                        op: 'equals',
                        expr1: 'Petition',
                        expr2: id                        
                    }
                }
            });

            const records = await Promise.all(txids.map(async (tx) => {
                const transaction = await arweave.transactions.get(tx);
                const from = await arweave.wallets.ownerToAddress(transaction.get('owner'));
                return {
                    id: transaction.get('id'),
                    from,
                    transaction
                };
            }));

            return records;
        } catch(error) {
            this.setState({
                error
            });
        }
    };

    fetchList = async () => {
        try {
            const { arweave } = this.context;

            await this.setStateAsync({
                loading: true
            });

            const txids = await arweave.arql({
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'App-Name',
                    expr2: packageJson.name
                },
                expr2: {
                    op: 'equals',
                    expr1: 'Type',
                    expr2: 'petition'
                }
            });

            const records = await Promise.all(txids.map(async (tx) => {
                const signs = await this.fetchSigns(tx);
                const transaction = await arweave.transactions.get(tx);
                return {
                    id: transaction.get('id'),
                    title: transaction.get('data', {
                        decode: true, 
                        string: true
                    }),
                    signs,
                    transaction
                };
            }));

            // console.log('>>>', records);

            await this.setStateAsync({
                loading: false,
                records
            });
        } catch(error) {
            this.setState({
                error
            });
        }
    };

    signPetition = async (id, onSuccess = () => {}) => {
        try {
            const { arweave, wallet } = this.context;
            const transaction = await arweave.createTransaction({
                data: id
            }, wallet);
            transaction.addTag('App-Name', packageJson.name);
            transaction.addTag('App-Version', packageJson.version);
            transaction.addTag('Unix-Time', Math.round((new Date()).getTime() / 1000));
            transaction.addTag('Type', 'sign');
            transaction.addTag('Petition', id);
            await arweave.transactions.sign(transaction, wallet);
            const response = await arweave.transactions.post(transaction);
            onSuccess(response);
        } catch(error) {
            this.setState({
                error
            });
        }
    };

    componentDidMount = () => {
        const { records } = this.state;

        if (records.length === 0) {
            this.fetchList();
        }
    }

    render() {
        const { records, loading, error } = this.state;
        const { loggedIn } = this.context;

        return (
            <ListOuter>
                {(records && records.length > 0) &&
                    records.map((r, i) => (
                        <Row key={i}>
                            <Title>
                                <strong>{i+1}:</strong> {r.title}
                            </Title>
                            <Signs 
                                active={loggedIn && r.signs.findIndex(t => t.from === loggedIn) === -1} //hide signed positions
                                onClick={() => this.signPetition(r.id, this.fetchList)} 
                                value={r.signs.length} 
                            />
                        </Row>
                    ))
                }
                {loading &&
                    <LoadingOuter>Loading...</LoadingOuter>
                }
                <Error error={error} onClose={() => this.setState({
                    error: false
                })} />
            </ListOuter>           
        );
    }
}

PetitionsList.contextType = AppContext;

export default PetitionsList;
