import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './errorboundary.styles.css';
class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = {
      hasError: false
    };
  }
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (<div className="error-page"><h1>Uh oh! Something went wrong.</h1><Link style={{textDecoration: 'none', color: '#e7effa'}} to="/"><div>Click to Return Home</div></Link></div>)
    }
    return this.props.children;
  }
}

export default ErrorBoundary;