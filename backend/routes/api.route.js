const router = require("express").Router();
const { google } = require("googleapis");

// Use environment variables or secure storage for sensitive data like secrets and tokens
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "1088234797181-l4aalmn8bdt4nhb302ktqrbmk6ak1pcg.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "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";
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3001";

// Placeholder for refresh token – you should save this securely after the OAuth flow
let refresh_token = "YOUR_REFRESH_TOKEN";
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Health check endpoint
router.get("/", async (req, res, next) => {
  res.send({ message: "API is working 🚀" });
});

// Route to handle OAuth2 token creation
router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    console.log(code);
    // Exchange authorization code for access token and refresh token
    const response = await oauth2Client.getToken(code);
    const tokens = response.tokens;
    console.log("response", tokens);
    console.log("refresh_token initial", refresh_token);
    console.log("refresh_token", tokens.refresh_token);
    // Store the refresh token securely (for future use)
    refresh_token = tokens.refresh_token;
    console.log("refresh_token", refresh_token);

    res.send(tokens);
  } catch (error) {
    console.error("Error in token generation:", error.message);
    next(error);
  }
});

// Route to handle calendar event creation
router.post("/create-event", async (req, res, next) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;

    // Set OAuth2 credentials, using refresh_token to refresh access token if needed
    console.log("refresh token", refresh_token);
    oauth2Client.setCredentials({ refresh_token });

    // Initialize Google Calendar API client
    const calendar = google.calendar("v3");

    // Insert a new event into the user's primary calendar
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: "7", // Optional: Set event color
        start: {
          dateTime: new Date(startDateTime).toISOString(), // Convert to ISO format
        },
        end: {
          dateTime: new Date(endDateTime).toISOString(), // Convert to ISO format
        },
      },
    });

    // Send the created event data back to the client
    res.send({ success: true, event: response.data });
  } catch (error) {
    console.error("Error creating event:", error.message);
    next(error);
  }
});

module.exports = router;
