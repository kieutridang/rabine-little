import { Editor } from 'react-draft-wysiwyg';
import styled from 'styled-components';
import React, { PropTypes } from 'react';

const toolbar = {
  options: ['inline', 'fontSize', 'list', 'link', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'strikethrough'],
  },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['unordered', 'ordered', 'indent', 'outdent'],
  },
  link: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_self',
    options: ['link', 'unlink'],
  },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['undo', 'redo'],
  },
};

const EditorContainer = ({ className }) => (
  <div className={className}>
    <Editor
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      toolbarClassName="toolbar-class"
      toolbar={toolbar}
      placeholder="Write a new note..."
    />
  </div>
);

EditorContainer.propTypes = {
  className: PropTypes.string,
};

const EditorWrapper = styled(EditorContainer)`
  .rdw-option-wrapper {
    border: none;
    box-shadow: none;
  }
  .rdw-option-wrapper:hover {
    box-shadow: none;
  }
  .rdw-editor-toolbar {
    position: absolute;
    right: 40px;
    bottom: 20px;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
  }
  .rdw-editor-wrapper {
    
  }
  .rdw-option-wrapper {
    margin: 0;
  }
`;

export default EditorWrapper;

