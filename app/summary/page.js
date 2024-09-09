'use client'
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import db from "../../firebase";
import { Container, Box, Card, CardContent, Typography, AppBar, Toolbar, Button, Tooltip } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

let theme = createTheme({
  palette: {
    primary: { main: "#2cbb90" },
    secondary: { main: "rgb(30, 130, 100)" },
  },
  typography: {
    fontFamily: "Quicksand",
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

export default function Summary() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [summary, setSummary] = useState("");
  const [summaryName, setSummaryName] = useState("");
  const [timestamp, setTimestamp] = useState(null); // New state for timestamp

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getSummary() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);

      let summary = "";
      let summaryName = "";
      let timestamp = null; // Variable to store the timestamp

      docs.forEach((doc) => {
        const docData = doc.data();
        if (docData && docData.info) {
          summary = docData.info;
        }
        if (docData && docData.name) {
          summaryName = docData.name;
        }
        if (docData && docData.timestamp) {
          timestamp = docData.timestamp.toDate().toLocaleString(); // Convert Firestore timestamp to date
        }
      });
      if (!summaryName && docs.size > 0) {
        summaryName = search;
      }

      setSummary(formatSummary(summary));
      setSummaryName(summaryName);
      setTimestamp(timestamp); // Set the timestamp state
    }

    getSummary();
  }, [user, search]);

  // Function to replace <strong> tags and format bullet points
  const formatSummary = (text) => {
    if (!text) return "";

    // Replace <strong> tags with bold text
    let formattedText = text.replace(/\*\*\*(.*?)\*\*\*/g, "<strong>$1</strong>");
    
    // Split bullet points into new lines and preserve line breaks
    formattedText = formattedText.split("\n").map(line => line.trim()).filter(line => line !== '').map(line => {
      return line.startsWith("•") ? `<div>${line}</div>` : `<p>${line}</p>`;
    }).join('');

    return formattedText;
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleHomeClick = () => {
    if (isSignedIn) {
      router.push("/summaries");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ backgroundColor: "#f9f9f7", borderColor: "black", width: "100%" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button color='inherit' href="/" variant="h6" sx={{ fontWeight: "700", color: "#2cbb90", marginRight: "20px" }}>
                Briefly
              </Button>
            <Tooltip title="your collection of summaries" placement="bottom" TransitionProps={{ timeout: 200 }} arrow>
              <Button href="/summaries" color="inherit" sx={{ marginRight: "10px", fontWeight: "bold" }}>
                Home
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="create a new summary" placement="bottom" TransitionProps={{ timeout: 200 }} arrow>
              <Button
                href="/generate"
                sx={{
                  borderRadius: "50%",
                  fontWeight: "bold",
                  fontSize: "30px",
                  borderColor: "rgb(30, 130, 100)",
                  minWidth: "45px",
                  height: "45px",
                  width: "45px",
                  border: "2px solid",
                  padding: "0",
                  marginRight: "20px",
                  "&:hover": {
                    backgroundColor: "#e0f7f1",
                    transition: "background-color 0.3s ease",
                  },
                }}
              >
                +
              </Button>
            </Tooltip>
            <SignedIn>
              <Box
                sx={{
                  minWidth: "45px",
                  height: "45px",
                  width: "45px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginRight: "20px",
                  border: "2px solid rgb(30, 130, 100)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <UserButton
                  appearance={{
                    elements: {
                      rootBox: {
                        width: "100%",
                        height: "100%",
                      },
                      avatarBox: {
                        width: "100%",
                        height: "100%",
                      },
                    },
                  }}
                />
              </Box>
            </SignedIn>
            <SignedOut>
              <Button color="inherit" href="/sign-in" sx={{ marginRight: "10px" }}>
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" component="div" sx={{ textAlign: "center", marginBottom: 4 }}>
          {summaryName ? summaryName : "loading summary title"}
        </Typography>

        {timestamp && (
          <Typography variant="body2" component="div" sx={{ textAlign: "center", marginBottom: 2 }}>
            Generated on: {timestamp}
          </Typography>
        )}

        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Card sx={{ width: "auto", maxWidth: "100%", padding: 5 }}>
            <CardContent>
              <Typography
                variant="body1"
                component="div"
                sx={{ textAlign: "left", wordWrap: "break-word" }}
                dangerouslySetInnerHTML={{ __html: summary ? summary : "loading summary.." }}
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
