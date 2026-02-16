export async function withTimeout<T>(
    promise: Promise<T>,
    ms: number,
    fallback: T
): Promise<T> {
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), ms);
    });

    const result = await Promise.race([promise, timeoutPromise]);

    clearTimeout(timeoutId!);
    return result;
}
