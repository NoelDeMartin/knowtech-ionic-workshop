import { Injectable }   from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
}   from '@angular/common/http';

import {
    User,
    UserJson,
} from '@app/models/User';

import {
    Room,
    RoomJson,
} from '@app/models/Room';

import {
    Message,
    MessageJson,
} from '@app/models/Message';

import { Contact } from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import Config from '@app/config.json';

import {
    Backend,
    BackendObservation
}  from './Backend';

@Injectable()
export class ExpressBackend extends Backend {

    constructor(private http: HttpClient) {
        super();
    }

    protected initialize(): Promise<void> {
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

    public loginWithFacebook(id: string, username: string): Promise<User> {
        return this
            .request(Config.backend_url + '/facebook-login', { id, username })
            .then((json: UserJson) => {
                return new User(json);
            });
    }

    public logout(): Promise<void> {
        // nothing to do here
        return Promise.resolve();
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
                topic,
                creator_id: user.id,
                member_ids: members
            })
            .then((json: RoomJson) => {
                return new Room(json);
            });
    }

    public addRoomMember(roomId: string, username: string): Promise<string> {
        return this
            .request(Config.backend_url + '/add-member', {
                room_id: roomId,
                username
            });
    }

    public listenRooms(userId: string | null): BackendObservation<Room[]> {

        let subject: BehaviorSubject<Room[]> = new BehaviorSubject([]);

        if (userId == null) {
            return {
                observable: subject.asObservable(),
                unsubscribe: () => { }
            };
        }

        let request = () => {
            this.request(Config.backend_url + '/rooms', { user_id: userId })
                .then((jsons: RoomJson[]) => {
                    subject.next(jsons.map((json: RoomJson) => {
                        return new Room(json);
                    }));
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        request();

        let interval = setInterval(request, 5000);

        return {
            observable: subject.asObservable(),
            unsubscribe() { clearInterval(interval); }
        };
    }

    public listenRoomMessages(roomId: string): BackendObservation<Message[]> {

        let subject: BehaviorSubject<Message[]> = new BehaviorSubject([]);

        let request = () => {
            this.request(Config.backend_url + '/messages', { room_id: roomId })
                .then((jsons: MessageJson[]) => {
                    subject.next(jsons.map((json: MessageJson) => {
                        return new Message(json);
                    }));
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        request();

        let interval = setInterval(request, 5000);

        return {
            observable: subject.asObservable(),
            unsubscribe() { clearInterval(interval); }
        };
    }

    public sendMessage(roomId: string, authorId: string, text: string): Promise<void> {
        return this
            .request(Config.backend_url + '/message', {
                room_id: roomId,
                author_id: authorId,
                text: text
            });
    }

    public sendContacts(roomId: string, authorId: string, contacts: Contact[]): Promise<void> {
        return this
            .request(Config.backend_url + '/contacts', {
                room_id: roomId,
                author_id: authorId,
                contacts: contacts
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