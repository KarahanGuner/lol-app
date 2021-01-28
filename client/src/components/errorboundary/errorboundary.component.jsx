import React, { Component } from 'react';
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
      return <h1>Uh oh! Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;