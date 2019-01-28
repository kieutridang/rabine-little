import styled, { css } from 'styled-components';
import { borderStyle } from '../../utils/styles/border';
import { marginStyle, paddingStyle } from '../../utils/styles/boxModel';

const StyledBox = styled.div`
  display: flex;
  box-sizing: border-box;
  ${(props) => !props.flexBasis && 'max-width: 100%;'}
  ${(props) => props.opacity && `opacity: ${props.opacity};`}
  ${(props) => props.borderRadius && `border-radius: ${props.borderRadius};`}
  ${(props) => props.alignItems && alignItemsStyle}
  ${(props) => props.alignContent && alignContentStyle}
  ${(props) => props.alignSelf && alignSelfStyle}
  ${(props) => props.background && backgroundStyle(props.background)}
  ${(props) => props.border && borderStyle(props.border)}
  ${(props) => props.direction && directionStyle}
  ${(props) => props.flex !== undefined && flexStyle}
  ${(props) => props.flexBasis && flexBasisStyle}
  ${(props) => props.fill && fillStyle(props.fill)}
  ${(props) => props.gridArea && gridAreaStyle}
  ${(props) => props.justifyContent && justifyContentStyle}
  ${(props) => (props.margin && marginStyle(props.margin))}
  ${(props) => (props.padding && paddingStyle(props.padding))}
  ${(props) => props.flexWrap && flexWrapStyle}
  ${(props) => props.overflow && `overflow: ${props.overflow};`}
  ${(props) => props.width && widthStyle}
  ${(props) => props.height && heightStyle}
  ${(props) => props.color && colorStyle}
  ${(props) => props.minHeight && `min-height: ${props.minHeight};`}
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight};`}
`;

const widthStyle = css`
  width: ${(props) => props.width};
  min-width: ${(props) => props.width};
`;

const heightStyle = css`
  height: ${(props) => props.height};
  min-height: ${(props) => props.height};
`;

const ALIGN_ITEMS_MAP = {
  baseline: 'baseline',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

const alignItemsStyle = css`
  align-items: ${(props) => ALIGN_ITEMS_MAP[props.alignItems]};
`;

const ALIGN_CONTENT_MAP = {
  around: 'around',
  between: 'between',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

const alignContentStyle = css`
  align-content: ${(props) => ALIGN_CONTENT_MAP[props.alignContent]};
`;

const ALIGN_SELF_MAP = {
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
  stretch: 'stretch',
};

const alignSelfStyle = css`
  align-self: ${(props) => ALIGN_SELF_MAP[props.alignSelf]};
`;

const FLEX_BASIS_MAP = {
  auto: 'auto',
  full: '100%',
  '1/2': '50%',
  '1/4': '25%',
  '3/4': '75%',
  '1/3': '33.33%',
  '2/3': '66.66%',
};

const flexBasisStyle = css`
  flex-basis: ${(props) => FLEX_BASIS_MAP[props.flexBasis]};
`;

const FLEX_MAP = {
  [true]: '1 1',
  [false]: '0 0',
  grow: '1 0',
  shrink: '0 1',
};

const flexStyle = css`
  flex: ${(props) => FLEX_MAP[props.flex]};
`;

const JUSTIFY_CONTENT_MAP = {
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
  start: 'flex-start',
};

const justifyContentStyle = css`
  justify-content: ${(props) => JUSTIFY_CONTENT_MAP[props.justifyContent]};
`;

const fillStyle = (fill) => {
  if (fill === 'horizontal') {
    return 'width: 100%;';
  }
  if (fill === 'vertical') {
    return 'height: 100%;';
  }
  if (fill) {
    return `
      width: 100%;
      height: 100%;
    `;
  }

  return undefined;
};

const directionStyle = css`
  ${(props) => props.direction === 'row' && 'min-height: 0;'}
  ${(props) => props.direction === 'column' && 'min-width: 0;'}

  flex-direction: ${(props) => props.direction};

  ${(props) => (props.direction === 'row-responsive' ? `
    @media only screen and (min-width: 576px) {
      flex-direction: column;
      flex-basis: auto;
      justify-content: flex-start;
      align-items: stretch;
    }
  ` : '')}
}`;

const gridAreaStyle = css`
  grid-area: ${(props) => props.gridArea};
`;

const flexWrapStyle = css`
  flex-wrap: ${(props) => props.flexWrap};
`;

const backgroundStyle = (background) => {
  if (typeof background === 'object') {
    if (background.image) {
      return css`
        background: ${background.image} no-repeat;
        background-position: ${background.position || 'center center'};
        background-size: cover;
        color: inherit;
      `;
    } else if (background.color) {
      return css`
          background-color: ${background.color};
          ${background.hover && background.hover.color && `
            &:hover {
              background-color: ${background.hover.color};
              cursor: pointer;
            }
          `}
        `;
    }
    return undefined;
  }
  if (background) {
    if (background.lastIndexOf('url', 0) === 0) {
      return css`
        background: ${background} no-repeat center center;
        background-size: cover;
      `;
    }
  }

  return undefined;
};

const colorStyle = css`
  color: ${(props) => props.color};
`;

export default StyledBox;
