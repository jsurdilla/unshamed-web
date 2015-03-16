/** @jsx React.DOM */

var CurrentUserStore = require('../../stores/CurrentUserStore');
var { intersection, map } = require('lodash');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var ResourceSidebarSectionItem = require('./ResourcesSidebarSectionItem');
var ResourceStore = require('../../stores/ResourceStore');

var ResourceSidebarSection = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      resources: ResourceStore.getAll()
    }
  },

  componentDidMount() {
    ResourceStore.addChangeListener(this._onDataChange);
  },

  render() {
    const userStruggles = CurrentUserStore.getCurrentUser().get('struggles').toJS();

    let resources = this.state.resources.filter(r => intersection(r.get('struggles').toJS(), userStruggles).length > 0);
    resources = map(resources.toArray(), (resource) => {
      return <ResourceSidebarSectionItem key={ resource.get('cid') } resource={ resource } />
    });


    // var resources = map(this.props.resources.toArray(), (resource) => {
    //   console.log(resource.toJS());
    //   return <ResourceSidebarSectionItem key={ resource.get('cid') } resource={ resource } />;
    // });

    return (
      <section className='resources wire-section'>
        <h3>Resources</h3>
        <div className='content'>
          <ol className="list-unstyled">
            { resources }
          </ol>
        </div>
      </section>
    );
  },

  componentWillUnmount() {
    ResourceStore.removeChangeListener(this._onDataChange);
  },

  _onDataChange() {
    this.setState({ resources: ResourceStore.getAll() });
  }
});

module.exports = ResourceSidebarSection;