/* eslint no-mixed-operators: 0 */
import $ from 'jquery';

export const handleImageDrag = (
  Component,
  containerElement: string,
  dragImageElement: string,
  zoomLevelKey: string,
  toggle,
  callback,
) => {
  const imageContainer = $(containerElement);
  const mainBackgroundImage = $(dragImageElement);
  if (zoomLevelKey == null) return console.error('Zoom level key is required');  // eslint-disable-line no-console
  if (imageContainer) {
    imageContainer.on('mousedown', (e) => {
      e.preventDefault();
      const zoomLevel = Component.state[zoomLevelKey];
      const mainBackgroundWidth = mainBackgroundImage.width();
      const mousedown = {
        x: e.originalEvent.pageX || e.originalEvent.touches[0].pageX,
        y: e.originalEvent.pageY || e.originalEvent.touches[0].pageY,
      };
      const elePos = {
        x: parseFloat(
          mainBackgroundImage
            .css('backgroundPosition')
            .split(' ')[0]
            .replace('%', '')
          ),
        y: parseFloat(
          mainBackgroundImage
          .css('backgroundPosition')
          .split(' ')[1]
          .replace('%', '')
        ),
      };
      $(document).on('mouseup', () => $(document).unbind('mousemove'));
      return $(document).on('mousemove', (childElement) => {
        const mousePos = {
          x: childElement.originalEvent.pageX || childElement.originalEvent.changedTouches[0].pageX || mousedown.x,
          y: childElement.originalEvent.pageY || childElement.originalEvent.changedTouches[0].pageY || mousedown.y,
        };
        if (mousedown !== mousePos) {
          const movePercentage = {
            x: 100 * (mousePos.x - mousedown.x) / mainBackgroundWidth,
            y: 100 * (mousePos.y - mousedown.y) / mainBackgroundWidth,
          };
          const actualMovePercentage = {
            x: 1 / (1 - zoomLevel) * movePercentage.x,
            y: 1 / (1 - zoomLevel) * movePercentage.y,
          };

          const transRange = (trans) => {
            if (trans <= 0) return 0;
            if (trans >= 100) return 100;
            return trans;
          };

          mainBackgroundImage.css({
            'background-position': `${transRange(elePos.x + actualMovePercentage.x)}% ${transRange(
            elePos.y + actualMovePercentage.y
          )}%`,
          });
          const mouse = {
            x: actualMovePercentage.x,
            y: actualMovePercentage.y,
          };
          Component.setState({ mouse }, () => callback());
        }
      });
    });
    return true;
  }
  imageContainer.off('mousedown');
  return false;
};
