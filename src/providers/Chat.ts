import { Injectable } from '@angular/core';

import { User }     from '@app/models/User';
import { Room }     from '@app/models/Room';
import { Message }  from '@app/models/Message';

import { Contact } from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import { Auth }     from './Auth';
import { Backend, BackendObservation } from './Backend';
import { Observable } from 'rxjs/Observable';

import AsyncProvider from './AsyncProvider';

@Injectable()
export class Chat extends AsyncProvider {

    private roomsObservation: BackendObservation<Room[]> = null;

    private messageObservations: {
        [roomId: string]: BackendObservation<Message[]>
    } = {};

    constructor(private backend: Backend, private auth: Auth) {
        super();
    }

    protected initialize(): Promise<void> {
        return AsyncProvider
            .sync(this.backend, this.auth)
            .then(() => {
                let user = this.auth.getUser();
                this.roomsObservation = this.backend.listenRooms(user? user.id : null);
                this.auth.listenLoginStatus().observable.subscribe(() => {
                    this.roomsObservation.unsubscribe();
                    let user = this.auth.getUser();
                    this.roomsObservation = this.backend.listenRooms(user ? user.id : null);
                });
            });
    }

    get rooms(): Observable<Room[]> {
        return this.roomsObservation ? this.roomsObservation.observable : null;
    }

    public createRoom(topic: string, memberUsernames: string[]): Promise<Room> {

        if (!this.auth.isLoggedIn()) return Promise.reject(new Error('User not authenticated'));

        return this
            .prepareRoomMembers(memberUsernames)
            .then((members: string[]) => {
                return this.backend.createRoom(this.auth.getUser(), topic, members);
            });
    }

    public listenRoomMessages(roomId: string): Observable<Message[]> {

        if (roomId in this.messageObservations) {
            this.messageObservations[roomId].unsubscribe();
        }

        this.messageObservations[roomId] = this.backend.listenRoomMessages(roomId);

        return this.messageObservations[roomId].observable;
    }

    public addRoomMember(roomId: string, username: string): Promise<string> {
        return this.backend.addRoomMember(roomId, username);
    }

    public sendMessage(roomId: string, message: string): Promise<void> {
        return this.backend.sendMessage(roomId, this.auth.getUser().id, message);
    }

    public sendContacts(roomId: string, contacts: Contact[]): Promise<void> {
        return this.backend.sendContacts(roomId, this.auth.getUser().id, contacts);
    }

    private prepareRoomMembers(usernames: string[]): Promise<string[]> {

        // Remove duplicates
        let uniqueUsernames = [];
        for (let username of usernames) {
            if (uniqueUsernames.indexOf(username) === -1) {
                uniqueUsernames.push(username);
            }
        }
        usernames = uniqueUsernames;

        return this
            .backend.findUsersByUsername(usernames)
            .then((members: User[]) => {

                let memberIds: string[] = members.map((member: User) => {
                    return member.id;
                });

                if (memberIds.indexOf(this.auth.getUser().id) === -1) {
                    memberIds.push(this.auth.getUser().id);
                }

                return memberIds;
            });
    }

}