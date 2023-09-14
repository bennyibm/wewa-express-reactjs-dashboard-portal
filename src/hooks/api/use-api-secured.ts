import useApi from "./use-api";

export default function useApiSecured(path : string, baseRoute? : string) {
    const {accessToken} = {accessToken : ''}
    const api = useApi(path)

    api.addRequestInterceptor( config => {
        config.headers = { ...config.headers, 'Authorization' : `Bearer ${accessToken}` }

        return config
    })

    return api
};
