import { Component } from '@angular/core';

import Greeter from '../lib/Greeter';

@Component({
    selector: 'example',
    template: `
        <h1>My Website</h1>
        <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate quae voluptas vel doloribus nostrum quam ad culpa sint
            ex, omnis blanditiis beatae voluptatem, libero minima ipsum unde eveniet qui et.
        </p>
        <button (click)="clickButton()">
            Click me!
        </button>
    `,
})
export class Example {

    public clickButton(): void {
        let greeter = new Greeter('Angular');
        greeter.sayHello();
    }

}