import React, { useEffect } from 'react';
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
  return `${protocol}://${domain}`;
}

const fetchData = async (keyword, host = '') => {
  const url = new URL(`${host}/api/shops`);
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }

    throw new Error(`Network response was not ok.`);
  } catch (e) {
    /* handle error */
    console.error(e);
    return [];
  }
};

const Shops = ({ firstViewShops }) => {
  const [keyword, setKeyword] = React.useState('');
  const [shops, setShops] = React.useState([]);

  useEffect(() => {
    setShops(firstViewShops);
  }, [firstViewShops]);

  const onSearchClick = async () => {
    const data = await fetchData(keyword);

    setShops(data);
    setKeyword('');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        component="form"
        noValidate
        maxWidth="md"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          label="キーワードを入力してください"
          variant="standard"
          margin="normal"
          fullWidth
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
          }}
        />
        <Button
          variant="contained"
          margin="normal"
          fullWidth
          onClick={() => {
            onSearchClick();
          }}
        >
          検索
        </Button>
      </Box>
      <Box
        component="form"
        noValidate
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <List>
          {shops.map((shop) => {
            return (
              <ListItem key={shop.id}>
                <ListItemButton
                  onClick={() => {
                    // TODO: goto shop detail
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={shop.name} src={shop.logo_image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${shop.genre.name} ${shop.name}`}
                    secondary={
                      <>
                        <Typography variant="body1" component="span">
                          {`${shop.catch} ${shop.shop_detail_memo}`}
                        </Typography>
                        <Typography variant="caption">{shop.address}</Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Container>
  );
};

export const getServerSideProps = async (req) => {
  const host = getDomain();
  const data = await fetchData(req.query.keyword, host);

  return {
    props: {
      firstViewShops: data,
    },
  };
};

export default Shops;
