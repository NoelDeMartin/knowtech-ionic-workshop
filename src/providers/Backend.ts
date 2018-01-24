import { Observable } from 'rxjs/Observable';

import { User }     from '@app/models/User';
import { Room }     from '@app/models/Room';
import { Message }  from '@app/models/Message';

export interface BackendObservation<T> {
    observable: Observable<T>;
    unsubscribe: Function;
}

export abstract class Backend {

    abstract init(): Promise<void>;

    abstract login(email: string, password: string): Promise<User>;

    abstract register(username: string, email: string, password: string): Promise<User>;

    abstract findUsersByUsername(usernames: string[]): Promise<User[]>;

    abstract createRoom(user: User, topic: string, members: string[]): Promise<Room>;

    // A real world use-case would use pagination and provide a login token,
    // not only the user id.
    abstract listenRooms(userId: string): BackendObservation<Room[]>;

    abstract listenRoomMessages(roomId: string): BackendObservation<Message[]>;

    abstract sendMessage(roomId: string, authorId: string, text: string): Promise<void>;

}