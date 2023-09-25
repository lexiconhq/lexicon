import React from 'react';
import { Redirect } from 'react-router-dom';

export default function Home() {
  return <Redirect to="/version-2.0.0-beta" />;
}
