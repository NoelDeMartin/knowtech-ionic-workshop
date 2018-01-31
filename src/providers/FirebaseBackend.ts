import { Injectable } from '@angular/core';

import Firebase, {
    User as FirebaseUser,
    firestore as Firestore,
} from 'firebase';
import 'firebase/firestore';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

import Config from '@app/config.json';

import { Contact } from '@app/plugins/knowtech-chat-contacts-manager/ionic-native';

import {
    Backend,
    BackendObservation
} from './Backend';

@Injectable()
export class FirebaseBackend extends Backend {

    private modelsFactory: ModelsFactory = new ModelsFactory();

    protected initialize(): Promise<void> {
        return new Promise((resolve: (result: any) => any, reject) => {
            Firebase.initializeApp(Config.firebase);
            Firebase.auth().onAuthStateChanged(resolve);
        });
    }

    public login(email: string, password: string): Promise<User> {
        return Firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((user: FirebaseUser) => {
                return Firebase
                    .firestore()
                    .collection('users')
                    .where('auth_id', '==', user.uid)
                    .get();
            })
            .then((snapshot: Firestore.QuerySnapshot) => {
                return snapshot.docs.length > 0
                    ? this.modelsFactory.makeUser(snapshot.docs[0])
                    : null;
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }

    public register(username: string, email: string, password: string): Promise<User> {

        let authUser: FirebaseUser;

        return Firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((user: FirebaseUser) => {
                authUser = user;
                return Firebase
                    .firestore()
                    .collection('users')
                    .add({
                        username: username,
                        auth_id: authUser.uid
                    });
            })
            .then((reference: Firestore.DocumentReference) => {
                return reference.get();
            })
            .then((snapshot: Firestore.DocumentSnapshot) => {
                return this.modelsFactory.makeUser(snapshot);
            })
            .catch((error) => {
                // If anything went wrong, remove any data that has been created with this operation.
                return (
                    authUser ? authUser.delete() : Promise.resolve()
                ).then(() => {
                    throw new Error(error.message);
                });
            });
    }

    public loginWithFacebook(id: string, username: string): Promise<User> {
        return;
    }

    public logout(): Promise<void> {
        return Firebase
            .auth()
            .signOut()
            .catch((error) => {
                throw new Error(error.message);
            });
    }

    public listenLoginStatus(): BackendObservation<void> {

        let loginStatus: BehaviorSubject<void> = new BehaviorSubject(null);

        let unsubscribe = Firebase.auth().onAuthStateChanged(() => {
            loginStatus.next(null);
        });

        return {
            observable: loginStatus.asObservable(),
            unsubscribe: unsubscribe
        };
    }

    public findUsersByUsername(usernames: string[]): Promise<User[]> {
        return this.findUsers('username', usernames);
    }

    public createRoom(user: User, topic: string, members: string[]): Promise<Room> {

        let firebaseMembers = {};

        for (let member of members) {
            firebaseMembers[member] = true;
        }

        return Firebase
            .firestore()
            .collection('rooms')
            .add({
                topic: topic,
                owner: user.id,
                members: firebaseMembers,
                created_at: new Date(),
                last_active_at: new Date()
            })
            .then((reference: Firestore.DocumentReference) => {
                return reference.get();
            })
            .then((snapshot: Firestore.DocumentSnapshot) => {
                return this.modelsFactory.makeRoom(snapshot);
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }

    public addRoomMember(roomId: string, username: string): Promise<string> {
        return this
            .findUsers('username', [username])
            .then((users: User[]) => {
                let roomRef = Firebase.firestore().collection('rooms').doc(roomId);
                return roomRef
                    .get()
                    .then((snapshot: Firestore.DocumentSnapshot) => {
                        let room = this.modelsFactory.makeRoom(snapshot);
                        let members = {};
                        for (let memberId of room.memberIds) {
                            members[memberId] = true;
                        }
                        for (let user of users) {
                            members[user.id] = true;
                        }
                        return roomRef
                            .update({
                                members: members
                            })
                            .then(() => {
                                if (users.length > 0) {
                                    return users[0].id;
                                }
                            });
                    });
            });
    }

    public listenRooms(userId: string | null): BackendObservation<Room[]> {

        let roomsSubject = new BehaviorSubject<Room[]>([]);
        let rooms: Room[] = [];

        if (userId == null) {
            return {
                observable: roomsSubject.asObservable(),
                unsubscribe: () => {}
            };
        }

        let unsubscribe =
            Firebase
                .firestore()
                .collection('rooms')
                .where('members.' + userId, '==', true)
                .onSnapshot((snapshot: Firestore.QuerySnapshot) => {

                    snapshot.docChanges.forEach((change: Firestore.DocumentChange) => {

                        let room = this.modelsFactory.makeRoom(change.doc);

                        if (change.type == 'added') {
                            rooms.push(room);
                        } else {
                            let index = rooms.findIndex((existingRoom: Room) => {
                                return existingRoom.id == room.id;
                            });
                            if (index !== -1) {
                                if (change.type == 'removed') {
                                    rooms.splice(index, 1);
                                } else {
                                    rooms.splice(index, 1, room);
                                }
                            }
                        }

                    });

                    roomsSubject.next(rooms);

                });

        return {
            observable: roomsSubject.asObservable(),
            unsubscribe: unsubscribe
        };
    }

    public listenRoomMessages(roomId: string): BackendObservation<Message[]> {

        let messagesSubject = new BehaviorSubject<Message[]>([]);
        let messages: Message[] = [];

        let unsubscribe =
            Firebase
                .firestore()
                .collection('rooms')
                .doc(roomId)
                .collection('messages')
                .onSnapshot((snapshot: Firestore.QuerySnapshot) => {

                    snapshot.docChanges.forEach((change: Firestore.DocumentChange) => {

                        // Members are loaded before creating messages because messages have an author field
                        // which requires the user to be loaded as a model User class.

                        this.loadUsers([change.doc.data().author])
                            .then(() => {

                                let message = this.modelsFactory.makeMessage(change.doc);

                                if (change.type == 'added') {
                                    messages.push(message);
                                } else {
                                    let index = messages.findIndex((existingMessage: Message) => {
                                        return existingMessage.id == message.id;
                                    });
                                    if (index !== -1) {
                                        if (change.type == 'removed') {
                                            messages.splice(index, 1);
                                        } else {
                                            messages.splice(index, 1, message);
                                        }
                                    }
                                }

                                messagesSubject.next(messages);
                            });

                    });

                    messagesSubject.next(messages);

                });

        return {
            observable: messagesSubject.asObservable(),
            unsubscribe: unsubscribe
        };
    }

    public sendMessage(roomId: string, authorId: string, text: string): Promise<void> {
        return Firebase
            .firestore()
            .collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
                author: authorId,
                text: text,
                date: new Date()
            })
            .then(() => { });
    }

    public sendContacts(roomId: string, authorId: string, contacts: Contact[]): Promise<void> {
        return new Promise((resolve) => {

            let count = contacts.length;

            for (let contact of contacts) {
                Firebase
                    .firestore()
                    .collection('rooms')
                    .doc(roomId)
                    .collection('messages')
                    .add({
                        author: authorId,
                        text: contact,
                        date: new Date()
                    })
                    .then(() => {
                        if (--count == 0) resolve();
                    })
                    .catch(() => {
                        if (--count == 0) resolve();
                    });
            }

        });
    }

    private findUsers(field: string, values: any[]): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {

            let count = values.length;
            let users: User[] = [];

            for (let value of values) {

                // This would seem to have bad performance, but since firebase pipelines requests
                // this is actually the way to do it
                // +info: https://stackoverflow.com/questions/35931526/speed-up-fetching-posts-for-my-social-network-app-by-using-query-instead-of-obse/35932786#35932786

                let queryPromise: Promise<any>;

                if (field == 'id') {
                    queryPromise = Firebase
                        .firestore()
                        .collection('users')
                        .doc(value)
                        .get()
                        .then((snapshot: Firestore.DocumentSnapshot) => {

                            this.modelsFactory.makeUser(snapshot);

                            if (--count == 0) {
                                resolve(users);
                            }

                        });
                } else {
                    queryPromise = Firebase
                        .firestore()
                        .collection('users')
                        .where(field, '==', value)
                        .get()
                        .then((snapshot: Firestore.QuerySnapshot) => {

                            users = users.concat(
                                snapshot.docs.map((document: Firestore.DocumentSnapshot) => {
                                    return this.modelsFactory.makeUser(document);
                                })
                            );

                            if (--count == 0) {
                                resolve(users);
                            }

                        });
                }

                queryPromise.catch(() => {
                    if (--count == 0) {
                        resolve(users);
                    }
                });

            }

        });
    }

    private loadUsers(userIds: string[]): Promise<void> {

        // This method queries users from Firestore to have them loaded in memory any time a model User class
        // is necessary.
        let unloadedUserIds: string[] = userIds.filter((userId: string) => {
            return !this.modelsFactory.hasLoadedUser(userId);
        });

        if (unloadedUserIds.length == 0) {
            return Promise.resolve();
        } else {
            return this.findUsers('id', unloadedUserIds).then(() => { });
        }

    }

}

/**
 * This class is used to encapsulate the transformation from a Firestore document into this application's model classes. It
 * also stores references to loaded users to be used without the need to query them multiple times. Keep into account that a
 * real application should handle any user updates and invalidate this cache if necessary.
 */
class ModelsFactory {

    private users: {
        [authId: string]: User
    } = {};

    public makeUser(snapshot: Firestore.DocumentSnapshot): User {

        let data = snapshot.data();
        let user = new User({
            id: snapshot.id,
            username: data.username
        });

        this.users[user.id] = user;

        return user;
    }

    public makeRoom(snapshot: Firestore.DocumentSnapshot): Room {
        let data = snapshot.data();
        return new Room({
            id: snapshot.id,
            topic: data.topic,
            member_ids: Object.keys(data.members)
        });
    }

    public getUser(id: string): User {
        return this.users[id];
    }

    public makeMessage(snapshot: Firestore.DocumentSnapshot): Message {

        let data = snapshot.data();

        if (!this.hasLoadedUser(data['author'])) {
            throw new UserNotLoaded(data['author']);
        }

        return new Message({
            id: snapshot.id,
            text: data.text,
            author_id: data.author,
            author_username: this.users[data.author].username,
            date: data.date.getTime()
        });
    }

    public hasLoadedUser(id: string): boolean {
        return id in this.users;
    }

}

class UserNotLoaded extends Error {

    public userAuthId: string;

    constructor(userAuthId: string) {
        super('User not loaded: ' + userAuthId);
        this.userAuthId = userAuthId;
    }

}