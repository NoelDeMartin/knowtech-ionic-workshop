import { Injectable } from '@angular/core';

@Injectable()
export default class Storage {

    public set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public get(key: string, defaultValue: any = null): any {
        if (this.has(key)) {
            return JSON.parse(localStorage.getItem(key));
        } else {
            return defaultValue;
        }
    }

    public remove(key: string): void {
        localStorage.removeItem(key);
    }

}