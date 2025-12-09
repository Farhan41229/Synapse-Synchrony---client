import React from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/HomePage/Home';
import AuthLayout from '@/layouts/AuthLayout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ index: true, Component: Home }],
  },
  {
    path: '/auth',
    Component: AuthLayout,
  },
]);

export default router;
