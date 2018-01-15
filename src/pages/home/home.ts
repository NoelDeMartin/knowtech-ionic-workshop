import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import Task from '../../models/Task';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    tasks: Task[] = [];

    constructor(private alertCtrl: AlertController) {
        this.tasks.push(new Task('Foo'));
        this.tasks.push(new Task('Bar', true));
    }

    get remainingTasks(): number {
        return this.tasks.filter((task: Task) => {
            return !task.completed;
        }).length;
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
                        this.tasks.push(new Task(data.name));
                    }
                }
            ]
        }).present();
    }

}
