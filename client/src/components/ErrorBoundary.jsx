import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans,sans-serif', padding: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>◈</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#C9A84C', marginBottom: 8 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <button onClick={() => window.location.reload()}
              style={{ background: '#C9A84C', color: '#0D0D0D', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
