declare module '*config.json' {
    const config: {
        backend_url: string,
        env: 'production' | 'development'
    };
    export default config;
}