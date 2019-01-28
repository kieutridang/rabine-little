import L from 'leaflet';


const markerHtmlStyles = (color) => `
  background-color: ${color};
  width: 1.2rem;
  height: 1.2rem;
  display: block;
  left: -1rem;
  top: -0.75rem;
  position: relative;
  border-radius: 1.5rem 2.5rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
`;

const createIcon = (customColor = '#583470') => {
  const myIcon = L.divIcon({
    className: 'my-custom-pin',
    iconAnchor: [0, 12],
    labelAnchor: [-3, 0],
    popupAnchor: [0, -18],
    html: `<span style="${markerHtmlStyles(customColor)}" />`,
  });

  return myIcon;
};

export default createIcon;
