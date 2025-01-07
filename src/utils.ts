export function shortenPublicKey(publicKey: string, totalLength: number = 6): string {
    // Split the totalLength equally between the start and end
    const startLength = Math.floor(totalLength / 2);
    const endLength = totalLength - startLength;

    if (publicKey.length <= totalLength) {
        return publicKey;  // If the public key is shorter than or equal to the desired length, return it as is
    }

    const start = publicKey.slice(0, startLength);
    const end = publicKey.slice(-endLength);

    return `${start}...${end}`;
}