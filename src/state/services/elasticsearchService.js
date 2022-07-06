import axios from 'axios';

import {
    successGetAddressesWithPrefix,
    failedGetAddressesWithPrefix,
} from '../actions/elasticsearchActions';
import { ES_URL, ES_USERNAME, ES_PASSWORD } from '../../config';

export const getAddressesWithPrefix = (src, suburbPrefix, postalCodePrefix) => {
    const indexName = 'address';

    let data;
    if (suburbPrefix && !postalCodePrefix) {
        data = {
            'query': {
                'match_phrase_prefix': {
                    'suburb': {
                        'query': suburbPrefix,
                        'slop': 3
                    }
                }
            }
        };
    } else if (!suburbPrefix && postalCodePrefix) {
        data = {
            'query': {
                'match_phrase_prefix': {
                    'postal_code': {
                        'query': postalCodePrefix
                    }
                }
            }
        };
    } else if (suburbPrefix && postalCodePrefix) {
        data = {
            'query': {
                'bool': {
                    'must': [
                        {
                            'match_phrase_prefix': {
                                'suburb': {
                                    'query': suburbPrefix,
                                    'slop': 3
                                }
                            }
                        },
                        {
                            'match_phrase_prefix': {
                                'postal_code': {
                                    'query': postalCodePrefix
                                }
                            }
                        }
                    ]
                }
            }
        };
    }

    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        auth: {
            username: ES_USERNAME,
            password: ES_PASSWORD
        },
        url: `${ES_URL}/${indexName}/_search`,
        data: data
    };

    return dispatch => {
        axios(options)
            .then(({ data }) => dispatch(successGetAddressesWithPrefix(src, data.hits.hits)))
            .catch((error) => dispatch(failedGetAddressesWithPrefix(error)));
    };
};
