import { Component } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, RefreshCw } from 'lucide-react'

export default class RouteErrorBoundary extends Component {
  state = { error: null, retryKey: 0 }

  static getDerivedStateFromError(error) { return { error } }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('Page render failed', error, info.componentStack)
  }

  retry = () => window.location.reload()

  render() {
    if (this.state.error) return <main className="route-recovery" key="recovery"><span><BookOpen /></span><p className="eyebrow">A moment in the margins</p><h1>Something interrupted this page.</h1><p>Your journal is still here. Let's try opening it again.</p><div><button className="button button-secondary" onClick={this.retry}><RefreshCw /> Try again</button><Link className="button button-primary" to="/app">Go to your journal</Link></div></main>
    return <div key={this.state.retryKey}>{this.props.children}</div>
  }
}
