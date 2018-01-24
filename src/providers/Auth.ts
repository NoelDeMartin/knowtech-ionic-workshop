import { Injectable } from '@angular/core';

import { User } from '@app/models/User';

import { Backend } from './Backend';
import { Storage } from './Storage';

const STORAGE_KEY = "Auth";

@Injectable()
export class Auth {

    private user: User;

    constructor(private storage: Storage, private backend: Backend) { }

    public init(): Promise<void> {
        return new Promise((resolve) => {

            if (this.storage.has(STORAGE_KEY)) {
                this.user = this.storage.get(STORAGE_KEY);
            }

            resolve();
        });
    }

    public isLoggedIn(): boolean {
        return !!this.user;
    }

    public getUser(): User {
        return this.user;
    }

    public login(email: string, password: string): Promise<void> {
        return this.backend
            .login(email, password)
            .then((user: User) => {
                this.loginUser(user);
            });
    }

    public register(username: string, email: string, password: string): Promise<void> {
        return this.backend
            .register(username, email, password)
            .then((user: User) => {
                this.loginUser(user);
            });
    }

    private loginUser(user: User): void {
        this.user = user;
        this.storage.set(STORAGE_KEY, user);
    }

}