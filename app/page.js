'use client'
import Image from "next/image";
import getStripe from "../utils/get-stripe";
import {SignedIn,SignedOut, UserButton, useAuth} from '@clerk/nextjs';
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Tooltip} from "@mui/material";
import Head from 'next/head';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import { useRouter } from 'next/navigation';

let theme = createTheme({
  palette: {
    primary: {
      main: '#2cbb90',
    },
    secondary: {
      main: 'rgb(30, 130, 100)',
    },
  },
  typography: {
    fontFamily: 'Quicksand',
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleHomeClick = () => {
    if (isSignedIn) {
      router.push('/summaries');
    } else {
      router.push('/sign-in');
    }
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: "http://local:3000",
      },
    });
    const checkoutSessionJson = await checkoutSession.json();
    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Briefly</title>
        <meta name="description" content="study in your own way" />
      </Head>
      <Box sx={{ width: '100vw' }}>
        <AppBar position="static" sx={{ backgroundColor: "#f9f9f7", borderColor: "black", width: '100%' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color='inherit' href="/" variant="h6" sx={{ fontWeight: "700", color: "#2cbb90", marginRight: "20px" }}>
                Briefly
              </Button>
              <Tooltip
                title="your collection of summaries"
                placement="bottom"
                TransitionProps={{ timeout: 200 }}
                arrow
              >
                <Button onClick={handleHomeClick} color='inherit' sx={{ marginRight: '10px', fontWeight: 'bold' }}>Home</Button>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip
                title="create a new summary"
                placement="bottom"
                TransitionProps={{ timeout: 200 }}
                arrow
              >
                <Button
                  href="/generate"
                  sx={{
                    borderRadius: '50%',
                    fontWeight: 'bold',
                    fontSize: "30px",
                    borderColor: 'rgb(30, 130, 100)',
                    minWidth: '45px',
                    height: '45px',
                    width: '45px',
                    border: '2px solid',
                    padding: '0',
                    marginRight: '20px',
                    '&:hover': {
                      backgroundColor: '#e0f7f1',
                      transition: 'background-color 0.3s ease',
                    }
                  }}
                >
                  +
                </Button>
              </Tooltip>
              <SignedIn>
                  <Box sx={{ 
                    minWidth: '45px', 
                    height: '45px', 
                    width: '45px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    marginRight: '20px', 
                    border: '2px solid rgb(30, 130, 100)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}>
                  <UserButton
                    appearance={{
                      elements: {
                        rootBox: {
                          width: '100%',  // Ensures the UserButton takes the full width
                          height: '100%', // Ensures the UserButton takes the full height
                        },
                        avatarBox: {
                          width: '100%',  // Adjust avatar width if needed
                          height: '100%', // Adjust avatar height if needed
                        },
                      },
                    }}
                  />
                </Box>
              </SignedIn>
              <SignedOut>
                <Button color='inherit' href="/sign-in" sx={{ marginRight: '10px' }}>Login</Button>
                <Button color='inherit' href="/sign-up">Sign Up</Button>
              </SignedOut>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to <Typography gutterBottom sx={{ fontWeight: 'bold', fontSize: "1.5em", color: "#2cbb90" }}>Briefly</Typography>
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: '500' }}>
            {' '}The easiest way to make summaries from your articles{' '}
          </Typography>
          <Button variant="contained" href="generate" sx={{ mt: 2 }}>Get Started</Button>
        </Box>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: '600' }} gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography>
                {' '}Simply input your text and let our software do the rest. Learning material has never been easier.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Smart Summaries</Typography>
              <Typography>
                {' '}Our AI intelligently breaks down your articles into concise summaries perfect for studying.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
              <Typography>
                {' '}Access your summaries from any device, at any time. Study on the go with ease.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 6, textAlign: "center"}}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: '600' }}>Donate</Typography>
              <Box sx={{ p: 3, border: '1px solid', borderColor: '#e5e3d9', borderRadius: 2, backgroundColor: "#efeee8", justifyContent: 'center'}}>
                <Typography variant="h5" gutterBottom>Support the Developers</Typography>
                <Typography variant="h6" gutterBottom>$1 / one time payment</Typography>
                <Typography>A little goes a long way.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Donate</Button>
              </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
