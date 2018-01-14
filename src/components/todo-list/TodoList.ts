import { Component } from '@angular/core';

import Task from '../../models/Task';

@Component({
    selector: 'todo-list',
    templateUrl: './todo-list.html',
    styleUrls: ['./todo-list.scss']
})
export class TodoList {

    newTask: string = '';
    tasks: Task[] = [
        new Task('Foo'),
        new Task('Bar', true),
    ];

    get remainingTasks(): number {
        return this.tasks.filter((task: Task) => {
            return !task.completed;
        }).length;
    }

    public addTask(): void {
        if (this.newTask.length > 0) {
            this.tasks.push(new Task(this.newTask));
            this.newTask = '';
        }
    }

}