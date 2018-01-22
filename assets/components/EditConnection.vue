<template>
    <form id="form_connection_[#TAB_COUNTER#]" class="">
        <input type="hidden" id="hidden_input_connection_id_[#TAB_COUNTER#]" name="db_id">
        <input type="hidden" id="hidden_disabled_connection_id_[#TAB_COUNTER#]"><br>
        <div class="nobr" style="position:relative;left:32%;width:50%;">
            <input id="button_test_connection_works_[#TAB_COUNTER#]" style="display:none;" class="ui-button" type="button" value="Test this connection">&nbsp;&nbsp;&nbsp;
            <input id="button_to_disable_one_connection_[#TAB_COUNTER#]" style="display:none;" class="ui-button" type="button" value="Disable">
            <input id="button_to_enable_one_connection_[#TAB_COUNTER#]"  style="display:none;" class="ui-button" type="button" value="Enable">&nbsp;&nbsp;&nbsp;
            <input id="submit_conn_form_[#TAB_COUNTER#]" class="ui-button" type="button" value="Save">
        </div><br>
        <!-- OPENING 4 + 1 DIVS -->
        <div class="center1 content"><div class="center2"><div class="center3" style="width:750px;"><div>
            <div id="div_for_server_messages_[#TAB_COUNTER#]" class="ui-corner-all" style="display:inline-block;line-height:30px;text-align:center;width:550px;"></div><br><br>
            <div id="edit_connection_jquery_tabs_[#TAB_COUNTER#]">
                <ul><li><a href="#tab_db">Database</a></li>
                    <li><a href="#tab_ssh">SSH</a></li>
                    <li><div style="position:relative;top:-17px;width:400px;">
                        <select input class="ui-button" style="width:250px;" name="select_db_protocol" id="select_db_protocol_[#TAB_COUNTER#]">
                            <option value=""           >Over HTTP</option>
                            <option value="over_ssh"   >Over SSH</option>
                        </select>
                    </div>
                    </li>
                </ul>
                <div id="tab_db">
                    <p>    <table class="align_right" style="border-spacing: 10px; border-collapse: separate;">
                    <tr><th class="align_right">DB Label         </th><th><input class="ui-button" type="text" size="50" style="width:371px;background-color:orange;" maxlength="50" name="db_connection_name"></th></th></tr>
                    <tr><td class="align_right">DB Host          </td><td><input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50" name="db_url_host"></td><td>&nbsp;</td></tr>
                    <tr><td class="align_right">User Name        </td><td><input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50" name="db_user_name" autocomplete="off"></td><td>&nbsp;</td></tr>
                    <tr><td class="align_right">Password         </td><td><input class="ui-button" type="password" size="50" style="width:371px;" maxlength="50" name="db_pass_word" id="db_pass_word_[#TAB_COUNTER#]">
                    </td><td><input type="button" class="small-button" id="view_db_pass_[#TAB_COUNTER#]" value="View"></td></tr>
                    <tr><td class="align_right">Port&nbsp;Number </td><td><input class="ui-button" type="text" size="50" style="width:371px;" maxlength="10" name="db_port_number"></td><td>&nbsp;</td></tr>
                </table>
                    </p>
                </div>
                <div id="tab_ssh">
                    <p>    <table class="align_right" style="border-spacing: 10px; border-collapse: separate;">
                    <tr><th class="align_right">SSH Label         </th><th><input class="ui-button" type="text" size="50" style="width:371px;background-color:orange;" maxlength="50" name="ftp_connection_name"></th><th>&nbsp;</th></tr>
                    <tr><td class="align_right">SSH Host          </td><td><input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50" name="ftp_url_host"         ></td><td>&nbsp;</td></tr>
                    <tr><td class="align_right">User Name         </td><td><input class="ui-button" type="text" size="50" style="width:371px;" maxlength="50" name="ftp_user_name"         autocomplete="off"></td><td>&nbsp;</td></tr>
                    <tr><td class="align_right">Password          </td><td><input class="ui-button" type="password" size="50" style="width:371px;" maxlength="50" name="ftp_pass_word" id="ftp_pass_word_[#TAB_COUNTER#]">
                    </td><td><input type="button" class="small-button" id="view_ftp_pass_[#TAB_COUNTER#]" value="View"></td></tr>
                    <tr><td class="align_right">Port&nbsp;Number  </td><td><input class="ui-button" type="text" size="50" style="width:371px;" maxlength="10" name="ftp_port_number"></td><td>&nbsp;</td></tr>
                </table>
                    </p>
                </div>
            </div>
            <!-- CLOSING ING 4 + 1 DIVS -->
        </div></div></div></div></div>
    </form>
</template>

<script>
    import axios from 'axios';

    export default {
        data () {
            return {
                connections : [],
                errors: []
            }
        },
        // Fetches posts when the component is created.
        created() {
            axios.get(`http://api.local.dbec3.com/connection/`)
                .then(response => {
                    console.log(response.data);
                    this.connections = response.data
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
        methods: {
            editConnection(connection) {
                const url = '/dashboard/connections/edit/' + connection.id;
                window.history.pushState(
                    null,
                    url, ///routes[this.href],
                    window.location.pathname
                )
                window.location = url;
            }
        }
    }
</script>