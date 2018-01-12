import * as $ from 'jquery';
import Greeter from './lib/Greeter';

window.onload = function () {
    $('#action').click(function () {
        let greeter = new Greeter('Typescript with webpack');
        greeter.sayHello();
    });
};