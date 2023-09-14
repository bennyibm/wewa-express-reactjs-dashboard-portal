import {useCallback} from 'react'
import useApiSecured from "./use-api-secured";
import { AbstractEntity, ResponseModel, StatistisMinimal } from '../../models';
import { AxiosRequestConfig } from 'axios';

export type GetAllParams = {
    page? : number,
    size? : number,
    search? : string
    filter? : {}
}

export default function useApiCrud<T extends AbstractEntity>(path : string, baseRoute? : string) {
    const {api, abortRequest} = useApiSecured(path, baseRoute)

    const findAll = useCallback( ({page = 1, size = 12, search = '', filter} : GetAllParams) => (
        api.get<ResponseModel<T>>(`?page=${page}&size=${size}&search=${search}`, { data: filter && JSON.stringify(filter) }).then( response => response.data)
    ), [api])

    const findOneById = useCallback( async (id : string) => {
        return api.get<T>(id).then( response => response.data)
    }, [api])

    const findOneByExample = useCallback( async (example : Object) => {
        const response = await api.get<T>('', { data: example });
        return response.data;
    }, [api])

    const save = useCallback( async (obj : T) : Promise<T> => {

        return api.request( { url : obj._id, data : obj, method : (obj._id === undefined) ? 'post' : 'put' }).then( response => response.data)

    }, [api])

    const getStats = useCallback( (id : string) => api.get<StatistisMinimal>(`statistics/${id}`).then( response => response.data) , [api])

    const deleteOneById = useCallback( (id : string) => {
        return api.delete(id)
    }, [api])

    const count = useCallback( async (filter : {}) => {
        const response = await api.get('count', { data: filter });
        return response.data;
    }, [api])

    const customRequest = useCallback( async <TRequest = T>(config : AxiosRequestConfig) => {
        const response = await api.request<TRequest>(config);
        return response.data;
    }, [api])

    return {
        findAll,
        findOneById,
        findOneByExample,
        save,
        deleteOneById,
        getStats,
        count,
        customRequest,
        abortRequest,
        api
    }
};
