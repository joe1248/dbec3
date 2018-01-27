class ApiService {
    forceFailsGetUserDatabaseConnections: boolean = false;

    constructor() {
    }

    getConnection(id: Number, callback: Function) {
        if (id > 0) {
            callback(null, {
                db_connection_disabled: false,
                db_connection_name: 'bingo_test_db_connection_name',
                db_id: id,
                db_pass_word: 'db_password_111',
                db_port_number: '3333',
                db_selected_ftp_id: 777,
                db_url_host: 'db_host',
                db_user_name: 'db_user',
                ftp_connection_name: 'ssh_name',
                ftp_pass_word: 'ssh_pass',
                ftp_port_number: '22',
                ftp_url_host: 'ssh_host',
                ftp_user_name: 'ssh_user',
                select_db_protocol: 'over_ssh'
            });
            return;
        }
        callback('Error on purpose loading connection data', {});
    }

    saveConnection(connection: UserDbConnection, callback: Function) {
        if (connection && connection.db_id >= 0) {
            callback(null, connection);
            return;
        }
        callback('Error on purpose saving connection data', {});
    }

    deleteConnection(connectionId: Number, callback: Function) {
        if (connectionId >= 0) {
            callback(null);
            return;
        }
        callback('Error on purpose deleting connection data');
    }

    getUserDatabaseConnections(callback: Function) {
        if (this.forceFailsGetUserDatabaseConnections) {
            callback('Error on purpose getting UserDatabaseConnections.');
            return;
        }
        //console.log("\n\n\n\n\n-------------------------this\n\n");
        //console.log(this);
        callback(null, [
            {
                db_connection_disabled: false,
                db_connection_name: 'nice_test_db_connection_name',
                db_id: 123
            },
            {
                db_connection_disabled: true,
                db_connection_name: 'nice_too_test_db_connection_name',
                db_id: 456
            }
        ]);
    }
}
export default new ApiService;