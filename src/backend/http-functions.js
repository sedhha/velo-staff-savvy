// eslint-disable-next-line @wix/cli/no-wix-extraneous-dependencies
import { ok } from "wix-http-functions";

export function get_ping() {
    let options = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'pong'
        }
    }
    return ok(options)
}