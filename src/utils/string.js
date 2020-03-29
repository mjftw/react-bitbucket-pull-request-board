export function truncate(string, length, addEllipsis) {
    let newLength = length;
    let ellipsis = '';

    if (addEllipsis) {
        newLength = length - 3;
        if (newLength < string.length) {
            ellipsis = '...'
        }
    }

    return `${string.substring(0, length)}${ellipsis}`
}