﻿import React from 'react';
import PlayerHeader from './Header.react';
import PlayerControls from './Controls.react';


export
default React.createClass({
    getInitialState() {
        return {

        }
    },
    componentDidMount() {

    },
    componentWillUnmount() {

    },
    update() {

    },
    render() {
        return (
            <div className="wcjs-player" >
                <PlayerHeader title="PlaceHolder Title"/>
                <PlayerControls />
            </div>
        );
    }
});