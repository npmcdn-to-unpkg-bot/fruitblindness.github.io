// Fetch API import
import 'fetch';

// React import
import React from 'react';

// ReactDOM import
import ReactDOM from 'react-dom';

//React-router import
import {Router, Route, Link} from 'react-router';

// classNames module - classSet deprecated
import classNames from'classnames';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {state} from 'scripts/app/state';

const uniqueId = (function() {
  var count = 0;
  return function() {
    return 'id' + count++;
  }
})();

var pagerTriangle = [];

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
  toggleSlide: function(id, instance) {
    var instanceName = instance.toString(),
    index = state[instanceName].map(function (el) {
      return (
        el.id
      );
    });
    var currentIndex = index.indexOf(id);
    state['current'+ instanceName] = currentIndex;
    // if project not open, open selected project index, set state to open and re-render
    if (state[instanceName + 'open'] == false) {
      state[instanceName + 'open'] = true;
    }
    render(state);

    pagerTriangle = Snap.selectAll('#' + instance + '-app .pager-item path');

    if (state[instanceName + 'open'] == false) {
        animateToTriangle();
    }
    else {
        animateToRectangle();
    }
  },
  closeProjects: function(instance) {
    var instanceName = instance.toString();
    state[instanceName + 'open'] = false;
    render(state);

    pagerTriangle = Snap.selectAll('#' + instance + '-app .pager-item path');

    if (state[instanceName + 'open'] == false) {
        animateToTriangle();
    }
    else {
        animateToRectangle();
    }
  }
}

// Ajax gubbins to get projects from JSON - instantiate, call open method, define onload method as successful response callback caveated on response time, error handler
function getData(dataset) {

  return new Promise(function(resolve, reject){
    var dataRequest = new XMLHttpRequest();
    dataRequest.open('GET', dataset +'.json', true);
    dataRequest.onload = function() {
      if (dataRequest.status >= 200 && dataRequest.status < 400) {
        var data = JSON.parse(dataRequest.responseText),
        dataName = dataset.toString(),
        dataLength = Object.keys(data).length;

        // Add data array to state
        state[dataName] = new Array();

        // Loop through objects in object returned by parsed JSON, add to data array in state
        for (var key in data) {
          // Discount objects from prototypec
          if (!data.hasOwnProperty(key)) continue;
          let obj = data[key];
          state[dataName].push(obj);
          if (dataLength === state[dataName].length) {
            resolve(true);
          }
        }
      } else {
        reject(Error(dataRequest.statusText));
      }
    };

    dataRequest.onerror = function() {
      reject(Error("connection error"));
    };

    // Fire ajax request
    dataRequest.send();
  });
}

getData('projects').then(function(response) {
  // console.log(response);
  getData('art').then(function(response) {
    // console.log(response);
    render(state);
  }, function(error) {
    // console.log('no dice');
  });
}, function(error) {
  console.log('no dice');
});


class Portfolio extends React.Component {
  render() {
    var instanceName = this.props.instance,
    classes = classNames({
      "portfolio" : true,
      "portfolio-active" : state[instanceName + 'open']
    });
    var portfolio;
    if (state[instanceName + 'open']) {
      portfolio = <div className="detail"><Close data={this.props.data} instance={this.props.instance}/><Projects data={this.props.data} instance={this.props.instance}/><Controls data={this.props.data} instance={this.props.instance} /></div>;
    }
    return (
      <div className={classes}>
      <ReactCSSTransitionGroup transitionName="detail" transitionEnterTimeout={500} transitionLeaveTimeout={900}>
      {portfolio}
      </ReactCSSTransitionGroup>
      <Pagination data={this.props.data} instance={this.props.instance} />
      </div>
    );
  }
  componentDidMount() {
    var instanceName = this.props.instance;
    state['current' + instanceName] = 0;
    state[instanceName + 'open'] = false;
    pagerTriangle = Snap.selectAll('.portfolio:not(.portfolio-active) .pager-item path');
    animateToTriangle();
  }
}

class Close extends React.Component {
  closeProjects() {
    actions.closeProjects(this.props.instance);
  }
  render() {
    return (
      <button className="close-button" onClick={this.closeProjects.bind(this)}>X</button>
    );
  }
}

class Projects extends React.Component {
  render() {
    var instanceName = this.props.instance;
    var slidesNodes = this.props.data.map(function (slideNode, index) {
      var isActive = state['current' + instanceName] === index;
      return (
        <Project active={isActive} key={slideNode.id} imagePathFull={slideNode.imagePathFull} imageAlt={slideNode.imageAlt} title={slideNode.title} subtitle={slideNode.subtitle} text={slideNode.text} action={slideNode.action} actionHref={slideNode.actionHref} />
      );
    });
    return (
      <div className="projects">
      {slidesNodes}
      </div>
    );
  }
}

class Project extends React.Component {
  render() {
    var classes = classNames({
      'slide': true,
      'slide--active': this.props.active
    });
    return (
      <div className={classes}>
        <div className="project-image">
          <img src={this.props.imagePathFull} alt={this.props.imageAlt} />
        </div>
        <div className="project-info">
          <h2>{this.props.title}</h2>
          <h3>{this.props.subtitle}</h3>
          <p dangerouslySetInnerHTML={{__html: this.props.text}}></p>
        </div>
      </div>
    );
  }
  componentDidMount() {
    $('.project-info').perfectScrollbar({suppressScrollX: true});
  }
  componentDidUpdate() {
    $('.project-info').perfectScrollbar({suppressScrollX: true});
  }
}

class Controls extends React.Component {
  togglePrev() {
    actions.togglePrev(this.props.instance);
  }
  toggleNext() {
    actions.toggleNext(this.props.instance);
  }
  render() {
    return (
      <div className="controls">
      <div className="toggle-prev toggle" onClick={this.togglePrev.bind(this)}>&lt;</div>
      <div className="toggle-next toggle" onClick={this.toggleNext.bind(this)}>&gt;</div>
      </div>
    );
  }
}

class Pagination extends React.Component {
  componentDidUpdate() {
    pagerTriangle = Snap.selectAll('.portfolio:not(.portfolio-active) .pager-item path');
    animateToTriangle();
  }
  render() {
    var instanceProp = this.props.instance,
    activeNode = state['current' + instanceProp];
    var paginationNodes = this.props.data.map(function(paginationNode, index) {
      var isActive = activeNode === index;
      return (
        <Pager id={paginationNode.id} active={isActive} key={paginationNode.id} title={paginationNode.title} imagePath={paginationNode.imagePath} instance={instanceProp} />
      );
    });
    if (state[instanceProp + 'open'] && paginationNodes.length > 6) {
      if (activeNode > (paginationNodes.length -3)) {
        console.log(paginationNodes.length);
      }
      (activeNode < 3) ? paginationNodes = paginationNodes.slice(0, 5) : ((activeNode > (paginationNodes.length -3)) ? paginationNodes = paginationNodes.slice((paginationNodes.length - 5), paginationNodes.length) : paginationNodes = paginationNodes.slice((activeNode -2), (activeNode + 3)));
    }
    return (
      <div className="pagination">
      {paginationNodes}
      </div>
    );
  }
}

class Clip extends React.Component {
  render() {
    var id = uniqueId(),
    fallbackShape = state[this.props.instance + 'open'] ? "M0,9L11 9 11 1.7 0 1.7z" : "M5.5,0.7L2.7 5.5 0 10.3 11 10.3z";
    return (
      <svg viewBox="0 0 11 11" className="pager-item">
        <defs>
          <pattern id={id} x="10" y="10" width="1" height="1" patternUnits="objectBoundingBox">
            <image xlinkHref={this.props.imagePath} x="0" y="-3.5" width="12" height="17" />
          </pattern>
        </defs>
        <path fill={"url(#" + id + ")"} d={fallbackShape} />
      </svg>
    );
  }
}

class Pager extends React.Component {
  toggleSlide() {
    actions.toggleSlide(this.props.id, this.props.instance);
  }
  render() {
    var classes = classNames({
      "pager" : true,
      "pager-active" : this.props.active
    });
    return (
      <span className={classes} onClick={this.toggleSlide.bind(this)}>
        <Clip imagePath={this.props.imagePath} instance={this.props.instance} />
      </span>
    );
  }
}

class Blog extends React.Component {
  render() {
    return (
      <div className="blog">
        blog
      </div>
    );
  }
}

function render(state) {
  ReactDOM.render(
    <Portfolio data={state.projects} instance="projects"/>,
    document.getElementById('projects-app')
  );
  ReactDOM.render(
    <Portfolio data={state.art} instance="art"/>,
    document.getElementById('art-app')
  );
}

function animateToRectangle() {
  let squarePoints = "M0,9L11 9 11 1.7 0 1.7z";
  pagerTriangle.animate({ d: squarePoints }, 1000, mina.easeinout);
}
function animateToTriangle() {
  var triangles = ["M9.8,1.9L11,9.1L0.1,6.4L9.8,1.9z", "M11,8.1L1.7,11L0,0L11,8.1z", "M11,1.9L6.6,8.8L0,4L11,1.9z", "M11.1,10H0L5.8,1L11.1,10z", "M11,4.5l-5.2,6.3L0.1,1.2L11,4.5z", "M10.8,0.9L9.8,9.3L0.1,0.9H10.8z"];
    var e = 0;
    for (let i = 0; i < pagerTriangle.length; i++) {
      (i > 5) ? ((i === 6) ? e = 0 : ((i % 5 === 0) ? e = 0 : null)) : null;
      pagerTriangle[i].animate({ d: triangles[e] }, 1000, mina.easeinout);
      e++;
    }
}
