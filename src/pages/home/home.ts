import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import TasksStore from '../../providers/TasksStore';

import Task from '../../models/Task';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        private alertCtrl: AlertController,
        private tasksStore: TasksStore
    ) { }

    get tasks(): Task[] {
        return this.tasksStore.tasks;
    }

    get remainingTasks(): number {
        return this.tasks.filter((task: Task) => {
            return !task.completed;
        }).length;
    }

    public taskUpdated(task: Task): void {
        this.tasksStore.update(this.tasks.indexOf(task), task);
    }

    public addTask(): void {
        this.alertCtrl.create({
            title: 'New Task',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Create',
                    handler: data => {
                        this.tasksStore.add(new Task(data.name));
                    }
                }
            ]
        }).present();
    }

}
