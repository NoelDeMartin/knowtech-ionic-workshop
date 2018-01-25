export default abstract class AsyncProvider {

    static sync(...providers: AsyncProvider[]): Promise<void> {

        let promise: Promise<void> = Promise.resolve();

        for (let provider of providers) {
            promise = promise.then(() => provider.init());
        }

        return promise;
    }

    private ready: Promise<void> = null;

    public init(): Promise<void> {

        if (!this.ready) {
            this.ready = this.initialize();
        }

        return this.ready;
    }

    protected abstract initialize(): Promise<void>;

}