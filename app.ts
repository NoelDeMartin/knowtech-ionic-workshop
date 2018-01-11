import Greeter from './lib/Greeter.js';
import '../node_modules/jquery/dist/jquery.js';

window.onload = function () {
    $('#action').click(function () {
        let greeter = new Greeter('Typescript');
        greeter.sayHello();
    });
};