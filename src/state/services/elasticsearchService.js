import axios from 'axios';

import {
    successGetAddressesWithPrefix,
    failedGetAddressesWithPrefix,
} from '../actions/elasticsearchActions';
import { ES_URL, ES_USERNAME, ES_PASSWORD } from '../../config';

export const getAddressesWithPrefix = (src, suburbPrefix, postalCodePrefix) => {
    const indexName = 'address';
    const rangeSearch = {
        'bool': {
            'should': [
                {
                    'range': {
                        'postal_code': {'gte': '2000'}
                    }
                }, 
                {
                    'range': {
                        'postal_code': {'lt': '1000'}
                    }
                }
            ]
        }
    };

    let data;
    if (suburbPrefix && !postalCodePrefix) {
        data = {
            'query': {
                'bool' : {
                    'must': [
                        {
                            'match_phrase_prefix': {
                                'suburb': {
                                    'query': suburbPrefix,
                                    'slop': 3
                                }
                            }
                        },
                        rangeSearch
                    ]
                }
            }
        };
    } else if (!suburbPrefix && postalCodePrefix) {
        data = {
            'query': {
                'bool' : {
                    'must': [
                        {
                            'match_phrase_prefix': {
                                'postal_code': {
                                    'query': postalCodePrefix
                                }
                            },
                        },
                        rangeSearch
                    ]
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
                        },
                        rangeSearch
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
