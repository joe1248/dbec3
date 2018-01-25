import axios from 'axios';

class ApiServiceHelper {

    constructor() {
        // this would NOT override, but allso run AFTER all the then/catch in all the methods below
        //  service.interceptors.response.use(this.handleSuccess, this.handleError);
        
        this.service = axios.create({
            //headers: {csrf: 'token'}
        });
    }

    get(path, callback) {
        return this.service.get(path)
            .then(
                (response) => callback('', response.data)
            ).catch(
                (error) => callback(error, {})
            );
    }

    delete(path, callback) {
        return this.service.delete(path)
            .then(
                (response) => callback('', response.data)
            ).catch(
                (error) => callback(error, {})
            );
    }

    patch(path, payload, callback) {
        return this.service.request({
                method: 'PATCH',
                url: path,
                responseType: 'json',
                data: payload
            })
            .then((response) => {
                if (response.data.success === true) {
                    callback('', response.data.entity);
                } else {
                    callback('Error, update has failed.', {});
                }
            })
            .catch((error) => {
                callback(error.response.data.message, {})
            })
    }

    post(path, payload, callback) {
        return this.service.request({
                method: 'POST',
                url: path,
                responseType: 'json',
                data: payload
            })
            .then((response) => {
                if (response.data.success === true) {
                    callback('', response.data.entity);
                } else {
                    callback('Error, creation has failed.', {});
                }
            })
            .catch((error) => {
                callback(error.response.data.message, {})
            })
    }
}

export default new ApiServiceHelper;