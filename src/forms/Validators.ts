import {
    ValidatorFn,
    AbstractControl,
    Validators as AngularValidators
}  from '@angular/forms';

export class Validators extends AngularValidators {

    public static equals(dependency: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any} => {

            if (!isEmptyInputValue(control) && control.parent) {
                if (
                    !isEmptyInputValue(control.parent.controls[dependency]) &&
                    control.parent.controls[dependency].value !== control.value
                ) {
                    return { equals: true };
                }
            }

            return null;
        };
    }

}

function isEmptyInputValue(control: AbstractControl): boolean {
    return control.value == null || typeof control.value == 'string' && control.value.length == 0;
}