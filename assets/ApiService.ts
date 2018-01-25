import ApiServiceHelper from './js/lib/ApiServiceHelper';

class ApiService {

    constructor() {
        this.ApiServiceHelper = ApiServiceHelper;
    }

    getUserDatabaseConnections(callback: Function) {
        this.ApiServiceHelper.get(`http://api.local.dbec3.com/connections`, callback);
    }

    getConnection(id: Number, callback: Function) {
        this.ApiServiceHelper.get(`http://api.local.dbec3.com/connection/` + id, callback);
    }

    saveConnection(connection: Object, callback: Function) {
        const connectionId = connection && connection.db_id || null;
        if (connectionId) {
            this.ApiServiceHelper.patch('http://api.local.dbec3.com/connection/edit', connection, callback);
        } else {
            this.ApiServiceHelper.post('http://api.local.dbec3.com/connection/new', connection, callback);
        }
    }

    deleteConnection(connectionId: Number, callback: Function) {
        if (connectionId) {
            this.ApiServiceHelper.delete('http://api.local.dbec3.com/connection/' + connectionId, callback);
        }
    }
}

export default new ApiService;