import {
    Input,
    Component,
 } from '@angular/core';

import Task from '../../models/Task';

@Component({
    selector: 'todo-item',
    templateUrl: './todo-item.html',
    styleUrls: ['./todo-item.scss']
})
export class TodoItem {

    @Input() task: Task;

    public complete(): void {
        this.task.completed = true;
    }

}