import * as validators from "@vuelidate/validators";
import {helpers} from "@vuelidate/validators";
import {wordCase} from "@/utils/util";

export const required = () =>
    helpers.withMessage('Обязательное поле', validators.required);

export const requiredIf = (cond) =>
    helpers.withMessage(
        'Обязательное поле', validators.requiredIf(cond)
    );

export const minLength = (min) =>
    helpers.withMessage(
        `минимум ${min} ${wordCase(min, ['символ', 'символа', 'символов'])}`,
        validators.minLength(min)
    );

export const maxLength = (max) =>
    helpers.withMessage(
        `максимум ${max} ${wordCase(max, ['символ', 'символа', 'символов'])}`,
        validators.maxLength(max)
    );

export const alphaNum = () =>
    helpers.withMessage('Только латинские буквы и цифры', validators.alphaNum);