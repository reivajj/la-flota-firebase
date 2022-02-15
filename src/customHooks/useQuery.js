import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => QueryString.parse(search), [search]);
}

export default useQuery;