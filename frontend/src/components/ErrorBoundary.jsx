import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    navigator.sendBeacon?.('/api/errors', JSON.stringify({
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack
    }));
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="error-screen">
        <AlertTriangle size={44} />
        <h1>কিছু সমস্যা হয়েছে</h1>
        <p>এই অংশটি লোড করা যায়নি। আবার চেষ্টা করুন।</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          <RotateCcw size={17} /> আবার চেষ্টা করুন
        </button>
      </main>
    );
  }
}