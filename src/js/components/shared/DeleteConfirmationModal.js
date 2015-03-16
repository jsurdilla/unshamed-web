var { Button, Modal } = require('react-bootstrap');
var React = require('react');

const DeleteConfirmationModal = React.createClass({
  render() {
    return (
      <Modal { ...this.props } className='confirm-delete' animation={ true }>
        <div className='modal-body text-center'>
          <h4>{ this.props.prompt }</h4>
          <Button onClick={ this.props.onRequestHide }>Cancel</Button>
          <Button bsStyle='danger' onClick={ this.props.onDelete }>Delete</Button>
        </div>
      </Modal>
    );
  }
});

module.exports = DeleteConfirmationModal;