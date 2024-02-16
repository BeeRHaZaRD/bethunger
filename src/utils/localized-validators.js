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
        `Минимум ${min} ${wordCase(min, ['символ', 'символа', 'символов'])}`,
        validators.minLength(min)
    );

export const maxLength = (max) =>
    helpers.withMessage(
        `Максимум ${max} ${wordCase(max, ['символ', 'символа', 'символов'])}`,
        validators.maxLength(max)
    );

export const minValue = (value, unit = '') =>
    helpers.withMessage(`Минимум ${value} ${unit}`, validators.minValue(value));

export const maxValue = (value, unit = '') =>
    helpers.withMessage(`Максимум ${value} ${unit}`, validators.maxValue(value));

export const alphaNum = () =>
    helpers.withMessage('Только латинские буквы и цифры', validators.alphaNum);

export const sameAs = (value) =>
    helpers.withMessage('Пароли должны совпадать', validators.sameAs(value));