class ApiService {
    constructor() {
        //console.log('Mock ApiService: constructor was called');
    }

    getConnection(id, callback) {
        if (id > 0) {
            callback(null, {
                db_id: id,
                db_connection_name: 'bingo_test_db_connection_name'
            });
            return;
        }
        callback('Error on purpose loading connection data', {});
    }

    saveConnection(connection, callback) {
        if (connection && connection.db_id >= 0) {
            callback(null, connection);
            return;
        }
        callback('Error on purpose saving connection data', {});
    }
}
export default new ApiService;