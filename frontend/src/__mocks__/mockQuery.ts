import { useEffect, useState } from 'react';

import { Post } from '../types';

import mock from './mockData';

export function useMockPostQuery(delay = 1000, simulateError = false) {
  const [data, setData] = useState<Array<Post> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(mock.posts);
    setError('');
    setLoading(true);

    const id = setTimeout(() => {
      if (simulateError) {
        setError(t('Something unexpected happened'));
      }
      setLoading(false);
    }, delay);

    return () => clearTimeout(id);
  }, [simulateError, delay]);

  return { data, error, loading };
}
