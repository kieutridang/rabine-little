// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import { StyledForm } from './styled/StyledForm';
import { FormButton } from './styled/FormButton';
import FormRow from './styled/FormRow';
import FormLabel from './styled/FormLabel';
import FormColumn from './styled/FormColumn';
import { FormInput } from './styled/FormInput';

class EditPopupTabZone extends React.Component {
  state = {
    title: (this.props.properties && this.props.properties.title) || 'No Title',
    description: (this.props.properties && this.props.properties.description) || 'No Description',
  }

  handleChangeTitle = (e) => {
    const { value } = e.target;
    const { onChangeData, properties } = this.props;
    this.setState({ title: value }, () => {
      const currentState = this.state;
      onChangeData({ ...properties, ...currentState });
    });
  };

  handleChangeDescription = (e) => {
    const { value } = e.target;
    const { onChangeData, properties } = this.props;
    this.setState({ description: value }, () => {
      const currentState = this.state;
      onChangeData({ ...properties, ...currentState });
    });
  };

  handleSaveEditData = (e) => {
    e.preventDefault();

    const { saveEditData, properties } = this.props;
    const { title, description } = this.state;

    if (saveEditData) {
      // TODO: implement this
      saveEditData('zone', properties._id, {
        title,
        description,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSaveEditData(e);
    }
  }

  render() {
    const {
      isShared,
      deletePolygon,
      editPolygon,
      scalePolygon,
      properties,
    } = this.props;

    const {
      title,
      description,
    } = this.state;

    return (
      <StyledForm>
        <FormRow>
          <FormColumn>
            <FormLabel labelColumn>ANNOTATION NAME</FormLabel>
            <FormInput
              type={'text'}
              name="title"
              id="title"
              placeholder="Enter title"
              onChange={this.handleChangeTitle}
              onBlur={this.handleChangeTitle}
              value={title}
              disabled={isShared}
              onKeyPress={this.handleKeyPress}
            />
          </FormColumn>
        </FormRow>

        <FormRow>
          <FormColumn hasMargin>
            <FormLabel labelColumn>DESCRIPTION</FormLabel>
            <FormInput
              type={'text'}
              name="description"
              id="description"
              placeholder="Enter description"
              onChange={this.handleChangeDescription}
              onBlur={this.handleChangeDescription}
              value={description}
              disabled={isShared}
              onKeyPress={this.handleKeyPress}
            />
          </FormColumn>
        </FormRow>

        <FormRow justifyContent="flex-end">
          <FormButton type="button" onClick={editPolygon(properties._id)} className="secondary">Resize</FormButton>
          <FormButton type="button" onClick={scalePolygon(properties._id)} className="secondary">Scale</FormButton>
          <FormButton type="button" onClick={deletePolygon(properties._id)} className="secondary">Delete</FormButton>
          <FormButton onClick={this.handleSaveEditData} className="primary">Save</FormButton>
        </FormRow>
      </StyledForm>
    );
  }
}

EditPopupTabZone.propTypes = {
  deletePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  saveEditData: PropTypes.func,
  isShared: PropTypes.bool,

  properties: PropTypes.object.isRequired,
  onChangeData: PropTypes.func,
};

export default EditPopupTabZone;
