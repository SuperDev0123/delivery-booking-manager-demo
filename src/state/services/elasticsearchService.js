import axios from 'axios';

import {
    successGetAddressesWithPrefix,
    failedGetAddressesWithPrefix,
} from '../actions/elasticsearchActions';
import { ES_URL, ES_USERNAME, ES_PASSWORD } from '../../config';

export const getAddressesWithPrefix = (src, prefix) => {
    const indexName = 'address';
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        auth: {
            username: ES_USERNAME,
            password: ES_PASSWORD
        },
        url: `${ES_URL}/${indexName}/_search`,
        data: {
            'query': {
                'match_phrase_prefix': {
                    'suburb': {
                        'query': prefix,
                        'slop': 3
                    }
                }
            }
        }
    };

    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successGetAddressesWithPrefix(src, data.hits.hits)))
            .catch((error) => dispatch(failedGetAddressesWithPrefix(error)));
    };
};
