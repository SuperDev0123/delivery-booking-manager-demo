import React, { useEffect, useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';
 
const LoadingContainer = () => (
    <div>Loading...</div>
); 

const GoogleMap = ({
    google, 
    center, 
    zoom, 
    style, 
    draggable, 
    scrollWheel, 
    disableDoubleClickZoom, 
    markerInfos,
    rest
}) => {
    const [zoomRatio, setZoomRatio] = useState(11);
    useEffect(() => {
        setZoomRatio(zoom);
    }, [zoom]);
    const onMarker = () => {
        setZoomRatio(zoomRatio + 1);
    };
    return (
        <Map
            google={google}
            style={style}
            initialCenter={center}
            zoom={zoomRatio}
            draggable={draggable}
            scrollWheel={scrollWheel}
            disableDoubleClickZoom={disableDoubleClickZoom}
            {...rest}
        >
            {markerInfos.map((item, index) => (
                <Marker
                    key={index}
                    {...item} 
                    onClick={onMarker}
                />
            ))}
            
        </Map>
    );
};

GoogleMap.defaultProps = {
    center: {
        lat: -33.86978,
        lng: 150.86233
    },
    zoom: 11,
    google: {},
    style: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    draggable: true,
    scrollWheel: true,
    disableDoubleClickZoom: false,
    markerInfos: []
};

GoogleMap.propTypes = {
    google: PropTypes.object,
    center: PropTypes.object,
    zoom: PropTypes.number,
    style: PropTypes.object,
    draggable: PropTypes.bool, 
    scrollWheel: PropTypes.bool, 
    disableDoubleClickZoom: PropTypes.bool, 
    markerInfos: PropTypes.array,
    rest: PropTypes.object
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAHT7vJhUtShMJQxipiuL702-14Q17jtec',
    LoadingContainer: LoadingContainer
})(GoogleMap);