import { Observable } from 'rxjs/Observable';

import { User }     from '@app/models/User';
import { Room }     from '@app/models/Room';
import { Message }  from '@app/models/Message';

import { Contact } from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import AsyncProvider from './AsyncProvider';

export interface BackendObservation<T> {
    observable: Observable<T>;
    unsubscribe: Function;
}

export abstract class Backend extends AsyncProvider {

    abstract login(email: string, password: string): Promise<User>;

    abstract register(username: string, email: string, password: string): Promise<User>;

    abstract loginWithFacebook(id: string, username: string): Promise<User>;

    abstract logout(): Promise<void>;

    abstract findUsersByUsername(usernames: string[]): Promise<User[]>;

    abstract createRoom(user: User, topic: string, members: string[]): Promise<Room>;

    abstract addRoomMember(roomId: string, username: string): Promise<string>;

    // A real world use-case would use pagination and provide a login token,
    // not only the user id.
    abstract listenRooms(userId: string | null): BackendObservation<Room[]>;

    abstract listenRoomMessages(roomId: string): BackendObservation<Message[]>;

    abstract sendMessage(roomId: string, authorId: string, text: string): Promise<void>;

    abstract sendContacts(roomId: string, authorId: string, contacts: Contact[]): Promise<void>;

}