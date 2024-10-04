import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { useFetcher } from '@remix-run/react';
import { useJsApiLoader, GoogleMap, StandaloneSearchBox } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Input } from '~/components/ui/input';
import { MAP_LIBRARIES } from '~/utils/constants';
import { LoaderIcon } from 'lucide-react';

/*
  This is a map component. When the user interaction causes its bounds to change, it will be updated in the parent filters state.
  This component also tries to get the user's current location, and fetches the zip codes on initial loading.
  
  ----------------------------------------------------------------------------------------------------------
  Unfortunately, many of the components from @react-google-maps can be very coupled.
  Combined with Remix's async fetcher, it can get a bit messy.
  For a "quick" exercise, I don't want to spend too much time decoupling and modularizing this.
*/

export const MapWithBoundingBox = ({ 
  onBoundingBoxChange
} : {
  onBoundingBoxChange: (boundingBox: { top_right: { lat: number, lon: number }, bottom_left: { lat: number, lon: number } }) => void
}) => {
  // Ensure this component runs on the client side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (window) setIsClient(true);
  }, []);

  const [map, setMap] = useState<google.maps.Map>();
  const searchBoxRef = useRef<google.maps.places.SearchBox>();

  const [center, setCenter] = useState({ lat: 40.440624, lng: -79.995888 }); // Pittsburgh, where I'm located.

  // Flags for initial map loading
  const [userLocationDetermined, setUserLocationDetermined] = useState(false);
  const [initFetched, setInitFetched] = useState(false);

  // Handle data loading. key attribute to share fetcher instance with other components
  // Here to handle initial loading
  const fetcher = useFetcher();

  const { isLoaded } = useJsApiLoader({
    /* 
      Shouldn't include API keys in most cases, but Google Maps API key is weird. 
      You cannot avoid exposing the API key to the end user and it will be included in requests.
      I certainly can set protection in the Google Console but URL/referrer unfortunately can be spoofed.
      This is a fundamental flaw of Google Maps JS API
    */
    googleMapsApiKey: "AIzaSyDFJ1GBiYf7abJO0Zs15VAwQUEv0Vbw390", 
    libraries: MAP_LIBRARIES as Libraries
  });

  // Handle map loading
  const handleMapLoad = useCallback((map : google.maps.Map) => setMap(map), []);
  
  const handleMapUnmount = useCallback(() => setMap(undefined), []);

  // Use navigator to get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude }); // Set map center to user's location
          setUserLocationDetermined(true);
        },
        () => {
          console.error("Geolocation failed or was blocked.");
          setUserLocationDetermined(true);
        }, 
        { timeout: 6000 }
      );
    } else {
      setUserLocationDetermined(true);
    }
  }, []);

  // Function to handle fetching zip codes using map bounds
  // Fires on map idle, which means the map has finished loading and bounding box is available
  const handleInitialSearch = useCallback(() => {
    if (!map || !userLocationDetermined|| initFetched) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    fetcher.submit({
      geoBoundingBox: {
        top_right: { lat: northEast.lat(), lon: northEast.lng() },
        bottom_left: { lat: southWest.lat(), lon: southWest.lng() },
      },
    }, { 
      action: "/api/search", 
      method: "POST", 
      encType: "application/json",
    });

    setInitFetched(true);
  }, [map, userLocationDetermined, fetcher, initFetched, setInitFetched]);

  // This effect is a catch-all case, which fires when the user rejects or already have set the location access.
  // Since handleInitialSearch is triggered on idle, when user rejects the request, the map will not reload 
  // and will not trigger handleInitialSearch again. That's when this effect triggers.
  useEffect(() => {
    if (userLocationDetermined && !initFetched && map) {
      handleInitialSearch();
    }
  }, [userLocationDetermined, initFetched, map, handleInitialSearch]);

  // Ensure this component runs on the client side
  if (!isClient) return null;

  // Update map bounds on the filters object
  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        onBoundingBoxChange({
          top_right: { lat: northEast.lat(), lon: northEast.lng() },
          bottom_left: { lat: southWest.lat(), lon: southWest.lng() },
        });
      }
    }
  };

  // Handle when user navigates to a new city
  const handlePlaceChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (!places || places?.length === 0) return;

      const place = places[0];
      const location = place.geometry?.location;
      if (location) {
        setCenter({ lat: location?.lat(), lng: location?.lng() });
      }
    }
  };

  return (
    <>
      {!isLoaded
        ? <div className="h-[340px] w-full flex items-center justify-center">
          <LoaderIcon className="animate-spin" />
        </div>
      : <>
          <div className="w-full">
            <StandaloneSearchBox
              onLoad={(ref) => { searchBoxRef.current = ref }}
              onPlacesChanged={handlePlaceChanged}
            >
              <Input
                name="city"
                type="text"
                placeholder="Enter a place!"
                className="w-full"
              />
            </StandaloneSearchBox>
          </div>
          <GoogleMap
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
            onIdle={handleInitialSearch}
            mapContainerStyle={{ height: '300px', width: '100%' }}
            zoom={12}
            center={center}
            onBoundsChanged={handleBoundsChanged}
            options={{
              mapTypeId: 'roadmap',
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              minZoom: 12
            }}
          />
        </>
      }
    </>
  );
};
