import axios from 'axios';

class ApiServiceHelper {

    constructor() {
        let service = axios.create({
            //headers: {csrf: 'token'}
        });
        service.interceptors.response.use(this.handleSuccess, this.handleError);
        this.service = service;
    }

    handleSuccess(response) {
        return response;
    }

    handleError(error) {
        /*switch (error.response.status) {
            case 401:
                document.location = '/';
                break;
            case 404:
                document.location = '/404';
                break;
            default:
                document.location = '/500';
                break;
        }*/
        console.log(' API CALL ERROR detected from the FE:');
        console.log(error);
        //const errorMsg = error.response.status === 400 ? error.response.message : 'Service broken...';
        return error;
    }

    /*redirectTo(document, path) {
        document.location = path
    }*/

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
            .then((response) => callback('', response.data))
            .catch((error) => callback(error.response.data.message, {}))
    }

    post(path, payload, callback) {
        return this.service.request({
                method: 'POST',
                url: path,
                responseType: 'json',
                data: payload
            })
            .then((response) => callback(response.status, response.data))
            .catch((error) => callback(error.response.data.message, {}))
    }
}

export default new ApiServiceHelper;