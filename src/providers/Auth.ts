import { Injectable } from '@angular/core';

import {
    Facebook,
    FacebookLoginResponse
} from '@ionic-native/facebook';

import { User } from '@app/models/User';

import { Backend } from './Backend';
import { Storage } from './Storage';

import AsyncProvider from './AsyncProvider';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

const STORAGE_KEY = "Auth";

export interface Observation<T> {
    observable: Observable<T>;
    unsubscribe: Function;
}

@Injectable()
export class Auth extends AsyncProvider {

    private loginStatus: BehaviorSubject<void> = new BehaviorSubject(null);

    private user: User;

    constructor(
        private storage: Storage,
        private backend: Backend,
        private facebook: Facebook
    ) {
        super();
    }

    protected initialize(): Promise<void> {
        return AsyncProvider
            .sync(this.backend)
            .then(() => {
                if (this.storage.has(STORAGE_KEY)) {
                    this.user = this.storage.get(STORAGE_KEY);
                }
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

    public loginWithFacebook(): Promise<void> {
        return this.facebook.login(['public_profile', 'email'])
            .then((response: FacebookLoginResponse) => {
                if (response.status == 'connected') {
                    return this.facebook.api('me', ['public_profile'])
                }
            })
            .then((response?: any) => {
                if (response) {
                    return this.backend.loginWithFacebook(
                        response.id,
                        response.name
                    );
                }
            })
            .then((user?: User) => {
                if (user) this.loginUser(user);
            });
    }

    public logout(): Promise<void> {
        return this.backend
            .logout()
            .then(() => {
                this.user = null;
                this.storage.remove(STORAGE_KEY);
                this.loginStatus.next(null);
            });
    }

    public listenLoginStatus(): Observation<void> {
        return {
            observable: this.loginStatus.asObservable(),
            unsubscribe: () => { }
        };
    }

    private loginUser(user: User): void {
        this.user = user;
        this.storage.set(STORAGE_KEY, user);
        this.loginStatus.next(null);
    }

}