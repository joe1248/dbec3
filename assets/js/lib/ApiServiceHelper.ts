import axios from 'axios';

class ApiServiceHelper {
    service: any;

    constructor() {
        // this would NOT override, but allso run AFTER all the then/catch in all the methods below
        //  service.interceptors.response.use(this.handleSuccess, this.handleError);

        this.service = axios.create({
            //headers: {csrf: 'token'}
        });
    }

    get(path: string, callback: Function) {
        return this.service.get(path)
            .then(
                (response: any) => callback('', response.data)
            ).catch(
                (error: any) => callback(error, {})
            );
    }

    post(path: string, payload: object, callback: Function) {
        return this.service.request({
            method: 'POST',
            url: path,
            responseType: 'json',
            data: payload
        })
            .then((response: any) => {
                if (response.data.success === true) {
                    callback('', response.data.entity);
                } else {
                    callback('Error, creation has failed.', {});
                }
            })
            .catch((error: any) => {
                callback(error.response.data.message, {})
            })
    }

    patch(path: string, payload: object, callback: Function) {
        return this.service.request({
                method: 'PATCH',
                url: path,
                responseType: 'json',
                data: payload
            })
            .then((response: any) => {
                if (response.data.success === true) {
                    callback('', response.data.entity);
                } else {
                    callback('Error, update has failed.', {});
                }
            })
            .catch((error: any) => {
                callback(error.response.data.message, {})
            })
    }
//this: ApiServiceHelper,
    erase(path: string, callback: Function): void {
        return this.service.delete(path)
        .then(
            (response: any) => callback('', response.data)
        ).catch(
            (error: any) => callback(error, {})
        );
    }

}

export default new ApiServiceHelper;