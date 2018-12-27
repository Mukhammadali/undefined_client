import React from 'react'
import { branch, renderComponent, compose } from 'recompose';
import { Spin } from 'antd';

const Error = () => <div>Error :( </div>;
const Loading = () => <Spin size="large" />

export const handleQueryLoadingError = (queryName = 'data') =>
  compose(
    branch(props => props[queryName].error, renderComponent(Error)),
    branch(props => props[queryName].loading, renderComponent(Loading))
  );

export const handleQueryLoading = (queryName = 'data') =>
  compose(
    branch(props => props[queryName].loading, renderComponent(Loading))
  );
