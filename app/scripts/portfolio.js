// Fetch API import
import 'fetch';

// React import
import React from 'react';

// ReactDOM import
import ReactDOM from 'react-dom';

import showdown from 'showdown';


//React-router import
import {Router, Route, Link} from 'react-router';

var content = contentful.createClient({
  space: '8qxvw58ed4dv',
  accessToken: '21e220bf45b7ba949a3def729ec08db8d5d0410cd0044ae0a5b2167c885eb2e2'
}),
converter = new showdown.Converter();

// classNames module - classSet deprecated
import classNames from'classnames';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const state = {
}

const uniqueId = (function() {
  var count = 0;
  return function() {
    return 'id' + count++;
  }
})();

let pagerTriangle = [],
pagerRectangle = [],
shapes = {
  compoundPaths : ["M9.8,0.9L10.9,8L0.1,5.4L9.8,0.9z M1.2,5.8l9.8,2.4l-6,1.9L1.2,5.8z", "M9.1,8.2l-7.1,2.2L0.6,1.9L9.1,8.2z M10.4,1.3L3.7,3.8l5.4,4L10.4,1.3z", "M10.6,4.5L6.5,11L0.3,6.4L10.6,4.5z M8.9,4.6l-5.4-3L0.3,6.2L8.9,4.6z", "M10.3,9H0.2l5.2-8.2L10.3,9z M8,4.7l2.8-4.4H5.5L8,4.7z", "M8.8,5.9L4.6,11L0,3.2L8.8,5.9z M0.1,3.1l8.4,2.6L11,2.5L0.1,3.1z", "M11,0.4l-0.9,7.1L1.8,0.4H11z M10.1,8.2L4,2.8L0.2,11L10.1,8.2z", "M5.5,11l2.7-4.7L11,1.4H0L5.5,11z", "M5.5,1.4L2.81,6.1,0,11H11Z"],
  simplePaths : ["M9.8,1.9L11,9.1L0.1,6.4L9.8,1.9z", "M11,8.1L1.7,11L0,0L11,8.1z", "M11,1.9L6.6,8.8L0,4L11,1.9z", "M11.1,10H0L5.8,1L11.1,10z", "M11,4.5l-5.2,6.3L0.1,1.2L11,4.5z", "M10.8,0.9L9.8,9.3L0.1,0.9H10.8z", "M5.5,11l2.7-4.7L11,1.4H0L5.5,11z", "M5.5,1.4L2.81,6.1,0,11H11Z"]
};

const actions = {
  toggleNext: function(instance) {
    var instanceName = instance.toString();
    var current = state['current'+ instanceName];
    var next = current + 1;
    if (next > state[instanceName].length - 1) {
      next = 0;
    }
    state['current'+ instanceName] = next;
    render(state)
  },
  togglePrev: function(instance) {
    var instanceName = instance.toString();
    var current = state['current'+ instanceName];
    var prev = current - 1;
    if (prev < 0) {
      prev = state[instanceName].length - 1;
    }
    state['current'+ instanceName] = prev;
    render(state);
    // console.log(state['current'+ instanceName]);
  },
  toggleSlide: function(id, shape, instance) {
    // console.log(id);
    var instanceName = instance.toString(),
    index = state[instanceName].map(function (el) {
      return (
        el.fields.title
      );
    });
    var currentIndex = index.indexOf(id);
    // if project not open, open selected project index, set state to open and re-render
    if (state[instanceName + 'open'] == false) {
      state['current'+ instanceName] = currentIndex;
      state[instanceName + 'open'] = true;
    }
    else if (state[instanceName + 'open'] == true && state['current' + instanceName] != currentIndex) {
      actions.closeProjects(state[instanceName][state['current' + instanceName]].fields.title , shapes.compoundPaths[state['current' + instanceName]], instance, state['current' + instanceName]);
      state['current'+ instanceName] = currentIndex;
      state[instanceName + 'open'] = true;
    }
    else {
      actions.closeProjects(id, shape, instance);
    }

    render(state);

    pagerRectangle = Snap.selectAll('.slide .pager-item path')[currentIndex];

    animateToRectangle();
  },
  closeProjects: function(id, shape, instance, targetId) {
    var instanceName = instance.toString(),
    index = state[instanceName].map(function (el) {
      return (
        el.fields.title
      );
    });
    var currentIndex = index.indexOf(id);

    if (targetId) {
        pagerTriangle = Snap.selectAll('.slide .pager-item path')[targetId];
    }
    else {
      state[instanceName + 'open'] = false;
      state['current'+ instanceName] = false;
      pagerTriangle = Snap.selectAll('.slide .pager-item path')[currentIndex];
    }

    render(state);

    if (shape) {
      setTimeout(function(){
        animateToTriangle(shape);
      }, 50);
    }
  },
  setActive: function(id, instance) {
    // console.log(id, instance);
    var instanceName = instance.toString(),
    index = state[instanceName].map(function(el){
      return (
        el.fields.pieceTitle
      );
    });
    var currentIndex = index.indexOf(id);
    state['current'+ instanceName] = currentIndex;
    state[instanceName + 'open'] = true;
    render(state);
  }
}

// Ajax gubbins to get projects from JSON - instantiate, call open method, define onload method as successful response callback caveated on response time, error handler
function getData(dataset) {

  return new Promise(function(resolve, reject) {

      state[dataset] = new Array();


      content.getEntries({
        'content_type': (dataset == "projects") ? 'portfolioItem' : 'artPiece',
        order: 'sys.createdAt'
      }).then(function (entries) {
        state[dataset].push.apply(state[dataset], entries.items);
      }).then(function() {
        if(state[dataset].length > 0) {
          resolve(true);
        }
        else {
          reject(Error('failed to connect'));
        }
      });
    });
  }

getData('projects').then(function(response) {
  render(state);
}, function(error) {
  console.log(error);
});
getData('art').then(function(response) {
  console.dir(state);
  render(state);
}, function(error) {
  console.log('no dice');
});


class Portfolio extends React.Component {
  render() {
    var instanceName = this.props.instance;
    var portfolio;

    // DEPRECATING: conditional view of portfolio active/inactive
    // if (state[instanceName + 'open']) {
    //   portfolio = <div className="detail"><Close data={this.props.data} instance={this.props.instance}/><Projects data={this.props.data} instance={this.props.instance}/><Controls data={this.props.data} instance={this.props.instance} /></div>;
    // }

    return (
      <div className="portfolio">
      <Projects data={this.props.data} instance={this.props.instance} />
      </div>
    );
  }
  componentDidMount() {
    var instanceName = this.props.instance;
    state['current' + instanceName] = false;
    state[instanceName + 'open'] = false;
  }
}




class Project extends React.Component {
  render() {
    var classes = classNames({
      'slide': true,
      'slide--active': this.props.active
    }),
    expandedInfo = <div className="detail" dangerouslySetInnerHTML={{__html: converter.makeHtml(this.props.text)}}></div>;
    return (
      <div className={classes}>
        <div className="project-image">
          <Clip shape={this.props.shape} imagePath={this.props.imagePath} instance={this.props.instance} />
        </div>
        <div className="project-info">
          <h2>{this.props.title}</h2>
          <h3>Url: <a href={"http://href.li/?" + this.props.subtitle} target="_blank">{this.props.subtitle}</a></h3>
          {this.props.tags ? <Tags tags={this.props.tags} /> : null}
          <ReactCSSTransitionGroup transitionName="detail" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {this.props.active ? expandedInfo : null}
          </ReactCSSTransitionGroup>
          <ExpandButton id={this.props.id} shape={this.props.shape} instance={this.props.instance} active={this.props.active} />
        </div>
      </div>
    );
  }
  componentDidMount() {
    // $('.project-info').perfectScrollbar({suppressScrollX: true});
    // console.log(state);
  }
  componentDidUpdate() {
    // $('.project-info').perfectScrollbar({suppressScrollX: true});
  }
}



class Projects extends React.Component {
  componentDidUpdate() {
    // pagerTriangle = Snap.selectAll('.portfolio:not(.portfolio-active) .pager-item path');
    // animateToTriangle();
  }
  render() {
    var instanceProp = this.props.instance,
    activeNode = state['current' + instanceProp];
    var paginationNodes = this.props.data.map(function(paginationNode, index) {
      var isActive = activeNode === index;
      return (
        <Project id={paginationNode.fields.title} shape={shapes.compoundPaths[index]} active={isActive} key={paginationNode.fields.title} title={paginationNode.fields.title} subtitle={paginationNode.fields.liveUrl} text={paginationNode.fields.rundown} imagePath={paginationNode.fields.screenshot.fields.file.url} tags={paginationNode.fields.tags} instance={instanceProp} />
      );
    });
    return (
      <div className="pagination">
      {paginationNodes}
      </div>
    );
  }
}

class Gallery extends React.Component {
  render() {
    var instanceProp = this.props.instance,
    activeNode = state['current' + instanceProp],
    classes = classNames({
      "gallery-container" : true,
      "gallery-container--active" : state[instanceProp + 'open']
    });

    var paginationNodes = this.props.data.map(function(paginationNode, index) {
      var isActive = activeNode === index;
      return (
        <GalleryThumbnail id={paginationNode.fields.pieceTitle} active={isActive} key={paginationNode.fields.pieceTitle} title={paginationNode.fields.pieceTitle} shape={shapes.simplePaths[index]} fullImage={paginationNode.fields.fullImage.fields.file.url} thumbnailImage={paginationNode.fields.thumbnail.fields.file.url} media={paginationNode.fields.media} instance={instanceProp} />
      );
    });

    var previousNode = activeNode == 0 ? paginationNodes.length - 1 : activeNode - 1,
    nextNode = activeNode == paginationNodes.length - 1 ? 0 : activeNode + 1;

    if (state[instanceProp + "open"]) {
      var galleryView = <div className="gallery-view" key="gallery-active" ><Close instance={instanceProp} /><div className="prev"><ControlPrev instance={instanceProp} referenceNode={paginationNodes[previousNode].props} /></div><div className="featured-item">{paginationNodes[activeNode]}</div><div className="next"><ControlNext instance={instanceProp} referenceNode={paginationNodes[nextNode].props}  /></div></div>;
    }
    else {
      var galleryView = <div className="pagination" key="gallery-inactive">{paginationNodes}</div>;
    }

    return (
      <div className={classes}>
        <ReactCSSTransitionGroup transitionName="artOverlay" transitionEnterTimeout={800} transitionLeaveTimeout={100}>
          {galleryView}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
  componentDidMount() {
    state["" + this.props.instance + 'open'] = false;
  }
}

class GalleryThumbnail extends React.Component {
  render() {
    if(this.props.active) {
      var imageView =  <div><img src={this.props.fullImage} alt="placeholder" /><div className="gallery__info"><h2>{this.props.title}</h2><p>{this.props.media}</p><div><a href={this.props.fullImage} className="expand-button" target="_blank">View in New Tab <svg viewBox="0 0 11 11"><use xlinkHref="images/arrow.svg#arrow"></use></svg></a></div></div></div>;
    }
    else {
      var imageView = <Clip imagePath={this.props.thumbnailImage} shape={this.props.shape} />;
    }
    return (
      <div className="gallery__thumbnail" onClick={this.setActive.bind(this)}>
        {imageView}
      </div>
    );
  }
  setActive() {
    actions.setActive(this.props.id, this.props.instance);
  }
}

class ControlPrev extends React.Component {
  togglePrev() {
    actions.togglePrev(this.props.instance);
  }
  render() {
    return (
      <div className="toggle-prev toggle" onClick={this.togglePrev.bind(this)}>
        <Clip imagePath={this.props.referenceNode.thumbnailImage} shape={this.props.referenceNode.shape} />
        <span>&lt;</span>
      </div>
    );
  }
}
class ControlNext extends React.Component {
  toggleNext() {
    actions.toggleNext(this.props.instance);
  }
  render() {
    return (
      <div className="toggle-next toggle" onClick={this.toggleNext.bind(this)}>
        <Clip imagePath={this.props.referenceNode.thumbnailImage} shape={this.props.referenceNode.shape} />
        <span>&gt;</span>
      </div>
    );
  }
}

class Tags extends React.Component {
  render() {
    var tags = this.props.tags.map(function(tag, index) {
      return (
        <li key={tag} className="tag">{tag}</li>
      );
    });
    return (
      <ul className="tag-list">
      {tags}
      </ul>
    );
  }
}

class ExpandButton extends React.Component {
  render() {
    var classes = classNames({
      "expand-button" : true,
      "expand-button--active" : this.props.active
    });
    return (
      <div>
        <button onClick={this.toggleSlide.bind(this)} className={classes}>
          {this.props.active ? "Close" : "View Details" }
          <svg viewBox="0 0 11 11">
            <use xlinkHref="images/arrow.svg#arrow"></use>
          </svg>
        </button>
      </div>
    );
  }
  toggleSlide() {
      actions.toggleSlide(this.props.id, this.props.shape, this.props.instance);
  }
}

class Clip extends React.Component {
  render() {
    var id = uniqueId();
    // fallbackShape = state[this.props.instance + 'open'] ? "M0,11h11V5.5V0H0v5.5V11z" : "M5.5,0.7L2.7 5.5 0 10.3 11 10.3z";
    return (
      <svg viewBox="0 0 11 11" className="pager-item">
        <defs>
          <pattern id={id} x="10" y="10" width="1" height="1" patternUnits="objectBoundingBox">
            <image xlinkHref={this.props.imagePath} x="0" y="-3.5" width="12" height="17" />
          </pattern>
        </defs>
        <path fill={"url(#" + id + ")"} d={this.props.shape} />
      </svg>
    );
  }
}



function render(state) {
  ReactDOM.render(
    <Portfolio data={state.projects} instance="projects"/>,
    document.getElementById('projects-app')
  );
  ReactDOM.render(
    <Gallery data={state.art} instance="art"/>,
    document.getElementById('art-app')
  );
}

function animateToRectangle() {
  let squarePoints = "M0,11h11V5.5V0H0v5.5V11z";
  pagerRectangle.animate({ d: squarePoints }, 1000, mina.easeinout);
}
function animateToTriangle(shape) {
  pagerTriangle.animate({ d: shape }, 1000, mina.easeinout);
}

class Close extends React.Component {
  closeProjects() {
    actions.closeProjects(false, false, this.props.instance);
  }
  render() {
    return (
      <button className="close-button" onClick={this.closeProjects.bind(this)}>X</button>
    );
  }
}

// DEPRECATING: CONTROLS COMPONENT
// class Controls extends React.Component {
//   togglePrev() {
//     actions.togglePrev(this.props.instance);
//   }
//   toggleNext() {
//     actions.toggleNext(this.props.instance);
//   }
//   render() {
//     return (
//       <div className="controls">
//       <div className="toggle-prev toggle" onClick={this.togglePrev.bind(this)}>&lt;</div>
//       <div className="toggle-next toggle" onClick={this.toggleNext.bind(this)}>&gt;</div>
//       </div>
//     );
//   }
// }

// DEPRECATING: OLD ACTIVE PROJECTS VIEW
// class DEPRECATED_PROJECTS extends React.Component {
//   render() {
//     var instanceName = this.props.instance;
//     var slidesNodes = this.props.data.map(function (slideNode, index) {
//       var isActive = state['current' + instanceName] === index;
//       return (
//         <Project active={isActive} key={slideNode.id} imagePathFull={slideNode.imagePathFull} imageAlt={slideNode.imageAlt} title={slideNode.title} subtitle={slideNode.subtitle} text={slideNode.text} action={slideNode.action} actionHref={slideNode.actionHref} />
//       );
//     });
//     return (
//       <div className="projects">
//       {slidesNodes}
//       </div>
//     );
//   }
// }

// DEPRECATING: OLD PROJECT PAGER WRAPPER COMPONENT
// class DEPRECATED_PROJECT extends React.Component {
//   toggleSlide() {
//     actions.toggleSlide(this.props.id, this.props.instance);
//   }
//   render() {
//     var classes = classNames({
//       "pager" : true,
//       "pager-active" : this.props.active
//     });
//     return (
//       <span className={classes} onClick={this.toggleSlide.bind(this)}>
//         <Clip imagePath={this.props.imagePath} instance={this.props.instance} />
//       </span>
//     );
//   }
// }
