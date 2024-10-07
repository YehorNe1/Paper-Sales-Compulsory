// src/apiClient.ts

import { ApiClient } from '../Api.ts'; // Adjust the path as necessary

export const apiClient = new ApiClient({
    baseURL: 'https://localhost:7215/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

