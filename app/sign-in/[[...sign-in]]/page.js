'use client'
import { SignIn, useAuth, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Container, Button, Box, createTheme, Tooltip} from "@mui/material";
import "/app/globals.css"
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
const handleHomeClick = () => {
  if (isSignedIn) {
    router.push('/summaries');
  } else {
    router.push('/sign-in');
  }
};
export default function SignUpPage(){
    return(
      <ThemeProvider theme={theme}>
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
                          width: '100%',
                          height: '100%',
                        },
                        avatarBox: {
                          width: '100%',
                          height: '100%',
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
    <Container maxWidth='md' sx={{ mt: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4">Sign In</Typography>
            <SignIn />
        </Box>
    </Container>
    </ThemeProvider>
    )
}