// eslint-disable-next-line @wix/cli/no-wix-extraneous-dependencies
import { ok, badRequest } from "wix-http-functions";
import * as z from 'zod';

const loginFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    emailAddress: z.string(),
    orgCode: z.string(),
    employeeCode: z.string(),
    securePassword: z.string()
})

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


export function post_register_employee(request) {
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'pong'
        }
    }
    const body = JSON.parse(request.body);
    try {
        const result = loginFormSchema.parse(body);
        options.body = {
            message: 'Success',
            result
        }
        return ok(options);
    }
    catch (e) {
        options.body = { message: e.message };
        return badRequest(options);
    }
}