declare module '*config.json' {
    const config: {
        backend_url: string,
        env: 'production' | 'development',
        firebase: Object,
        backend: 'firebase' | 'express'
    };
    export default config;
}