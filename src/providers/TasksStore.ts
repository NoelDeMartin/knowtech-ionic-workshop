import { Injectable } from '@angular/core';

import Task from '../models/Task';

import Storage from './Storage';

const STORAGE_KEY: string = 'tasks';

@Injectable()
export default class TasksStore {

    private items: Task[] = [];

    constructor(private storage: Storage) { }

    get tasks(): Task[] {
        return this.items;
    }

    public init(): void {
        this.items = this.storage.get(STORAGE_KEY, []);
    }

    public add(task: Task): void {
        this.items.push(task);
        this.storage.set(STORAGE_KEY, this.items);
    }

    public update(index: number, task: Task): void {
        this.items.splice(index, 1, task);
        this.storage.set(STORAGE_KEY, this.items);
    }

}