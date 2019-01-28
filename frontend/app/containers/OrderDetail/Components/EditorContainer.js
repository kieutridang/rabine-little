import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import { EditorButton, EditorWrapper } from '.';

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

class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentWillMount() {
    document.addEventListener('clearDetailSiteEditor', this.clearEditor);
  }

  componentWillUnmount() {
    document.removeEventListener('clearDetailSiteEditor', this.clearEditor);
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }

  clearEditor = () => {
    this.setState({
      editorState: EditorState.createEmpty(),
    });
  }

  render() {
    const { className, onChange } = this.props;
    return (
      <div className={className}>
        <Editor
          editorState={this.state.editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          toolbar={toolbar}
          onChange={(content) => {
            const concatedContent = concatContent(content);
            onChange(concatedContent);
          }}
          placeholder="Write a new note..."
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

function concatContent(content) {
  const contentArr = content.blocks;
  const result = contentArr.reduce((res, currentBlock, i) => (
    i === 0 ? `${res + currentBlock.text}` : `${res}\n${currentBlock.text}`), '');
  return result;
}

EditorContainer.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
};

const StyledEditorWrapper = styled(EditorContainer) `
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
    bottom: 0.5rem;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
  }
  .rdw-editor-main {
    min-height: 100px;
  }
  .rdw-editor-wrapper {
    
  }
  .rdw-option-wrapper {
    margin: 0;
  }
`;

const OrderEditor = ({ clearNote, onChangeNote, noteContent, submitNote }) => (
  <EditorWrapper>
    <StyledEditorWrapper
      onChange={onChangeNote}
      noteContent={noteContent}
    />
    <EditorButton>
      <button
        className={`primary ${noteContent === '' ? 'disabled' : null}`}
        disabled={noteContent === ''}
        onClick={submitNote}
      >SAVE</button>
      <button
        className="secondary"
        onClick={() => {
          document.dispatchEvent(new CustomEvent('clearDetailSiteEditor'));
          clearNote();
        }}
      >CANCEL</button>
    </EditorButton>
  </EditorWrapper>
);

OrderEditor.propTypes = {
  clearNote: PropTypes.func,
  onChangeNote: PropTypes.func,
  noteContent: PropTypes.string,
  submitNote: PropTypes.func,
};

export default OrderEditor;

