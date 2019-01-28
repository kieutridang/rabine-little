
const greyString = '<svg width="20px" height="30px" viewBox="0 0 20 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Working-Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.699999988"><path d="M10,1 C5.02980625,1 1,5.05688477 1,10.0625 C1,11.4643555 1.31640625,12.7936543 1.88155,13.9777832 C1.9131625,14.0450723 10,30 10,30 L18.0209125,14.1760254 C18.6466938,12.9423359 19,11.5439922 19,10.0625 C19,5.05688477 14.9710937,1 10,1 Z M10,15.5 C7.01785,15.5 4.6,13.0644531 4.6,10.0625 C4.6,7.06054687 7.01785,4.625 10,4.625 C12.98125,4.625 15.4,7.06054687 15.4,10.0625 C15.4,13.0644531 12.98125,15.5 10,15.5 Z" id="grey" stroke="#FFFFFF" fill="#909296" fill-rule="nonzero"></path></g></svg>';
const blueString = greyString.replace('fill="#909296"', 'fill="#308AFF"');
const greenString = greyString.replace('fill="#909296"', 'fill="#33D63D"');
const orangeString = greyString.replace('fill="#909296"', 'fill="#FF8E23"');
const redString = greyString.replace('fill="#909296"', 'fill="#ED2324"');
const yellowString = greyString.replace('fill="#909296"', 'fill="#FFF752"');
const purpleString = greyString.replace('fill="#909296"', 'fill="#800080"');

export const greyIcon = `data:image/svg+xml;base64, ${btoa(greyString)}`;
export const blueIcon = `data:image/svg+xml;base64, ${btoa(blueString)}`;
export const greenIcon = `data:image/svg+xml;base64, ${btoa(greenString)}`;
export const orangeIcon = `data:image/svg+xml;base64, ${btoa(orangeString)}`;
export const redIcon = `data:image/svg+xml;base64, ${btoa(redString)}`;
export const yellowIcon = `data:image/svg+xml;base64, ${btoa(yellowString)}`;
export const purpleIcon = `data:image/svg+xml;base64, ${btoa(purpleString)}`;
