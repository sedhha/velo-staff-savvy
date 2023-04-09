import wixSecretBackend from "wix-secrets-backend";

const secretsToFetch = [
    'BACKEND_API_KEY',
    'SUPABASE_URL'
];

const fetchSecretsFromSecretsManager = async () => {
    if (global.secretManagerSecrets != null) return global.secretManagerSecrets;
    const secretsPromises = secretsToFetch.map(secret => wixSecretBackend.getSecret(secret));
    const allSecrets = await Promise.all(secretsPromises.map(promise =>
        promise.catch(error => {
            console.log("Error Occured while trying to fetch Secret -> ", error.message);
            return null;
        })
    ));
    global.secretManagerSecrets = allSecrets.reduce((acc, curr, index) => {
        acc[secretsToFetch[index]] = curr;
        return acc;
    }, {});
    return global.secretManagerSecrets;
}

export { fetchSecretsFromSecretsManager }

