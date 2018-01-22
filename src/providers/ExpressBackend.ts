import { Injectable }   from '@angular/core';
import {
    HttpClient,
    HttpParams,
    HttpErrorResponse,
}   from '@angular/common/http';

import { Observable }   from 'rxjs/Observable';

import {
    User,
    UserJson,
} from '../models/User';

import { Backend }  from './Backend';

import Config from '../config.json';

@Injectable()
export class ExpressBackend extends Backend {

    constructor(private http: HttpClient) {
        super();
    }

    public init(): Promise<void> {
        return Promise.resolve();
    }

    public login(email: string, password: string): Promise<User> {
        return this
            .request(Config.backend_url + '/login', { email, password })
            .then((json: UserJson) => {
                return new User(json);
            });
    }

    private request(url: string, params: any = {}, method: 'POST' | 'GET' = 'POST'): Promise<any> {

        let options = {};

        switch (method) {
            case 'POST':
                options['body'] = params;
                break;
            case 'GET':
                options['params'] = params;
                break;
        }

        return this.http
            .request(method, url, options)
            .toPromise()
            .catch((response?: any) => {
                if (response instanceof HttpErrorResponse && response.error.message) {
                    throw new Error(response.error.message);
                } else {
                    throw response;
                }
            });
    }

}