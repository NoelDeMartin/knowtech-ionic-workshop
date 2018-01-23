import { Injectable }   from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
}   from '@angular/common/http';

import {
    User,
    UserJson,
} from '../models/User';

import {
    Room,
    RoomJson,
} from '../models/Room';

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

    public register(username: string, email: string, password: string): Promise<User> {
        return this
            .request(Config.backend_url + '/register', { username, email, password })
            .then((json: UserJson) => {
                return new User(json);
            });
    }

    public findUsersByUsername(usernames: string[]): Promise<User[]> {
        return this
            .request(Config.backend_url + '/find-users', { usernames })
            .then((jsons: UserJson[]) => {
                return jsons.map((json: UserJson) => {
                    return new User(json);
                });
            });
    }

    public createRoom(user: User, topic: string, members: string[]): Promise<Room> {
        return this
            .request(Config.backend_url + '/room', {
                creator: user.id,
                topic,
                members
            })
            .then((json: RoomJson) => {
                return new Room(json);
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