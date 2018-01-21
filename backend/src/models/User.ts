import * as bcrypt from 'bcrypt';

let usersCount = 0;
function generateId(): string {
    return (++usersCount).toString();
}

export default class User {

    private id: string;
    private name: string;
    private email: string;
    private passwordHash: string;

    constructor(name: string, email: string, password: string) {
        this.id = generateId();
        this.name = name;
        this.email = email;
        this.passwordHash = bcrypt.hashSync(password, 10);
    }

    public match(email: string, password: string): boolean {
        return this.sameEmail(email) && bcrypt.compareSync(password, this.passwordHash);
    }

    public sameEmail(email: string): boolean {
        return this.email == email;
    }

    public toJson(): Object {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }

}