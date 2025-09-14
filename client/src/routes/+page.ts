interface PageData {
    boards: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
    error?: string;
}

/**
 * The `load` function runs on the server and in the browser.
 * SvelteKit uses it to fetch data for a page before it's rendered.
 * This is perfect for getting our board data from the API.
 */
export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
    try {
        // We call our backend API endpoint.
        // SvelteKit's `fetch` is smart; it can make this call directly on the server.
        const response = await fetch('http://localhost:3000/api/boards');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const boards = await response.json();

        // The data returned here is passed as props to the +page.svelte component.
        return { boards } satisfies PageData;
    } catch (error) {
        console.error("Failed to fetch boards:", error);
        // If the fetch fails, we return an empty array and an error message
        // so the page doesn't crash.
        return { 
            boards: [], 
            error: "Could not load boards. Is the server running?" 
        } satisfies PageData;
    }
};
