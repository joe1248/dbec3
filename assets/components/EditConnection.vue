<script lang="ts">
import Alert from './Alert';
import ApiService from './../ApiService';
import Materialize from 'materialize-css/dist/js/materialize.min.js';

export default {
    props: {
        id: {
            type: Number,
            required: false
        }
    },
    data() {
        return {
            loading: false,
            connection: {
                db_connection_disabled: false,
                db_connection_name: '',
                db_id: null,
                db_pass_word: '',
                db_port_number: '',
                db_selected_ftp_id: null,
                db_url_host: '',
                db_user_name: '',
                ftp_connection_name: '',
                ftp_pass_word: '',
                ftp_port_number: '',
                ftp_url_host: '',
                ftp_user_name: '',
                select_db_protocol: ''
            },
            error: null,
            successMessage: ''
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route': 'fetchData', // call again the method if the route changes
        error: function (val) {
            if (typeof Materialize.toast == 'function') {
                Materialize.toast(val, 2000);
                this.error = null;
            }
        },
        successMessage: function (val) {
            if (typeof Materialize.toast == 'function') {
                Materialize.toast(val, 2000);
                setTimeout(() => {
                    this.successMessage = '';
                }, 2000);
            }
        }
    },
    computed: {
        buttonLabel: {
            get() {
                return this.id ? 'Save connection' : 'Create new connection';
            }
        }
    },
    methods: {
        resetFields: function () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        fetchData: function () {
            if (!this.id) {
                this.resetFields();
                this.decorateUi();
                return;
            }
            this.error = this.connection = null;
            this.loading = true;
            ApiService.getConnection(this.id, (err: String, data: Object) => {
                this.loading = false;
                if (err) {
                    this.error = err.toString();
                    return;
                }
                this.connection = data;
                this.decorateUi();
            });
        },

        decorateUi: function () {
            this.$nextTick(function () {
                // noinspection TypeScriptUnresolvedFunction
                // Keep the line above in case add new js library not working in settings. (works on immediate next line)
                // Materialize.sayHelloInSpanish();
                $('ul.tabs').tabs();
                if (typeof Materialize.updateTextFields == 'function'){ // bug in materializeCss where updateTextFields is defined in docReady only
                    Materialize.updateTextFields();
                }
            });
        },

        save: function (e: Event) {
            e.preventDefault();
            this.loading = true;
            this.error = '';
            ApiService.saveConnection(this.connection, (err: String, data: Object) => {
                this.loading = false;
                if (err) {
                    this.error = err;
                    return;
                }
                this.successMessage = this.id ? 'All saved!' : 'Connection created';
                this.connection = data;
                this.decorateUi();
            });

        }
    }
}
</script>

<template>
    <div class="center" style="width:600px;">

        <div class="progress" v-if="loading">
            <div class="indeterminate"></div>
        </div>

        <form id="form_connection_" v-if="connection"  autocomplete="off">
            <div class="nobr center">
                <input id="button_test_connection_works_" style="display:none;" class="ui-button" type="button" value="Test this connection">&nbsp;&nbsp;&nbsp;
                <input id="button_to_disable_one_connection_" style="display:none;" class="ui-button" type="button" value="Disable">
                <input id="button_to_enable_one_connection_"  style="display:none;" class="ui-button" type="button" value="Enable">&nbsp;&nbsp;&nbsp;
                <a href="#" id="button_to_save_one_connection" class="btn" @click="save">{{buttonLabel}}</a>
            </div>

            <br>
            <div style="position: relative; margin-top: 6px; text-indent: 20px; width:400px; display: inline-block;">
                <label for="select_db_protocol" style="font-size: 1.1rem">Choose the connection protocol: </label>
                <select style="width:130px; height: 34px; display:inline;"
                        class="black-text"
                        id="select_db_protocol"
                        v-model="connection.select_db_protocol">
                    <option value=""           >Over HTTP</option>
                    <option value="over_ssh"   >Over SSH</option>
                </select>
            </div>
            <br><br>
            <ul class="tabs tabs-transparent blue lighten-3  z-depth-3">
                <li class="tab">
                    <a href="#tab_db" class="active">Database</a>
                </li>
                <li class="tab"
                    v-bind:class="{disabled: connection.select_db_protocol !== 'over_ssh'}">
                    <a href="#tab_ssh">SSH</a>
                </li>
            </ul>

            <div id="tab_db" class="col s12 z-depth-5">
                <br>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="db_connection_name">DB Label</label>
                        <input type="text" size="50" maxlength="50" class="validate"
                               v-model="connection.db_connection_name"
                               id="db_connection_name">
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="db_url_host">DB Host</label>
                        <input type="text" size="50" maxlength="50" class="validate"
                               id="db_url_host"
                               v-model="connection.db_url_host">
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="db_username">User Name</label>
                        <input type="text" size="50" maxlength="50" class="validate"
                               v-model="connection.db_user_name"
                               id="db_username">
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="db_password">Password</label>
                        <input type="password" size="50" maxlength="50" class="validate"
                               id="db_password"
                               v-model="connection.db_pass_word">
                    </div>
                    <div class="col s2 offset-s1">
                        <a href="#" class="btn small" id="view_db_pass">View</a>
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="db_port_number">Port&nbsp;Number</label>
                        <input type="text" size="10" maxlength="6" class="validate"
                               placeholder="3306"
                               id="db_port_number"
                               v-model="connection.db_port_number">
                    </div>
                </div>
            </div>
            <div id="tab_ssh" class="col s12 z-depth-5">
                <br>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="ftp_connection_name">SSH Label</label>
                        <input type="text" size="50" maxlength="50" class="validate"
                               v-model="connection.ftp_connection_name"
                               id="ftp_connection_name">
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="ftp_url_host">SSH Host</label>
                        <input type="text" size="50" maxlength="50" class="validate"
                               id="ftp_url_host"
                               v-model="connection.ftp_url_host">
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="ftp_username">User Name</label>
                        <input type="text" size="50" maxlength="50" class="validate"
                               v-model="connection.ftp_user_name"
                               id="ftp_username">
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="ftp_password">Password</label>
                        <input type="password" size="50" maxlength="50" class="validate"
                               id="ftp_password"
                               v-model="connection.ftp_pass_word">
                    </div>
                    <div class="col s2 offset-s1">
                        <a href="#" class="btn small" id="view_ftp_pass">View</a>
                    </div>
                </div>
                <div class="row slim">
                    <div class="input-field col s6 offset-s1">
                        <label for="ftp_port_number">Port&nbsp;Number</label>
                        <input type="text" size="10" maxlength="6" class="validate"
                               placeholder="22"
                               id="ftp_port_number"
                               v-model="connection.ftp_port_number">
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .slim { margin-bottom: 0;}
    *::-moz-placeholder, *::placeholder { color: black;}
</style>