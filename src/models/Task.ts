export default class Task {

    public name: string;
    public completed: boolean;

    constructor(name: string, completed: boolean = false) {
        this.name = name;
        this.completed = completed;
    }

}