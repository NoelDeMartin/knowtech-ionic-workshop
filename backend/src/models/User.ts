import * as bcrypt from 'bcrypt';

let usersCount = 0;
function generateId(): string {
    return (++usersCount).toString();
}

export default class User {

    private id: string;
    private username: string;
    private email: string;
    private passwordHash: string;

    constructor(username: string, email: string, password: string) {
        this.id = generateId();
        this.username = username;
        this.email = email;
        this.passwordHash = bcrypt.hashSync(password, 10);
    }

    public match(email: string, password: string): boolean {
        return this.sameEmail(email) && bcrypt.compareSync(password, this.passwordHash);
    }

    public sameEmail(email: string): boolean {
        return this.email == email;
    }

    public getUsername(): string {
        return this.username;
    }

    public toJson(): Object {
        return {
            id: this.id,
            username: this.username,
            email: this.email
        };
    }

}