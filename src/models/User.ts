export interface UserJson {
    id: string;
    username: string;
}

export class User {

    public readonly id: string;
    public readonly username: string;

    constructor(json: UserJson) {
        this.id = json.id;
        this.username = json.username;
    }

}