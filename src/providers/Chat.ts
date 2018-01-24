import { Injectable } from '@angular/core';

import { User } from '@app/models/User';
import { Room } from '@app/models/Room';

import { Auth }     from './Auth';
import { Backend }  from './Backend';

@Injectable()
export class Chat {

    constructor(private backend: Backend, private auth: Auth) { }

    public createRoom(topic: string, memberUsernames: string[]): Promise<Room> {

        if (!this.auth.isLoggedIn()) return Promise.reject(new Error('User not authenticated'));

        return this
            .prepareRoomMembers(memberUsernames)
            .then((members: string[]) => {
                return this.backend.createRoom(this.auth.getUser(), topic, members);
            });
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