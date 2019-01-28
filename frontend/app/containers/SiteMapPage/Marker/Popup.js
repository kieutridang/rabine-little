import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

const preselectedColors = [
  '#FF4242',
  '#299FFF',
  '#FFFF52',
  '#27EB33',
  '#00ffff',
];

const ColorCircle = styled.button`
  position: relative;

  width: 1.1rem;
  height: 1.1rem;
  margin: 0 0.2rem;

  background: ${(props) => props.color};
  appearance: none;
  border: 0;
  border-radius: 50%;
  transition: all 120ms ease;
  cursor: pointer;

  &.active {
    &:after {
      opacity: 1;
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    z-index: 1;
    border-radius: 50%;
    background: hsla(0, 0%, 100%, 0.88);
    opacity: 0;
    transition: all 100ms ease;
  }
`;

const Form = styled.form`
  padding: 0.5rem;
  font-size: 1.0rem;
  width: 272px;

  span {
    margin: 0;
    padding: 0;

    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsla(345, 3%, 73%, 1.0);
  }
`;

const input = `
  display: block;
  width: 100%;

  padding: 0.6rem 0.9rem;
  background: hsla(0, 0%, 0%, 0.0);
  border: 1px solid hsla(0, 0%, 100%, 0.29);
  border-radius: 4px;
  color: hsla(0, 0%, 100%, 0.75);

  &:focus {
    outline: none;
    color: hsla(0, 0%, 100%, 1.0);
    border-color: hsla(0, 0%, 100%, 0.58);
  }
`;

const Input = styled.input`
  ${input}
`;

const Select = styled.select`
  box-shadow: none;
  appearance: none;
  ${input}
`;

const Set = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.8rem 0;

  &:first-of-type {
    margin-top: 1.0rem;
  }

  &:last-of-type {
    margin-top: 1.0rem;
    margin-bottom: 0;
  }

  span {
    &:last-of-type {
      display: flex;
      align-items: center;
      user-select: all;
      color: hsla(0, 0%, 100%, 0.9);
    }
  }
`;

const StyledColorPicker = styled(ColorPicker)`
  margin-left: 0.4rem;
  user-select: none;

  .rc-color-picker-trigger {
    width: 3.0rem;
    height: 1.3rem;
    border: 1px solid hsl(0, 0%, 30%);
    box-shadow: 0 0 0 2px hsl(0, 0%, 0%) inset;
  }
`;

const Button = styled.button`
  width: 48%;
  margin-top: 0.4rem;
  padding: 0.5rem 0.4rem;

  text-align: center;

  background-color: hsla(360, 85%, 53%, 1.0);
  border-radius: 4px;
  color: white;
  cursor: pointer;

  font-size: 0.9325rem;
  font-weight: 500;

  transition: all 120ms ease;

  &.duplicate {
    background-color: hsla(357, 100%, 40%, 1.0);
  }

  &.delete {
    background-color: hsla(220, 3%, 58%, 1.0);
  }

  &:hover {
    opacity: 0.7;
  }

  &:first-of-type {
    margin-right: 2%;
  }

  &:larst-of-type {
    margin-left: 2%;
  }
`;

const toFeet = (metric) => {
  const src = metric.split(' ');
  const value = src[0];
  const unit = src[1];

  switch (unit) {
    case 'm²':
      return value * 10.7639;
    case 'ha':
      return value * 107639;
    case 'km':
      return value * 3280.84;
    default: // metres
      return value * 3.28084;
  }
};

const MarkerPopupForm = ({
  onChange,
  changePolygonColor,

  data,
  layers = [],
  featureId,

  duplicatePolygon,
  deletePolygon,

  readableArea,
  readableDistance,
}) => {
  const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
  const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);

  const colorCircles = preselectedColors.map((color) => {
    const onClick = (e) => {
      e.preventDefault();
      changePolygonColor(data.id, featureId)({ color });
    };

    const className = data.properties.color === color && 'active';

    return <ColorCircle key={color} color={color} onClick={onClick} className={className} />;
  });

  return (
    <Form>
      <Set>
        <Input
          type="text"
          name="title"
          placeholder="Measurement Title"
          onChange={onChange(featureId)}
          value={data.properties.title || ''}
        />
      </Set>

      <Set>
        {layers.length === 0 && <span>No layers found…</span>}
        {layers.length > 0 && <Select name="layerId" defaultValue={data.properties.layer && data.properties.layer.id} onChange={onChange(featureId)}>
          <option>Choose a layer</option>
          {layers.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Select>}
      </Set>

      <Set>
        <span>Color:</span>
        <span>
          {colorCircles}
          <StyledColorPicker
            defaultColor={data.properties.color}
            onChange={changePolygonColor(data.id, featureId)}
            enableAlpha={false}
          />
        </span>
      </Set>

      <Set>
        <span>Area:</span>
        <span>{areaSqFeet} sqfeet</span>
      </Set>

      <Set>
        <span>Perimeter:</span>
        <span>{perimeterFeet} feet</span>
      </Set>

      <Set>
        <Button onClick={duplicatePolygon(featureId)} className="duplicate">Duplicate</Button>
        <Button onClick={deletePolygon(data.id)(featureId)} className="delete">Delete</Button>
      </Set>
    </Form>
  );
};

MarkerPopupForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  changePolygonColor: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  featureId: PropTypes.string.isRequired,
  duplicatePolygon: PropTypes.func.isRequired,
  deletePolygon: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  readableArea: PropTypes.object.isRequired,
  readableDistance: PropTypes.object.isRequired,
};

export default MarkerPopupForm;
