import React from 'react';

export class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Three.js / R3F Error Boundary Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[3, 3, 3]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      );
    }
    return this.props.children;
  }
}
