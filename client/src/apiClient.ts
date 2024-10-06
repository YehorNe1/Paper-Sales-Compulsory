import {Api} from '../Api.ts';

export const apiClient = new Api({
    baseURL: "http://localhost:5062",
    headers: {
        "Prefer": "return=representation"
    }
});