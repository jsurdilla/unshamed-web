var AvatarEditor = require('react-avatar-editor');
var Bootstrap = require('react-bootstrap');
var cn = require('classnames');
var { Button, Modal, OverlayMixin } = Bootstrap;
var React = require('react');

var CustomModalTrigger = React.createClass({
  mixins: [OverlayMixin],

  getInitialState() {
    return {
      imagePosition: {
        x: 0,
        y: 0
      },
      avatarEditorCropScale: 1.0,
      isModalOpen: false,
      origProfilePic: this.props.origProfilePic
    };
  },

  render() {
    return (
      <a onClick={this.toggle}>Select</a>
    );
  },

  renderOverlay() {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    var avatarEditor = '';
    if (this.state.origProfilePic) {
      avatarEditor = <AvatarEditor
        image={this.state.origProfilePic} 
        width={300}
        height={300}
        border={20}
        imageX={this.state.imagePosition.x}
        imageY={this.state.imagePosition.y}
        scale={this.state.avatarEditorCropScale}
        willUnmount={this._handleAvatarEditorUnmount} />
    }

    var avatarEditorClasses = cn({
      'avatar-editor': true,
      'hidden': !this.state.origProfilePic
    });

    return (
      <Modal bsStyle='primary' title='Profile Picture' onRequestHide={this.toggle}>
        <div className="modal-body">
          <label className='upload-img-btn-wrapper wire-btn'>
            <input type='file' accept='image/*' onChange={this._handleFileChange} />
            <span>Upload an image from your computer.</span>
          </label>

          <div className={avatarEditorClasses}>
            {avatarEditor}
            <input type='range' onChange={this._handleScaleChange} min='1' max='2' step='0.01' value={this.state.avatarEditorCropScale} />
          </div>
        </div>

        <div className="modal-footer">
          <Button bsStyle='primary' onClick={this.toggle}>Close</Button>
        </div>
      </Modal>
    );
  },
  
  toggle: function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  _handleScaleChange(event) {
    this.setState({ avatarEditorCropScale: parseFloat(event.target.value) });
  },

  _handleFileChange(event) {
    var reader = new FileReader();
    reader.onload = ((upload) => {
      this.setState({ origProfilePic: upload.target.result });
    }).bind(this);
    reader.readAsDataURL(event.target.files[0]);
  },

  _handleAvatarEditorUnmount(image, croppedImage) {
    if (this.props.onProfilePicChange) {
      this.props.onProfilePicChange(croppedImage);
    }

    this.setState({
      croppedImage: croppedImage,
      imagePosition: {
        x: image.x,
        y: image.y
      }
    });
  }
});

module.exports = CustomModalTrigger;