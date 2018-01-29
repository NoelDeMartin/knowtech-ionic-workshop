import * as bcrypt from 'bcrypt';

let usersCount = 0;
function generateId(): string {
    return (++usersCount).toString();
}

export default class User {

    private isFacebook: boolean = false;

    private id: string;
    private username: string;
    private email: string;
    private passwordHash: string;

    static facebook(id: string, username: string): User {
        let user = new User(username, null, '');
        user.id = id;
        user.passwordHash = null;
        user.isFacebook = true;
        return user;
    }

    constructor(username: string, email: string, password: string) {
        this.id = generateId();
        this.username = username;
        this.email = email;
        this.passwordHash = bcrypt.hashSync(password, 10);
    }

    public match(email: string, password: string): boolean {
        return this.sameEmail(email) && bcrypt.compareSync(password, this.passwordHash);
    }

    public matchFacebook(id: string): boolean {
        return this.isFacebook && this.id == id;
    }

    public sameEmail(email: string): boolean {
        return this.email == email;
    }

    public getId(): string {
        return this.id;
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