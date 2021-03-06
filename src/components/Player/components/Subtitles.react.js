﻿import React from 'react';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MUI from 'material-ui';
import ls from 'local-storage';

const {
    List, ListItem, Avatar
} = MUI;

import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';

const SelectableList = SelectableContainerEnhance(List);

import PlayerStore from '../store';
import PlayerActions from '../actions';
import path from 'path';

const lang2country = {
    en: 'us',
    cs: 'cz',
    pb: 'br',
    he: 'il',
    el: 'gr',
    uk: 'ua'
}

export
default React.createClass({

    mixins: [PureRenderMixin],

    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
            muiTheme: MUI.Styles.ThemeManager.getMuiTheme(MUI.Styles['DarkRawTheme'])
        };
    },

    getInitialState() {
        return {
            open: false,
            playlist: PlayerStore.getState().wcjs.playlist || false,
            playlistSelected: PlayerStore.getState().selectedSub
        }
    },
    componentWillMount() {
        PlayerStore.listen(this.update);
    },

    componentWillUnmount() {
        PlayerStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            this.setState({
                open: PlayerStore.getState().subtitlesOpen,
                playlist: PlayerStore.getState().wcjs.playlist || false,
                playlistSelected: PlayerStore.getState().selectedSub
            });
        }
    },

    close() {
        PlayerActions.openPlaylist(false);
    },

    getItems() {
        var itemDesc = PlayerStore.getState().itemDesc();
        if (itemDesc && itemDesc.setting && itemDesc.setting.subtitles) {
            return itemDesc.setting.subtitles;
        } else return [];
    },
    
    select(idx, item, itemId) {
        ls('lastLanguage', idx);
        PlayerStore.getState().wcjs.subtitles.track = 0;
        if (item) {
            PlayerActions.loadSub(item);
            PlayerActions.settingChange({
                selectedSub: itemId,
                subtitlesOpen: false
            });
        } else {
            PlayerActions.settingChange({
                selectedSub: itemId,
                subtitlesOpen: false,
                subtitle: [],
                trackSub: -1,
                subText: ''
            });
        }
    },

    selectInternal(idx, item, itemId) {
        var wcjs = PlayerStore.getState().wcjs;
        if (item && (itemId - 1) < wcjs.subtitles.count) {
            wcjs.subtitles.track = idx;
            PlayerActions.settingChange({
                selectedSub: itemId,
                subtitlesOpen: false,
                subtitle: [],
                subText: ''
            });
            
        }
    },

    getInternalSubs() {
        var wcjs = PlayerStore.getState().wcjs;
        var internalSubs = [];
        if (wcjs.subtitles && wcjs.subtitles.count > 0) {
            for (var i = 1; i < wcjs.subtitles.count; i++)
                internalSubs.push(wcjs.subtitles[i]);
            return internalSubs;
        } else return [];
    },

    render() {
        var itemId = 1;
        if (!ls.isSet('menuFlags') || ls('menuFlags')) {
            var none = <ListItem
                    leftAvatar={<Avatar src='https://css-tricks.com/wp-content/csstricks-uploads/transpBlack25.png' />}
                    value={1}
                    key={'None'}
                    primaryText={'None'}
                    onClick={this.select.bind(this, 'none', '', 1)} />
        } else {
            var none = <ListItem
                    value={1}
                    key={'None'}
                    primaryText={'None'}
                    onClick={this.select.bind(this, 'none', '', 1)} />
        }
        return (
            <div className={this.state.open ? 'subtitle-list show' : 'subtitle-list'}>
                <SelectableList valueLink={{value: this.state.playlistSelected}}>
                    {none}
                    {
                        _.map(this.getInternalSubs(), (item, idx) => {
                            itemId++;
                            if (!ls.isSet('menuFlags') || ls('menuFlags')) {
                                return (
                                <ListItem
                                  leftAvatar={<Avatar src={'./images/icons/internal-subtitle-icon.png'} />}
                                  value={itemId}
                                  key={item}
                                  primaryText={item}
                                  onClick={this.selectInternal.bind(this, (idx + 1), item, itemId)} />                                    
                                )
                            } else {
                                return (
                                <ListItem
                                  value={itemId}
                                  key={item}
                                  primaryText={item}
                                  onClick={this.selectInternal.bind(this, (idx + 1), item, itemId)} />                                    
                                )
                            }
                        })
                    }
                    {
                        _.map(this.getItems(), (item, idx) => {
                            itemId++;
                            var lang = idx.split('[lg]');
                            if (lang2country[lang[1]]) lang[1] = lang2country[lang[1]];
                            if (!ls.isSet('menuFlags') || ls('menuFlags')) {
                                return (
                                <ListItem
                                  leftAvatar={<Avatar src={'http://flagpedia.net/data/flags/small/'+lang[1]+'.png'} />}
                                  value={itemId}
                                  key={lang[0]}
                                  primaryText={lang[0]}
                                  onClick={this.select.bind(this, idx, item, itemId)} />
                                )
                            } else {
                                return (
                                <ListItem
                                  value={itemId}
                                  key={lang[0]}
                                  primaryText={lang[0]}
                                  onClick={this.select.bind(this, idx, item, itemId)} />
                                )
                            }
                        })
                    }
                </SelectableList>
            </div>
        );
    }

    
});