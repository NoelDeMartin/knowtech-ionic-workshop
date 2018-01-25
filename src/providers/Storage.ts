import { Injectable } from '@angular/core';

@Injectable()
export class Storage {

    public has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public get(key: string, defaultValue: any = null): any {
        return this.has(key)? JSON.parse(localStorage.getItem(key)) : defaultValue;
    }

    public remove(key: string): void {
        if (this.has(key)) {
            localStorage.removeItem(key);
        }
    }

}