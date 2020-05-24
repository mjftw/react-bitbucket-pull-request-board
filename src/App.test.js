import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('"Connect to Bitbucket" button renders', () => {
    const {getByText} = render(<App />);
    expect(getByText('Connect to Bitbucket')).toBeInTheDocument();
});