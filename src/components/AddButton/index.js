import React from 'react';
import styled from 'styled-components';

const AddButton = styled.button`
position: absolute;
right: 30px;
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
font-size: 25px;
border: none;
outline: none;
background-color: white;
color: grey;
cursor: pointer;

&:active {
    background-color: whitesmoke;
}
`;

export default ({ visible, children, onClick }) => {

    if (!visible) {
        return null;
    }

    return (
        <AddButton onClick={onClick}>+</AddButton>
    );
};