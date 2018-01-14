import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app.component';
import { TodoList } from '../components/todo-list/TodoList';
import { TodoItem } from '../components/todo-item/TodoItem';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        TodoList,
        TodoItem,
        App
    ],
    bootstrap: [App]
})
export class AppModule { }
