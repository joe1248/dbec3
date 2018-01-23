import ApiServiceHelper from './js/lib/ApiServiceHelper';

class ApiService {

    constructor() {
        this.ApiServiceHelper = ApiServiceHelper;
    }

    getConnection(id, callback) {
        this.ApiServiceHelper.get(`http://api.local.dbec3.com/connection/` + id, callback);
    }
}

export default new ApiService;