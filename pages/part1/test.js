import React, { useEffect } from 'react';
import { cookies } from 'next/headers';

import getConfig from 'next/config';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

function getDomain() {
  const environment = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const isProduction = environment === 'production';
  const isStaging = environment === 'staging';
  const protocol = isProduction || isStaging ? 'https' : 'http';

  const domain = process.env.NEXT_PUBLIC_VERCEL_URL ? process.env.NEXT_PUBLIC_VERCEL_URL : 'localhost:3000';

  if (!isProduction && domain === 'localhost:3000') {
    return `${protocol}://${domain}`;
  }

  return `${protocol}://${domain}`;

  // const hostnameSplit = urlObject.hostname.split('.');
  // const subdomain = hostnameSplit[0].split('-')[0];
  // const secondLevelDomain = hostnameSplit[1];
  // const topLevelDomain = hostnameSplit[2];
  //
  // const finalDomain = `${subdomain}.${secondLevelDomain}.${topLevelDomain}`;
  // return `${protocol}://${finalDomain}`;
}

const fetchData = async (keyword, host = '', cookies) => {
  const url = new URL(`${host}/api/shops`);
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    const options = { headers: { 'Content-Type': 'application/json' } };
    // if (cookies) options.headers.Cookie = cookies;
    // { Cookie: `_vercel_jwt=${jwtCookie}` }

    const { _vercel_jwt } = cookies;
    if (_vercel_jwt) options.Authorization = `Bearer ${_vercel_jwt}`;
    // if (_vercel_jwt) options.Cookie = `_vercel_jwt=${_vercel_jwt}`;
    if (_vercel_jwt) options.Cookie = cookies;

    console.log(options);
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    }

    const debug = {
      status: response.status,
      ok: response.ok,
      url,
    };
    throw new Error(`Network response was not ok.${JSON.stringify(debug)}`);
  } catch (e) {
    /* handle error */
    console.error(e);
    return [];
  }
};

const Shops = ({ firstViewShops, debug }) => {
  const [keyword, setKeyword] = React.useState('');
  const [shops, setShops] = React.useState([]);

  useEffect(() => {
    setShops(firstViewShops);
  }, [firstViewShops]);

  const onSearchClick = async () => {
    const data = await fetchData(keyword);
    if (data) {
      setShops(data);
    }
    setKeyword('');
  };

  return (
    <Container component="main" maxWidth="md">
      {JSON.stringify(debug ?? {})}
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const host = getDomain();
  const cookies = context.req.cookies;
  const data = await fetchData(context.query.keyword, host, cookies);

  const query = new URLSearchParams();
  const keyword = context.query.keyword;
  if (keyword) query.set('keyword', keyword);
  const url = `${host}/api/shops?${query.toString()}`;

  return {
    props: {
      firstViewShops: data ?? [],
      debug: {
        host,
        url,
        cookies,
        query: keyword ?? 'nah',
        length: data?.length ?? -1,
      },
    },
  };
};

export default Shops;
