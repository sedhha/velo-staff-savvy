import { ok, badRequest, serverError } from "wix-http-functions";
import * as z from 'zod';
import { fetch } from "wix-fetch";
import { fetchSecretsFromSecretsManager } from "./getSecrets";

const loginFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    emailAddress: z.string(),
    orgCode: z.string(),
    employeeCode: z.string(),
    securePassword: z.string()
})

export async function signUpEmployees(/** @type {{ body: { text: () => any; }; }} */ request) {
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'pong'
        }
    }
    try {
        const bodyJSON = await request.body.text();
        const body = JSON.parse(bodyJSON);
        const result = loginFormSchema.parse(body);
        options.body = {
            message: 'Success',
            result
        }
        const secrets = await fetchSecretsFromSecretsManager();

        if (!secrets.BACKEND_API_KEY || !secrets.SUPABASE_URL) return serverError({ ...options, body: { ...options.body, message: "Backend Server not able to connect with Database" } })
        const url = `https://${secrets.SUPABASE_URL}/auth/individual-signup`
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-wix-api-key': secrets.BACKEND_API_KEY
            },
            body: bodyJSON
        }).then(res => {
            if (res.status === 201) return res.json().then(data => ok(data)).catch(error => {
                console.log("Error occured at this step-0");
                return badRequest({ body: error.message });
            })
            return res.text().then(data => badRequest({ body: data })).catch(error => {
                console.log("Error occured at this step-1");
                return badRequest({ body: error.message });
            })
        }).catch(error => { console.log("Internal Error occured - '" + url + "'"); return serverError({ body: error.message }); })
    }
    catch (e) {
        options.body = { message: e.message };
        return badRequest(options);
    }
}

