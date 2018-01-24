import { User } from '@app/models/User';
import { Room } from '@app/models/Room';

export abstract class Backend {

    abstract init(): Promise<void>;

    abstract login(email: string, password: string): Promise<User>;

    abstract register(username: string, email: string, password: string): Promise<User>;

    abstract findUsersByUsername(usernames: string[]): Promise<User[]>;

    abstract createRoom(user: User, topic: string, members: string[]): Promise<Room>;

}