import ApiServiceHelper from './js/lib/ApiServiceHelper';

class ApiService {
    ApiServiceHelper: any;

    constructor() {
        this.ApiServiceHelper = ApiServiceHelper;
    }

    getUserDatabaseConnections(callback: Function) {
        this.ApiServiceHelper.get(`/connections`, callback);
    }

    getConnection(id: Number, callback: Function) {
        this.ApiServiceHelper.get(`/connection/` + id, callback);
    }

    saveConnection(connection: UserDbConnection, callback: Function) {
        const connectionId = connection && connection.db_id || null;
        if (connectionId) {
            this.ApiServiceHelper.patch('/connection/edit', connection, callback);
        } else {
            this.ApiServiceHelper.post('/connection/new', connection, callback);
        }
    }

    deleteConnection(connectionId: Number, callback: Function) {
        if (connectionId) {
            this.ApiServiceHelper.erase('/connection/' + connectionId, callback);
        }
    }
}

export default new ApiService;