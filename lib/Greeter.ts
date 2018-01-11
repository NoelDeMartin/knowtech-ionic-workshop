class Greeter {

    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public sayHello(): void {
        alert('Hello ' + this.name + '!');
    }

}

export default Greeter;