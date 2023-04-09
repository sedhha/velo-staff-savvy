// eslint-disable-next-line @wix/cli/no-wix-extraneous-dependencies
import { ok } from "wix-http-functions";
import { signUpEmployees } from "./authFunctions";


// To test if server is up and running or not

export function get_ping() {
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'pong'
        }
    }
    return ok(options)
}

// Auth Functions
export async function post_signUpEmployees(/** @type {{ body: { text: () => any; }; }} */ request) {
    return signUpEmployees(request)
}