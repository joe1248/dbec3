<template>
<div class="centered" id="app">
    <div style="width:100%;" class="centered">
        <br>
        <router-link :to="{name: 'NewConnection' }" tag="button">Add New DB Server</router-link>
        <br><br>
    </div>
    <fieldset class="fieldset one_line">
        <legend class="legend">Your DB Servers.</legend>
        <ul v-if="errors && errors.length">
            <li v-for="error of errors">
                {{error.message}}
            </li>
        </ul>

        <!--<ul v-if="!isLoading">-->
            <table style="width:400px;" v-if="connections && connections.length">
                <tr v-for="connection of connections">
                    <td class="centered" style="width:20px;">
                        <div class="connection_statuses">&nbsp;</div>
                    </td>
                    <td style="text-indent:20px;">{{connection.db_connection_name}}</td>
                    <td class="centered" id="td_button_connection_sql_id" style="width:55px;">&nbsp;	</td>
                    <!--<td><input type="button" value="Enable"	html_connection_id="" html_connection_label="" class="small-button button_connection_enable"></td>-->
                    <td><router-link :to="{name: 'EditConnection', params: { id: connection.db_id } }" tag="button" class="small-button">Edit</router-link></td>
                    <td><button @click="deleteConnection(connection)" class="small-button">Delete</button></td>
                    <!--<td><input type="button" value="Clone"		html_connection_id="" html_connection_label="" class="small-button button_connection_clone"></td>-->
                </tr>
            </table>
        <!--<Loader v-else="!isLoading"></Loader>-->
    </fieldset>
</div>
</template>

<script>
    import ApiService from './../ApiService';

    export default {
        data () {
            return {
                loading: false,
                connections: [],
                error: null
            }
        },

        created() {
            this.fetchData()
        },

        methods: {
            fetchData() {
                this.loading = true;
                ApiService.getUserDatabaseConnections((err, data) => {
                    this.loading = false;
                    if (err) {
                        this.error = err.toString();
                        return;
                    }
                    this.connections = data;
                    this.decorateUi();
                });
            },

            decorateUi() {
                this.$nextTick(function () {
                    reset_jquery_styles();
                });
            },

            deleteConnection(connection) {
                ApiService.deleteConnection(connection.db_id, (err) => {
                    if (err) {
                        this.error = err.toString();
                        return;
                    }
                    this.fetchData();
                });
            }

        } // End of methods
    }
</script>