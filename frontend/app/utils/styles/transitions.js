// @flow
/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */

export const easing = {
  // This is the most common easing curve.
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

export const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195,
};

export const formatMs = (milliseconds = 0) => `${Math.round(milliseconds)}ms`;
export const isString = (value) => typeof value === 'string';
export const isNumber = (value) => !Number.isNaN(parseFloat(value));

export function getAutoHeightDuration(height = 0) {
  if (!height) {
    return 0;
  }

  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function reflow(node) {
  return node.scrollTop;
}

export function getTransitionProps(props, options) {
  const { timeout, style = {} } = props;

  return {
    duration:
      style.transitionDuration || typeof timeout === 'number' ? timeout : timeout[options.mode],
    delay: style.transitionDelay,
  };
}

/**
 * @param {string|Array} props
 * @param {object} param
 * @param {string} param.prop
 * @param {number} param.duration
 * @param {string} param.easing
 * @param {number} param.delay
 */
export default {
  easing,
  duration,

  create(
    props = ['all'],
    options = { },
  ) {
    const {
      duration: durationOption = duration.standard,
      easing: easingOption = easing.easeInOut,
      delay = 0,
    } = options;

    return (Array.isArray(props) ? props : [props])
      .map(
        (animatedProp) =>
          `${animatedProp} ${
          typeof durationOption === 'string' ? durationOption : formatMs(durationOption)
          } ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`,
    )
      .join(',');
  },

  getAutoHeightDuration,

  reflow,

  getTransitionProps,
};
