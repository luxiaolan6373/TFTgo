class ClientHelper {

    constructor(is_home) {
        this.target_window = window.opener || window.top;
        // Message type
        this.rpcs_type = 'RpcsWindowMessenger';
        this.riot_type = 'RClientWindowMessenger';
        this.gdp_type = 'GdpWindowMessenger';
        this.lwd_type = 'LwdWindowMessenger';
        this.rpcs_tbl_ = {};
        this.rpcs_seq_tbl_ = {};
        this.riot_tbl_ = {};
        this.gdp_seq_tbl_ = {};
        this.gdp_relay_tbl_ = {};
        this.lwd_seq_tbl_ = {};
        this.lwd_relay_tbl_ = {};
        // Login
        this.login_init = false;
        this.login_success_cbs = [];
        this.login_fail_cbs = [];
        // Add event listener
        window.addEventListener('message', ev => this._dispatcher(ev.data.type, ev.data.messageType, ev.data.sequence, ev.data.data, ev), false);
        if (is_home !== false) {
            // Disallow modes
            this.disallow_modes = [];
            this._register_rpcs_msg('disallow-modes', data => {
                //console.log(data);
                if (data.id && data.id != '') {
                    this.disallow_modes = data.id.split(' ');
                } else if (data.id == '') {
                    this.disallow_modes = [];
                }
            });
            // Register as home page
            this._send_rpcs_msg('rpcs-home-loaded');
        }
        // Create bg frame
        this.createBgFrame();
        // // 娴嬭瘯鏃ュ織涓婃姤
        // this.reportLogTip();
        // 娴嬭瘯寮圭獥闂
        this.openTVPage();
        // // 瀹夊叏鎻掍欢鍥炶皟
        // this.getRpcsCallback();
    }
    gdpAccSend(){
        this._send_gdp_msg('network_assistant_open');
    }
    getRpcsCallback() {
        let firstGetRpcsInfo = true;
        this._register_rpcs_msg('login-service-loaded', data => {
            if (firstGetRpcsInfo) {
                let sequence = Date.now() + Math.random().toString().substr(2, 10);
                this._send_lwd_msg('rpcs-plugin-loaded', data, sequence);
                firstGetRpcsInfo = false;
            }
        });
    }
    openTVPage() {
        this.registerToLwdRelay('click-tv-live-btn', (data) => {
            let tvPopDom = document.querySelector("#tvpop a");
            if (tvPopDom) {
                tvPopDom.click();
            } else {
                if (data.homeUrl) {
                    document.location.href = data.homeUrl;
                } else {
                    document.location.href = 'https://lol.qq.com/client/lcu/page/tv/new_index.html';
                }
            }
        })
    }
    // reportLogTip() {
    //     this._register_rpcs_msg('popup-upload-file-dialog', () => {
    //         this._request_lwd('show-popup-upload-file');
    //     });
    // }
    _register_rpcs_msg(msg_type, cb) {
        //console.log('Register listener for ' + msg_type);
        this._add_cb(this.rpcs_tbl_, msg_type, cb);
    }

    _register_rpcs_seq_msg(sequence, msg_type, cb) {
        //  console.log('Register listener for ' + msg_type + ', sequence: ' + sequence);
        this.rpcs_seq_tbl_[sequence] = cb;
    }

    _register_riot_msg(msg_type, cb) {
        //  console.log('Register listener for ' + msg_type);
        this._add_cb(this.riot_tbl_, msg_type, cb);
    }

    _register_gdp_seq_msg(sequence, cb) {
        this.gdp_seq_tbl_[sequence] = cb
    }

    _register_lwd_seq_msg(sequence, cb) {
        this.lwd_seq_tbl_[sequence] = cb
    }

    _send_rpcs_msg(msg_type, data = undefined, sequence = undefined, src = '*') {
        const msg = {
            type: this.rpcs_type,
            messageType: msg_type,
        }
        if (data !== undefined) msg.data = data;
        if (sequence !== undefined) msg.sequence = sequence;
        // console.log('Send message: ' + msg_type, data);
        this.target_window.postMessage(msg, src);
    }

    _send_riot_msg(msg_type, data = undefined, src = '*') {
        const msg = {
            type: this.riot_type,
            messageType: msg_type,
        }
        if (data !== undefined) msg.data = data;
        this.target_window.postMessage(msg, src);
    }

    _send_gdp_msg(msg_type, data = undefined, sequence = undefined, src = '*') {
        const msg = {
            type: this.gdp_type,
            messageType: msg_type,
        }
        if (data !== undefined) msg.data = data;
        if (sequence !== undefined) msg.sequence = sequence;
        console.log('Send message: ', msg);
        this.target_window.postMessage(msg, src);
    }

    _send_lwd_msg(msg_type, data = undefined, sequence = undefined, src = '*') {
        const msg = {
            type: this.lwd_type,
            messageType: msg_type,
        }
        if (data !== undefined) msg.data = data;
        if (sequence !== undefined) msg.sequence = sequence;
        console.log('Send message: ', msg);
        this.target_window.postMessage(msg, src);
    }

    _add_cb(tbl, key, cb) {
        if (!(key in tbl)) {
            tbl[key] = new Set();
        }
        tbl[key].add(cb);
    }

    _remove_cb(tbl, key, cb) {
        if (key in tbl) {
            tbl[key].delete(cb);
        }
    }

    _call_cb(cbs, data, ev) {
        for (let cb of cbs) {
            try {
                cb && cb(data, ev);
            } catch (e) {
                console.error('client helper exception', e);
            }
        }
    }

    _dispatcher(type, msg_type, sequence, data, ev) {
        // console.log('message received', type, msg_type, sequence, data);
        if (type == this.riot_type) {
            if (msg_type in this.riot_tbl_) {
                this._call_cb(this.riot_tbl_[msg_type], data, ev);
            }
        } else if (type == this.rpcs_type) {
            if (sequence) {
                // Callback identified by sequence
                if (sequence in this.rpcs_seq_tbl_) {
                    this.rpcs_seq_tbl_[sequence](data, ev);
                } else {
                    // console.error('No handler for message: ' + sequence, data);
                }
            } else if (msg_type in this.rpcs_tbl_) {
                // Callback identified by message type
                this._call_cb(this.rpcs_tbl_[msg_type], data, ev);
            }
        } else if (type == this.gdp_type) {
            if (msg_type == 'relay_message') {
                // Relay message
                switch (data.type) {
                    case 'live-popup':
                        // Only popup in non tv page
                        if (!['lol.qq.com/client/lcu/page/tv/index.html', 'lol.qq.com/client/lcu/page/tv/room.html', 'lol.qq.com/client/lcu/page/tv/room-offcial.html'].includes(location.host + location.pathname)) {
                            this.target_window.postMessage(data.data, '*');
                        }
                        break;
                    case 'redirect':
                        location.href = data.data;
                        break;
                    case 'full-page-modal':
                        this.target_window.postMessage({
                            type: 'RClientWindowMessenger',
                            messageType: 'rcp-fe-lol-home-open-full-page-modal',
                            data: {
                                url: data.url,
                            }
                        }, '*');
                        break;
                    default:
                        if (data.type in this.gdp_relay_tbl_) {
                            this.gdp_relay_tbl_[data.type](data);
                        } else {
                            console.error(`Unknown relay message type ${data.type}`);
                        }
                        break;
                }
            } else if (sequence in this.gdp_seq_tbl_) {
                this.gdp_seq_tbl_[sequence](data, ev);
            } else {
                // console.error('No handler for message: ' + sequence, data);
            }
        } else if (type == this.lwd_type) {
            if (msg_type == 'lwd-response') {
                // Callback identified by sequence
                console.log("lwd-response", data);
                if (sequence in this.lwd_seq_tbl_) {
                    this.lwd_seq_tbl_[sequence](data, ev);
                } else {
                    // console.error('No handler for message: ' + sequence, data);
                }
            } else if (msg_type == 'lwd-msg') {
                // Callback identified by type
                if (data.type in this.lwd_relay_tbl_) {
                    this.lwd_relay_tbl_[data.type](data, ev);
                }
            } else {
                console.error(`unknown lwd message type: ${msg_type}`);
            }
        }
    }

    _request_rpcs(request_type, response_type, data, cb) {
        if (cb) {
            var sequence;
            if (['get-player-basic-info', 'create-login-helper-frame2', 'force-reload-helper-frame', 'generate-client-token', 'get-login-info'].indexOf(request_type) >= 0) {
                sequence = Date.now() + Math.random().toString().substr(2, 10);
                // Sequence
                this._register_rpcs_seq_msg(sequence, response_type, (result, ev) => {
                    cb(result);
                    delete this.rpcs_seq_tbl_[sequence];
                });
            } else {
                // Message type
                var func = (result, ev) => {
                    this._remove_cb(this.rpcs_tbl_, response_type, func);
                    cb(result);
                }
                this._register_rpcs_msg(response_type, func);
            }
        }
        this._send_rpcs_msg(request_type, data, sequence);
    }

    _request_riot(request_type, response_type, data, cb) {
        var func = (result, ev) => {
            this._remove_cb(this.riot_tbl_, response_type, func);
            cb(result);
        }
        this._register_riot_msg(response_type, func);
        this._send_riot_msg(request_type, data);
    }

    _request_gdp(request_type, data, cb) {
        // Sequence
        var sequence = Date.now() + Math.random().toString().substr(2, 10);
        if (cb) {
            this._register_gdp_seq_msg(sequence, (result, ev) => {
                cb(result);
                delete this.gdp_seq_tbl_[sequence];
            });
        }
        this._send_gdp_msg(request_type, data, sequence);
    }

    _request_lwd(request_type, data, cb) {
        // Sequence
        var sequence = Date.now() + Math.random().toString().substr(2, 10);
        if (cb) {
            this._register_lwd_seq_msg(sequence, (result, ev) => {
                cb(result);
                delete this.lwd_seq_tbl_[sequence];
            });
            console.log("register lwd sequence callback ", this.lwd_seq_tbl_[sequence]);
        }
        this._send_lwd_msg(request_type, data, sequence);
    }

    // Login
    initLogin() {
        this.getUserInfo(info => {
            let zoneid = info.zone_id;
            // Clear IED_LOG_INFO2 before check login
            if (milo.cookie.get("IED_LOG_INFO2")) {
                milo.cookie.clear("IED_LOG_INFO2");
                milo.cookie.clear('IED_LOG_INFO2', 'qq.com', '/');
            }
            need("biz.login", LoginManager => {
                LoginManager.checkLogin(() => {
                    // Alread logined
                    //console.log('Logined. Skip login init.');
                    this.login_init = true;
                    for (let cb of this.login_success_cbs) {
                        cb && cb();
                    }
                    this.login_success_cbs = [];
                    this.login_fail_cbs = [];
                    // Register login message listener
                    this._register_rpcs_msg('foward-from-helper', data => {
                        // Login method callback
                        if (data.login) {
                            for (let cb of this.login_success_cbs) {
                                cb && cb(false);
                            }
                        } else {
                            for (let cb of this.login_fail_cbs) {
                                cb && cb(false);
                            }
                        }
                        this.login_success_cbs = [];
                        this.login_fail_cbs = [];
                    });
                }, () => {
                    //console.log('Init login');
                    // Helper frame
                    // Set login timeout
                    var timeout = setTimeout(() => {
                        console.log('Login timeouted');
                        this.login_init = true;
                        LoginManager.checkLogin(() => {
                            // Logined
                            for (let cb of this.login_success_cbs) {
                                cb && cb(true);
                            }
                            this.login_success_cbs = [];
                            this.login_fail_cbs = [];
                        }, () => {
                            // Login failed
                            for (let cb of this.login_fail_cbs) {
                                cb && cb(true);
                            }
                            this.login_success_cbs = [];
                            this.login_fail_cbs = [];
                        });
                    }, 5000);
                    // Register login message listener
                    this._register_rpcs_msg('foward-from-helper', data => {
                        if (data.type == 'login-state' && !this.login_init) {
                            // Only init once
                            this.login_init = true;
                            // Cancel timeout
                            clearTimeout(timeout);
                            if (data.login) {
                                for (let cb of this.login_success_cbs) {
                                    cb && cb(false);
                                }
                            } else {
                                for (let cb of this.login_fail_cbs) {
                                    cb && cb(false);
                                }
                            }
                            this.login_success_cbs = [];
                            this.login_fail_cbs = [];
                        } else if (data.type == 'login-state' && this.login_init) {
                            // Login method callback
                            if (data.login) {
                                for (let cb of this.login_success_cbs) {
                                    cb && cb(false);
                                }
                            } else {
                                for (let cb of this.login_fail_cbs) {
                                    cb && cb(false);
                                }
                            }
                            this.login_success_cbs = [];
                            this.login_fail_cbs = [];
                        }
                    });
                    // Reload in case iframe already exist
                    if (!info.init_loaded) {
                        this._send_rpcs_msg('force-reload-helper-frame', undefined, Date.now() + Math.random().toString().substr(2, 10));
                    }
                    // Create login helper
                    this._login_retry_count = 0;
                    this._request_rpcs('create-login-helper-frame2', 'login-helper-frame-created', undefined, data => {
                        if (!data.ok) {
                            if (this._login_retry_count++ < 3) {
                                // Retry after 1 second
                                setTimeout(this._create_login_helper, 1000);
                            }
                        } else {
                            // console.log('login helper created');
                        }
                    });
                });
            });
        });
    }

    login(cb) {
        cb && this.login_success_cbs.push(cb);
        this._send_rpcs_msg('force-reload-helper-frame', undefined, Date.now() + Math.random().toString().substr(2, 10))
    }

    // Check login
    checkLogin(success, fail) {
        if (this.login_init) {
            need("biz.login", LoginManager => {
                LoginManager.checkLogin(success, fail);
            });
        } else {
            success && this.login_success_cbs.push(success);
            fail && this.login_fail_cbs.push(fail);
        }
    }

    // Get client token
    getClientToken(data, cb) {
        this._request_rpcs('generate-client-token', 'generate-client-token', data, cb);
    }

    // Get user info
    getUserInfo(cb) {
        this._request_rpcs('get-player-basic-info', 'player-basic-info', undefined, data => {
            this.getDirServer(svr => {
                if (svr.ret === 0) {
                    switch (svr.dirserver) {
                        case 'tversion-test1.lol.qq.com':
                            // TODO
                            data.zone_id = '101';
                            break;
                        case 'lol-match.tcls.qq.com':
                            // TODO
                            data.zone_id = '8888';
                            break;
                        case 'tdir2.lol.qq.com':
                            break;
                        default:
                            console.warn(`Unknown dirserver ${svr.dirserver}`);
                            break;
                    }
                } else {
                    console.error('Get dirserver failed', svr)
                }
                cb(data);
            })
        });
    }

    // Get client data
    getClientData(cb) {
        this._request_riot('rcp-fe-lol-home-data-request', 'rcp-fe-lol-home-data-response', undefined, cb);
    }

    // Get champion data
    getChampionData(id, cb) {
        this._request_riot('rcp-fe-lol-home-champ-game-data-request', 'rcp-fe-lol-home-champ-game-data-response', {
            champId: id
        }, cb);
    }

    // Disallow mode
    isModeAllow(id) {
        return this.disallow_modes.indexOf(id.toString()) < 0;
    }

    showDisallowModeDialog(id) {
        this._send_rpcs_msg('mode-disallowed', {
            popup: true,
            id: id,
        });
    }

    // Gdp
    createLiveRoom(team_one, team_two) {
        this._send_gdp_msg('create_room', {
            teams: {
                one: team_one,
                two: team_two,
            }
        });
    }

    participateAuction(anchor, team) {
        this._send_gdp_msg('player_auction', {
            anchor: anchor,
            team: team,
        });
    }

    configRune(name, style, substyle, runes, cb) {
        this._request_gdp('create_perk', {
            name: name,
            perkStyle: style,
            perkSubStyle: substyle,
            perkIds: runes,
        }, cb);
    }

    overwriteRune(name, style, substyle, runes, cb) {
        this._request_gdp('cover_perk', {
            name: name,
            perkStyle: style,
            perkSubStyle: substyle,
            perkIds: runes,
        }, cb);
    }

    getRp(cb) {
        this._request_gdp('get_rp', undefined, cb);
    }

    createBgFrame(cb) {
        this._request_gdp('create_iframe', undefined, cb);
    }

    reloadBgFrame(cb) {
        this._request_gdp('reload_iframe', undefined, cb);
    }

    relayMessage(type, data, cb) {
        this._request_gdp('relay_message', {
            type: type,
            data: data
        }, cb);
    }

    registerRelayMessage(type, cb) {
        this.gdp_relay_tbl_[type] = cb;
    }

    isMatchServer(cb) {
        this._request_gdp('get_match', undefined, cb);
    }

    getGameFlow(cb) {
        this._request_gdp('get_gameflow', undefined, cb);
    }

    getDirServer(cb) {
        this._request_gdp('get_dirserver', undefined, cb);
    }

    getPreviousGameId(cb) {
        this._request_gdp('get_prev_gameid', undefined, cb);
    }

    openTvTips(url, cb) {
        this._request_gdp('tips_tv_open', {
            url: url,
        }, cb);
    }

    closeTvTips(cb) {
        this._request_gdp('tips_tv_close', undefined, cb);
    }

    redirectHome(url, cb) {
        this._request_gdp('tencent-tv-event', {
            url: url,
            type: 'click',
        }, cb);
    }

    // Websocket
    getAnchorStats(cb) {
        this._request_gdp('get_rep_mac_res', undefined, cb);
    }

    // LWD

    friendRequest(name, cb) {
        this._request_lwd('friend-request', {
            name: name
        }, cb)
    }

    showMsgBox(options, cb) {
        this._request_lwd('show-msgbox', {
            options: options
        }, cb)
    }

    hideMsgBox(cb) {
        this._request_lwd('hide-msgbox', undefined, cb)
    }

    toggleMsgBox(options, cb) {
        this._request_lwd('toggle-msgbox', {
            options: options
        }, cb)
    }

    registerMsg(type, cb) {
        this._request_lwd('register-msg', {
            type: type
        }, data => {
            if (data.status) {
                this.lwd_relay_tbl_[type] = cb
            }
        })
    }

    unregisterMsg(type) {
        this._request_lwd('unregister-msg', {
            type: type
        }, data => {
            if (data.status) {
                delete this.lwd_relay_tbl_[type]
            }
        })
    }

    sendMsg(data, cb) {
        this._request_lwd('send-msg', data, cb)
    }

    // Communication between home and helper
    sendMessageToHelper(data, cb) {
        this._request_rpcs('foward-home-to-helper', 'foward-from-helper', data, cb);
    }

    sendMessageToHome(data, cb) {
        this._request_rpcs('foward-helper-to-home', 'foward-from-home', data, cb);
    }

    //register callback to lwd_relay_tbl_ to response to the lwd-msg from top window
    // use for play btn delay
    registerToLwdRelay(type, cb) {
        this.lwd_relay_tbl_[type] = cb;
    }

    isClient(cb1) {
        var cb = function(data) {
            if (data.clientData) {
                let res = { isClient: true };
                cb1(res);
            } else {
                let res = { isClient: false };
                cb1(res);
            }
        }
        this._request_riot('rcp-fe-lol-home-data-request', 'rcp-fe-lol-home-data-response', undefined, cb);
    }


    // add by xiangangwei 03-11-2019
    // for client anti-addiction
    showAntiAddiction(options, cb) {
        this._request_lwd('show_antiAddiction', {
            options: options
        }, cb)
    }

    hideAntiAddiction(cb) {
        this._request_lwd('hide_antiAddiction', undefined, cb)
    }

    closeUploadPopIframe(cb) {
        this._request_lwd('close_popup_upload_file', undefined, cb)
    }

    toggleAntiAddiction(options, cb) {
        this._request_lwd('toggle_antiAddiction', {
            options: options
        }, cb)
    }

    setAddictionTime(options, cb) {
        this._request_lwd('antiAddiction_setTime', {
            options: options
        }, cb)
    }

    closeClient(options, cb) {
        this._request_lwd('close_client', {
            options: options
        }, cb)
    }


}