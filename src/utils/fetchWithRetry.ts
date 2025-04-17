/*
    This class is used to manage loading sounds and playing them.

    I think that a few changes worth making are:

    - We need a way to trigger an event when the sounds are loaded, so that the UI can display
      a loading status indicator in the UI.
    - We also need a way to handle sounds that might not load (networking issues, missing file etc)
      - Retry, disable the sound on the instrument, or something else?
    - We also need a way relate this to instruments, as sounds may be specific to an instrument
*/

/*
	Adding this as a way to attempt a retry on a fetch request.
*/
export async function fetchWithRetry(
	url: string,
	retries = 3,
	delay = 10,
): Promise<Response> {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
			return res;
		} catch (e) {
			if (attempt === retries) throw e;
			await new Promise((r) => setTimeout(r, delay));
		}
	}
	throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}
