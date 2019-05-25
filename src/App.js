import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';

import AppContext, { arweave } from './components/AppContext';
import Login from './components/Login';
import AddButton from './components/AddButton';
import AddForm from './components/AddForm';
import PetitionsList from './components/PetitionsList';

const Content = styled.div`
margin-top: 20px;
`;

class App extends Component {
    state = {
        loggedIn: false,
        wallet: false,
        addFormOpened: false
    };
    render() {
        return (
            <AppContext.Provider value={{
                arweave,
                ...this.state,
                setloggedIn: (loggedIn, wallet) => this.setState({
                    loggedIn,
                    wallet
                }),
                setAddFormOpened: addFormOpened => this.setState({
                    addFormOpened
                })
            }}>
                <div className="App">
                    <div className="App-header">
                        <p>
                            Arweave petition application demo app
                        </p>
                        <AddButton
                            visible={this.state.loggedIn && !this.state.addFormOpened}
                            title="Add petition"
                            onClick={() => this.setState({
                                addFormOpened: true
                            })}
                        />
                    </div>
                    <Content>
                        <Login />
                        <AddForm />
                        <PetitionsList />
                    </Content> 
                </div>
            </AppContext.Provider>             
        );
    }
}

export default App;
