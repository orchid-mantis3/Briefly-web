'use client'
import { Box, Paper, TextField, Typography, Button, Card, Toolbar, AppBar, Tooltip, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, Checkbox } from "@mui/material"
import { Container, Grid } from '@mui/material' 
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { useUser } from "@clerk/nextjs" 
import { getDoc, doc, collection, writeBatch, serverTimestamp } from "firebase/firestore"
import db from "../../firebase"
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from "@emotion/react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

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
})

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
})

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [summaries, setSummaries] = useState('') 
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [timestamp, setTimestamp] = useState(null)
  const [open, setOpen] = useState(false) 
  const [bulletPoints, setBulletPoints] = useState(false) // State to track if bullet points are requested
  const router = useRouter()

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate a summary.')
      return
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ 
          text, 
          bulletPoints 
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (data && Array.isArray(data.summary) && data.summary.length > 0) {
        let summaryText = data.summary[0].info
        setTimestamp(new Date().toLocaleString())
        summaryText = summaryText.replace(/\* \*\*(.*?)\*\*/g, '<strong>$1</strong>')
        if (bulletPoints) {
            summaryText = summaryText.split('\n').filter(line => line.trim() !== '').map(line => `• ${line}`).join('\n')        
        }

        setSummaries(summaryText)
      } else {
        alert('No summary was returned.')
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
      alert('Error generating summary.')
    }
  }

  const handleOpen = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const saveSummaries = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().summaries || []
      if (collections.find((f) => f.name === name)) {
        alert("Summary with the same name already exists.")
        return
      } else {
        collections.push({ name })
        batch.set(userDocRef, { summaries: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { summaries: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    const cardDocRef = doc(colRef)
    batch.set(cardDocRef, { info: summaries, timestamp: serverTimestamp() })

    await batch.commit()
    handleClose()
    router.push('/summaries')
  }
  const handleHomeClick = () => {
    if (isSignedIn) {
      router.push('/summaries');
    } else {
      router.push('/sign-in');
    }
  };
  return (
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
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4">Generate Summary</Typography>
          <Paper sx={{ p: 4, width: "100%" }}>
            <TextField 
              value={text}
              onChange={(e) => setText(e.target.value)} 
              label="article link along with any additional instructions you'd like our AI to follow" 
              fullWidth 
              multiline 
              rows={4} 
              variant="outlined" 
              sx={{ mb: 2}} 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.checked)} 
                  name="bulletPoints" 
                  color="primary" 
                />
              }
              label="generate summary with bullet points"
            />
            <Button variant="contained" onClick={handleSubmit} fullWidth>Summarize Article</Button>
          </Paper>
        </Box>

        {summaries && summaries.length > 0 && (
          <>
            <Typography variant="h5" sx={{textAlign: 'center' }}>Summary</Typography>
            {timestamp && (
                          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>Generated on: {timestamp}</Typography>
                        )}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{
                      perspective: '1000px',
                      position: 'relative',
                      width: '100%',
                      minHeight: '200px',
                      boxShadow: '0 4px 8px 0 rgb(0,0,0,0.2)',
                    }}>
                      {/* Render the summary with HTML formatting */}
                      <Typography variant="body1" component="div" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: summaries }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleOpen}>Save</Button>
            </Box>
          </>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Summary</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your summary.
            </DialogContentText>
            <TextField 
              autoFocus 
              margin="dense" 
              label="Summary Name" 
              type="text" 
              fullWidth 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              variant="outlined" 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveSummaries}>Save</Button>
          </DialogActions>
        </Dialog> 
      </Container>
    </ThemeProvider>
  )
}
