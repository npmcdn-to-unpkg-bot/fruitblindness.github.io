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

import {state} from 'scripts/app/state';

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
    console.log(state['current'+ instanceName]);
  },
  toggleSlide: function(id, instance) {
    var instanceName = instance.toString();
    var index = state[instanceName].map(function (el) {
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
  },
  closeProjects: function(instance) {
    var instanceName = instance.toString();
    state[instanceName + 'open'] = false;
    render(state);
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
  console.log(response);
  render(state);
}, function(error) {
  console.log('no dice');
});
getData('art').then(function(response) {
  console.log(response);
  render(state);
}, function(error) {
  console.log('no dice');
});
// setTimeout(function(){
//     getData('art');
// }, 500);


class Portfolio extends React.Component {
  render() {
    var instanceName = this.props.instance;
    var portfolio;
    if (state[instanceName + 'open']) {
      portfolio = <div><Close data={this.props.data} instance={this.props.instance}/><Projects data={this.props.data} instance={this.props.instance}/><Controls data={this.props.data} instance={this.props.instance} /><Pagination data={this.props.data} instance={this.props.instance}/></div>;
    }
    else {
      portfolio = <div><Pagination data={this.props.data} instance={this.props.instance} /></div>;
    }
    return (
      <div className="portfolio">
      {portfolio}
      </div>
    );
  }
  componentDidMount() {
    var instanceName = this.props.instance;
    state['current' + instanceName] = 0;
    state[instanceName + 'open'] = false;
  }
}

class Close extends React.Component {
  closeProjects() {
    actions.closeProjects(this.props.instance);
  }
  render() {
    return (
      <button onClick={this.closeProjects.bind(this)}>X</button>
    );
  }
}

class Projects extends React.Component {
  render() {
    var instanceName = this.props.instance;
    var slidesNodes = this.props.data.map(function (slideNode, index) {
      var isActive = state['current' + instanceName] === index;
      return (
        <Project active={isActive} key={slideNode.id} imagePath={slideNode.imagePath} imageAlt={slideNode.imageAlt} title={slideNode.title} subtitle={slideNode.subtitle} text={slideNode.text} action={slideNode.action} actionHref={slideNode.actionHref} />
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
      <img src={this.props.imagePath} alt={this.props.imageAlt} />
      <h2>{this.props.title}</h2>
      <h3>{this.props.subtitle}</h3>
      <p>{this.props.text}</p>
      <a href={this.props.actionHref}>{this.props.action}</a>
      </div>
    );
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
  render() {
    var instanceProp = this.props.instance;
    var paginationNodes = this.props.data.map(function(paginationNode, index) {
      return (
        <Pager id={paginationNode.id} key={paginationNode.id} title={paginationNode.title} instance={instanceProp} />
      );
    });
    return (
      <div className="pagination">
      {paginationNodes}
      </div>
    );
  }
}

class Pager extends React.Component {
  toggleSlide() {
    actions.toggleSlide(this.props.id, this.props.instance);
  }
  render() {
    return (
      <span className="pager" onClick={this.toggleSlide.bind(this)}>{this.props.title}</span>
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
    document.getElementById('portfolio-app')
  );
  ReactDOM.render(
    <Portfolio data={state.art} instance="art"/>,
    document.getElementById('art-app')
  );
}
