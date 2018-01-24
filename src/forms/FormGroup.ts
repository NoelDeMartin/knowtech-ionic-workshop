import { FormGroup as AngularFromGroup }    from '@angular/forms';

import Translator   from '@app/utils/Translator';

export class FormGroup extends AngularFromGroup {

    public submitted: boolean = false;

    public submit(): boolean {

        this.submitted = true;

        for (let field in this.controls) {
            this.controls[field].updateValueAndValidity();
        }

        return this.valid;
    }

    public allErrors(): { [field: string]: { [error: string]: string } } {

        let errors: { [field: string]: { [error: string]: string } } = {};

        for (let field in this.controls) {
            if (!this.controls[field].valid) {
                errors[field] = this.controls[field].errors;
            }
        }

        return errors;
    }

    public getErrorMessage(): string {

        let errors = this.allErrors();

        for (let field in errors) {
            for (let error in errors[field]) {
                if (errors[field][error]) {
                    if (Translator.has('fields.' + field)) {
                        field = Translator.trans('fields.' + field);
                    }
                    return Translator.trans('validation.' + error, { field });
                }
            }
        }

        return null;
    }

}