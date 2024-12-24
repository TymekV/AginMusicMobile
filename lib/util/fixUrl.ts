export function fixUrl(url: string): string {
    // Trim whitespace and remove the trailing slash if present
    url = url.trim().replace(/\/$/, '');

    // Check if the URL starts with a protocol
    const hasProtocol = /^https?:\/\//i.test(url);

    // If the URL has no protocol, determine which one to add
    if (!hasProtocol) {
        // Check if the URL is a local address
        const isLocal = /\.(local|lan)$/i.test(url) || /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(url);

        // Add "http://" for local addresses, otherwise "https://"
        url = (isLocal ? 'http://' : 'https://') + url;
    }

    return url;
}
