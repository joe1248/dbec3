<template>
    <div class="connection">

        <div class="loading" v-if="loading">
            Loading one connection details.
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <form id="form_connection_" v-if="connection">
            <div class="nobr" style="position:relative;left:32%;width:50%;">
                <input id="button_test_connection_works_" style="display:none;" class="ui-button" type="button" value="Test this connection">&nbsp;&nbsp;&nbsp;
                <input id="button_to_disable_one_connection_" style="display:none;" class="ui-button" type="button" value="Disable">
                <input id="button_to_enable_one_connection_"  style="display:none;" class="ui-button" type="button" value="Enable">&nbsp;&nbsp;&nbsp;
                <button @click="save">{{buttonLabel}}</button>
            </div><br>
            <div class="center1 content"><div class="center2"><div class="center3" style="width:750px;"><div>
                <div id="div_for_server_messages_" class="ui-corner-all" style="display:inline-block;line-height:30px;text-align:center;width:550px;"></div><br><br>

                <div id="edit_connection_jquery_tabs_">

                    <ul><li><a href="#tab_db">Database</a></li>
                        <li><a href="#tab_ssh">SSH</a></li>
                        <li><div style="position: relative; margin-top: 6px; width:400px;">
                            <label for="select_db_protocol">Choose a type: </label>
                            <select class="ui-button" style="width:250px;"
                                    id="select_db_protocol"
                                    v-model="connection.select_db_protocol">
                                <option value=""           >Over HTTP</option>
                                <option value="over_ssh"   >Over SSH</option>
                            </select>
                        </div>
                        </li>
                    </ul>
                    <div id="tab_db">
                        <table class="align_right" style="border-spacing: 10px; border-collapse: separate;">
                            <tr>
                                <th class="align_right">
                                    <label for="db_connection_name">DB Label</label>
                                </th>
                                <th>
                                    <input class="ui-button" type="text" size="50" style="width:371px;background-color:orange;" maxlength="50"
                                           v-model="connection.db_connection_name"
                                           id="db_connection_name">
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="db_url_host">DB Host</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50"
                                           id="db_url_host"
                                           v-model="connection.db_url_host">
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="db_username">User Name</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50"
                                           id="db_username" autocomplete="off"
                                           v-model="connection.db_user_name">
                                </td><td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="db_password">Password</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="password" size="50" style="width:371px;" maxlength="50"
                                           id="db_password"
                                           v-model="connection.db_pass_word">

                                </td>
                                <td>
                                    <input type="button" class="small-button" id="view_db_pass" value="View">
                                </td>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="db_port_number">Port&nbsp;Number</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="text" size="50" style="width:371px;" maxlength="10"
                                           id="db_port_number"
                                           v-model="connection.db_port_number">
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                        </table>
                    </div>
                    <div id="tab_ssh">
                        <table class="align_right" style="border-spacing: 10px; border-collapse: separate;">
                            <tr>
                                <th class="align_right">
                                    <label for="ftp_connection_name">SSH Label</label>
                                </th>
                                <th>
                                    <input class="ui-button" type="text" size="50" style="width:371px;background-color:orange;" maxlength="50"
                                           id="ftp_connection_name"
                                           v-model="connection.ftp_connection_name">
                                </th>
                                <th>&nbsp;</th>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="ftp_url_host">SSH Host</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50"
                                           id="ftp_url_host"
                                           v-model="connection.ftp_url_host">
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="ftp_username">User Name</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50"
                                           id="ftp_username" autocomplete="off"
                                           v-model="connection.ftp_user_name">
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="ftp_password">Password</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="password" size="50" style="width:371px;" maxlength="50"
                                           id="ftp_password"
                                           v-model="connection.ftp_pass_word">
                                </td>
                                <td>
                                <input type="button" class="small-button" id="view_ftp_pass_" value="View">
                            </td>
                            </tr>
                            <tr>
                                <td class="align_right">
                                    <label for="ftp_port_number">Port&nbsp;Number</label>
                                </td>
                                <td>
                                    <input class="ui-button" type="text" size="50" style="width:371px;" maxlength="10"
                                           id="ftp_port_number"
                                           v-model="connection.ftp_port_number">
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div></div></div></div>
        </form>
    </div>
</template>

<script>
    import ApiService from './../ApiService';

    export default {
        props: {
            id: {
                //type: Number,
                //required: true
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
                buttonLabel: this.id ? 'Save connection' : 'Create new connection'
            }
        },
        created() {
            this.fetchData()
        },
        watch: {
             // call again the method if the route changes
             '$route': 'fetchData'
        },
        methods: {
            fetchData() {
                if (!this.id) {
                    this.decorateUi();
                    return;
                }
                this.error = this.connection = null;
                this.loading = true;
                ApiService.getConnection(this.id,  (err, data) => {
                    this.loading = false;
                    if (err) {
                        this.error = err.toString();
                        return;
                    }
                    this.connection = data;
                    this.decorateUi();
                });
             },

            decorateUi() {
                this.$nextTick(function () {
                    $('#edit_connection_jquery_tabs_').tabs(); // Create 2 TABS within edit DB connection screen : DB details on TAB_1 and SSH details on TAB_2.
                    reset_jquery_styles();
                });
            },

            save() {
                this.loading = true;
                ApiService.saveConnection(this.connection,  (err, data) => {
                    this.loading = false;
                    if (err) {
                        this.error = err.toString();
                        return;
                    }
                    this.connection = data;
                    this.decorateUi();
                });

            }
        }
    }
</script>
