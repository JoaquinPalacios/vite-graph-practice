const chartData = [
  // April 1 (Tue) - Initial SW swell easing, small SE swell starting
  {
    localDateTimeISO: "2024-04-01T00:00:00+11:00",
    utc: "2024-03-31T13:00:00Z",
    swellDirection: 222,
    windDirection: 150,
    windSpeed_kmh: 8,
    windSpeed_knots: 4,
    waveHeight_ft: 4,
    faceWaveHeight_ft: 5,
    waveHeight_m: 1.2,
    primarySwellHeight: 1.0, // SW swell (Easing)
    primarySwellDirection: 225,
    primarySwellPeriod: 12,
    secondarySwellHeight: 0.5, // SE swell (Building slowly)
    secondarySwellDirection: 140,
    secondarySwellPeriod: 8,
    tertiarySwellHeight: 0.2, // Background E
    tertiarySwellDirection: 90,
    tertiarySwellPeriod: 6,
    nextHighTide: "10:06am",
    nextHighTideHeight: 1.4,
    nextLowTide: "4:04pm",
    nextLowTideHeight: 0.3,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-01T03:00:00+11:00",
    utc: "2024-03-31T16:00:00Z",
    swellDirection: 97,
    windDirection: 180,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.1,
    waveHeight_ft: 3.5,
    faceWaveHeight_ft: 7,
    primarySwellHeight: 0.9, // SW swell (Easing)
    primarySwellDirection: 225,
    primarySwellPeriod: 11.5,
    secondarySwellHeight: 0.6, // SE swell (Building)
    secondarySwellDirection: 140,
    secondarySwellPeriod: 8.5,
    tertiarySwellHeight: 0.2, // Background E
    tertiarySwellDirection: 90,
    tertiarySwellPeriod: 6,
    nextHighTide: "10:06am",
    nextHighTideHeight: 1.4,
    nextLowTide: "4:04pm",
    nextLowTideHeight: 0.3,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-01T06:00:00+11:00",
    utc: "2024-03-31T19:00:00Z",
    swellDirection: 167,
    windDirection: 120,
    windSpeed_kmh: 12,
    windSpeed_knots: 6,
    waveHeight_m: 1.1,
    waveHeight_ft: 3.5,
    faceWaveHeight_ft: 7,
    primarySwellHeight: 0.8, // SW swell (Easing)
    primarySwellDirection: 220,
    primarySwellPeriod: 11,
    secondarySwellHeight: 0.7, // SE swell (Building)
    secondarySwellDirection: 145,
    secondarySwellPeriod: 9,
    tertiarySwellHeight: 0.3, // Background E picking up slightly
    tertiarySwellDirection: 95,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "10:06am",
    nextHighTideHeight: 1.4,
    nextLowTide: "4:04pm",
    nextLowTideHeight: 0.3,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-01T09:00:00+11:00",
    utc: "2024-03-31T22:00:00Z",
    swellDirection: 242,
    windDirection: 260,
    windSpeed_kmh: 33,
    windSpeed_knots: 18,
    waveHeight_m: 1.3,
    waveHeight_ft: 4,
    faceWaveHeight_ft: 7,
    // ... SE swell becoming primary
    primarySwellHeight: 0.9, // SE swell (Building)
    primarySwellDirection: 145,
    primarySwellPeriod: 9.5,
    secondarySwellHeight: 0.7, // SW swell (Easing)
    secondarySwellDirection: 220,
    secondarySwellPeriod: 10.5,
    tertiarySwellHeight: 0.4, // Background E
    tertiarySwellDirection: 95,
    tertiarySwellPeriod: 7,
    nextHighTide: "10:06am",
    nextHighTideHeight: 1.4,
    nextLowTide: "6:30pm",
    nextLowTideHeight: 0.5,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-01T12:00:00+11:00",
    utc: "2024-04-01T01:00:00Z",
    swellDirection: 360,
    windDirection: 290,
    windSpeed_kmh: 45,
    windSpeed_knots: 21,
    waveHeight_m: 1.5,
    waveHeight_ft: 5,
    faceWaveHeight_ft: 8,
    // ... New longer period S swell starts arriving
    primarySwellHeight: 1.1, // SE swell (Peaking)
    primarySwellDirection: 150,
    primarySwellPeriod: 10,
    secondarySwellHeight: 0.6, // SW swell (Fading)
    secondarySwellDirection: 215,
    secondarySwellPeriod: 10,
    tertiarySwellHeight: 0.5, // New S swell
    tertiarySwellDirection: 175,
    tertiarySwellPeriod: 14,
    fourthSwellHeight: 0.4, // Background E
    fourthSwellDirection: 100,
    fourthSwellPeriod: 7,
    nextHighTide: "10:36pm",
    nextHighTideHeight: 1.7,
    nextLowTide: "4:04pm",
    nextLowTideHeight: 0.3,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-01T15:00:00+11:00",
    utc: "2024-04-01T04:00:00Z",
    swellDirection: 301,
    windDirection: 340,
    windSpeed_kmh: 41,
    windSpeed_knots: 22,
    waveHeight_m: 1.7,
    waveHeight_ft: 5.5,
    faceWaveHeight_ft: 7,
    // ... S swell building
    primarySwellHeight: 1.0, // SE swell (Easing)
    primarySwellDirection: 150,
    primarySwellPeriod: 9.5,
    secondarySwellHeight: 0.8, // S swell (Building)
    secondarySwellDirection: 175,
    secondarySwellPeriod: 14.5,
    tertiarySwellHeight: 0.5, // SW swell (Fading)
    tertiarySwellDirection: 215,
    tertiarySwellPeriod: 9.5,
    fourthSwellHeight: 0.3, // Background E
    fourthSwellDirection: 100,
    fourthSwellPeriod: 6.5,
    nextHighTide: "10:36pm",
    nextHighTideHeight: 1.7,
    nextLowTide: "4:04pm",
    nextLowTideHeight: 0.3,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-01T18:00:00+11:00",
    utc: "2024-04-01T07:00:00Z",
    swellDirection: 245,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 1.8,
    waveHeight_ft: 6,
    faceWaveHeight_ft: 9,
    // ... S swell becomes primary
    primarySwellHeight: 1.1, // S swell (Building)
    primarySwellDirection: 178,
    primarySwellPeriod: 15,
    secondarySwellHeight: 0.9, // SE swell (Easing)
    secondarySwellDirection: 155,
    secondarySwellPeriod: 9,
    tertiarySwellHeight: 0.4, // SW swell (Fading)
    tertiarySwellDirection: 210,
    tertiarySwellPeriod: 9,
    fourthSwellHeight: 0.3, // Background E
    fourthSwellDirection: 105,
    fourthSwellPeriod: 6,
    nextHighTide: "10:36pm",
    nextHighTideHeight: 1.7,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-01T21:00:00+11:00",
    utc: "2024-04-01T10:00:00Z",
    swellDirection: 209,
    windDirection: 320,
    windSpeed_kmh: 17,
    windSpeed_knots: 9,
    waveHeight_m: 1.9,
    waveHeight_ft: 6,
    faceWaveHeight_ft: 9,
    // ... S swell keeps building
    primarySwellHeight: 1.4, // S swell (Still building)
    primarySwellDirection: 178,
    primarySwellPeriod: 15,
    secondarySwellHeight: 0.7, // SE swell (Fading)
    secondarySwellDirection: 155,
    secondarySwellPeriod: 8.5,
    tertiarySwellHeight: 0.3, // SW swell (Almost gone)
    tertiarySwellDirection: 210,
    tertiarySwellPeriod: 8.5,
    fourthSwellHeight: 0.2, // Background E
    fourthSwellDirection: 105,
    fourthSwellPeriod: 6,
    nextHighTide: "10:36pm",
    nextHighTideHeight: 1.7,
    isRising: true,
  },
  // April 2 (Wed) - S swell peaks and starts easing, ENE swell builds
  {
    localDateTimeISO: "2024-04-02T00:00:00+11:00",
    utc: "2024-04-01T13:00:00Z",
    swellDirection: 59,
    windDirection: 110,
    windSpeed_kmh: 14,
    windSpeed_knots: 7,
    waveHeight_m: 2,
    waveHeight_ft: 7,
    faceWaveHeight_ft: 9,
    // ... S swell peaks
    primarySwellHeight: 1.6, // S swell (Peak)
    primarySwellDirection: 180,
    primarySwellPeriod: 14.5,
    secondarySwellHeight: 0.6, // SE swell (Fading)
    secondarySwellDirection: 160,
    secondarySwellPeriod: 8,
    tertiarySwellHeight: 0.4, // New ENE windswell starts
    tertiarySwellDirection: 65,
    tertiarySwellPeriod: 7,
    fourthSwellHeight: 0.2, // Fading SW
    fourthSwellDirection: 205,
    fourthSwellPeriod: 8,
    nextHighTide: "10:53am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:03am",
    nextLowTideHeight: 0.4,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-02T03:00:00+11:00",
    utc: "2024-04-01T16:00:00Z",
    swellDirection: 261,
    windDirection: 190,
    windSpeed_kmh: 12,
    windSpeed_knots: 6,
    waveHeight_m: 1.9,
    waveHeight_ft: 6,
    faceWaveHeight_ft: 9,
    // ... S swell peaks, and ENE windswell building
    primarySwellHeight: 1.5, // S swell (Easing)
    primarySwellDirection: 180,
    primarySwellPeriod: 14,
    secondarySwellHeight: 0.6, // ENE windswell building
    secondarySwellDirection: 70,
    secondarySwellPeriod: 7.5,
    tertiarySwellHeight: 0.5, // SE swell (Fading)
    tertiarySwellDirection: 160,
    tertiarySwellPeriod: 7.5,
    fourthSwellHeight: 0.1, // Fading SW
    fourthSwellDirection: 205,
    fourthSwellPeriod: 7.5,
    nextHighTide: "10:53am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:03am",
    nextLowTideHeight: 0.4,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-02T06:00:00+11:00",
    utc: "2024-04-01T19:00:00Z",
    swellDirection: 327,
    windDirection: 350,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.6,
    waveHeight_ft: 5,
    faceWaveHeight_ft: 6,
    // ... S swell easing, and ENE windswell building
    primarySwellHeight: 1.3, // S swell (Easing)
    primarySwellDirection: 180,
    primarySwellPeriod: 13.5,
    secondarySwellHeight: 0.8, // ENE windswell building
    secondarySwellDirection: 70,
    secondarySwellPeriod: 8,
    tertiarySwellHeight: 0.4, // SE swell (Fading)
    tertiarySwellDirection: 165,
    tertiarySwellPeriod: 7,
    nextHighTide: "10:53am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:48pm",
    nextLowTideHeight: 0.4,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-02T09:00:00+11:00",
    utc: "2024-04-01T22:00:00Z",
    swellDirection: 292,
    windDirection: 210,
    windSpeed_kmh: 8,
    windSpeed_knots: 4,
    waveHeight_m: 1.5,
    waveHeight_ft: 5,
    faceWaveHeight_ft: 6,
    // ... ENE swell potentially becoming primary
    primarySwellHeight: 1.1, // S swell (Easing)
    primarySwellDirection: 185,
    primarySwellPeriod: 13,
    secondarySwellHeight: 1.0, // ENE windswell (Peaking)
    secondarySwellDirection: 75,
    secondarySwellPeriod: 8.5,
    tertiarySwellHeight: 0.3, // SE swell (Fading)
    tertiarySwellDirection: 165,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "10:53am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:48pm",
    nextLowTideHeight: 0.4,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-02T12:00:00+11:00",
    utc: "2024-04-02T01:00:00Z",
    swellDirection: 342,
    windDirection: 20,
    windSpeed_kmh: 8,
    windSpeed_knots: 4,
    waveHeight_m: 1.4,
    waveHeight_ft: 4,
    // ... ENE is primary
    primarySwellHeight: 1.1, // ENE windswell (Peaking/Easing)
    primarySwellDirection: 75,
    primarySwellPeriod: 8.5,
    secondarySwellHeight: 0.9, // S swell (Easing)
    secondarySwellDirection: 185,
    secondarySwellPeriod: 12.5,
    tertiarySwellHeight: 0.2, // SE swell (Fading)
    tertiarySwellDirection: 170,
    tertiarySwellPeriod: 6,
    nextHighTide: "11:30pm",
    nextHighTideHeight: 1.6,
    nextLowTide: "4:48pm",
    nextLowTideHeight: 0.4,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-02T15:00:00+11:00",
    utc: "2024-04-02T04:00:00Z",
    swellDirection: 137,
    windDirection: 220,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.3,
    waveHeight_ft: 4,
    // ... ENE windswell (Easing)
    primarySwellHeight: 1.0, // ENE windswell (Easing)
    primarySwellDirection: 80,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.8, // S swell (Easing)
    secondarySwellDirection: 185,
    secondarySwellPeriod: 12,
    tertiarySwellHeight: 0.3, // Small background SE starts again
    tertiarySwellDirection: 150,
    tertiarySwellPeriod: 7,
    nextHighTide: "11:30pm",
    nextHighTideHeight: 1.6,
    nextLowTide: "4:48pm",
    nextLowTideHeight: 0.4,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-02T18:00:00+11:00",
    utc: "2024-04-02T07:00:00Z",
    swellDirection: 120,
    windDirection: 170,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.2,
    waveHeight_ft: 4,
    // ... S swell regains primary briefly as ENE fades faster
    primarySwellHeight: 0.7, // S swell (Still easing)
    primarySwellDirection: 190,
    primarySwellPeriod: 11.5,
    secondarySwellHeight: 0.8, // ENE windswell (Easing) - changed primary/secondary
    secondarySwellDirection: 80,
    secondarySwellPeriod: 7.5,
    tertiarySwellHeight: 0.4, // Background SE
    tertiarySwellDirection: 155,
    tertiarySwellPeriod: 7.5,
    nextHighTide: "11:30pm",
    nextHighTideHeight: 1.6,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-02T21:00:00+11:00",
    utc: "2024-04-02T10:00:00Z",
    swellDirection: 138,
    windDirection: 190,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.0,
    waveHeight_ft: 6,
    faceWaveHeight_ft: 7,
    // ... ENE fading more
    primarySwellHeight: 0.6, // S swell (Easing)
    primarySwellDirection: 190,
    primarySwellPeriod: 11,
    secondarySwellHeight: 0.6, // ENE windswell (Easing)
    secondarySwellDirection: 85,
    secondarySwellPeriod: 7,
    tertiarySwellHeight: 0.5, // Background SE building a bit
    tertiarySwellDirection: 155,
    tertiarySwellPeriod: 8,

    nextHighTide: "11:30pm",
    nextHighTideHeight: 1.6,
    isRising: true,
  },
  // April 3 (Thu) - S swell fades, SE becomes dominant, new Strong S swell approaches late
  {
    localDateTimeISO: "2024-04-03T00:00:00+11:00",
    utc: "2024-04-02T13:00:00Z",
    swellDirection: 146,
    windDirection: 360,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.0,
    waveHeight_ft: 3,
    faceWaveHeight_ft: 4,
    // ... SE swell takes over
    primarySwellHeight: 0.6, // Background SE (now primary)
    primarySwellDirection: 150,
    primarySwellPeriod: 8.5,
    secondarySwellHeight: 0.5, // S swell (Fading)
    secondarySwellDirection: 195,
    secondarySwellPeriod: 10.5,
    tertiarySwellHeight: 0.5, // ENE swell (Fading)
    tertiarySwellDirection: 85,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "11:46am",
    nextHighTideHeight: 1.1,
    nextLowTide: "6:09am",
    nextLowTideHeight: 0.5,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-03T03:00:00+11:00",
    utc: "2024-04-02T16:00:00Z",
    swellDirection: 349,
    windDirection: 50,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.9,
    waveHeight_ft: 3,
    faceWaveHeight_ft: 4,
    // ... SE swell (Holding/slight pulse)
    primarySwellHeight: 0.7, // SE swell (Holding/slight pulse)
    primarySwellDirection: 150,
    primarySwellPeriod: 9,
    secondarySwellHeight: 0.4, // S swell (Fading)
    secondarySwellDirection: 195,
    secondarySwellPeriod: 10,
    tertiarySwellHeight: 0.4, // ENE swell (Fading)
    tertiarySwellDirection: 90,
    tertiarySwellPeriod: 6,

    nextHighTide: "11:46am",
    nextHighTideHeight: 1.1,
    nextLowTide: "6:09am",
    nextLowTideHeight: 0.5,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-03T06:00:00+11:00",
    utc: "2024-04-02T19:00:00Z",
    swellDirection: 243,
    windDirection: 180,
    windSpeed_kmh: 30,
    windSpeed_knots: 16,
    waveHeight_m: 0.8,
    waveHeight_ft: 3,
    // ... Conditions relatively small before new swell
    primarySwellHeight: 0.6, // SE swell (Easing)
    primarySwellDirection: 155,
    primarySwellPeriod: 8.5,
    secondarySwellHeight: 0.3, // S swell (Almost gone)
    secondarySwellDirection: 200,
    secondarySwellPeriod: 9.5,
    tertiarySwellHeight: 0.3, // ENE swell (Almost gone)
    tertiarySwellDirection: 90,
    tertiarySwellPeriod: 5.5,
    nextHighTide: "11:46am",
    nextHighTideHeight: 1.1,
    nextLowTide: "6:09am",
    nextLowTideHeight: 0.5,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-03T09:00:00+11:00",
    utc: "2024-04-02T22:00:00Z",
    swellDirection: 89,
    windDirection: 150,
    windSpeed_kmh: 47,
    windSpeed_knots: 25,
    waveHeight_m: 0.7,
    waveHeight_ft: 2,
    // ... Start seeing signs of new powerful S groundswell
    primarySwellHeight: 0.5, // SE swell (Easing)
    primarySwellDirection: 155,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.4, // New S swell (long period precursor)
    secondarySwellDirection: 175,
    secondarySwellPeriod: 17,
    tertiarySwellHeight: 0.2, // Fading S
    tertiarySwellDirection: 200,
    tertiarySwellPeriod: 9,
    fourthSwellHeight: 0.2, // Fading ENE
    fourthSwellDirection: 95,
    fourthSwellPeriod: 5.5,
    nextHighTide: "11:46am",
    nextHighTideHeight: 1.1,
    nextLowTide: "5:38pm",
    nextLowTideHeight: 0.4,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-03T12:00:00+11:00",
    utc: "2024-04-03T01:00:00Z",
    swellDirection: 137,
    windDirection: 200,
    windSpeed_kmh: 80,
    windSpeed_knots: 43,
    waveHeight_m: 1.0,
    waveHeight_ft: 3,
    faceWaveHeight_ft: 4,
    // ... New S swell building rapidly
    primarySwellHeight: 0.8, // New S swell (Building)
    primarySwellDirection: 175,
    primarySwellPeriod: 16.5,
    secondarySwellHeight: 0.4, // SE swell (Fading)
    secondarySwellDirection: 160,
    secondarySwellPeriod: 7.5,
    tertiarySwellHeight: 0.1, // Fading S
    tertiarySwellDirection: 200,
    tertiarySwellPeriod: 8.5,
    nextLowTide: "5:38pm",
    nextLowTideHeight: 0.4,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-03T15:00:00+11:00",
    utc: "2024-04-03T04:00:00Z",
    swellDirection: 224,
    windDirection: 170,
    windSpeed_kmh: 60,
    windSpeed_knots: 32,
    waveHeight_m: 1.6,
    waveHeight_ft: 5,
    faceWaveHeight_ft: 7,
    // ... New S swell clearly primary
    primarySwellHeight: 1.5, // New S swell (Building strongly)
    primarySwellDirection: 178,
    primarySwellPeriod: 16,
    secondarySwellHeight: 0.3, // SE swell (Fading)
    secondarySwellDirection: 160,
    secondarySwellPeriod: 7,
    tertiarySwellHeight: 0.2, // Background windswell NNE?
    tertiarySwellDirection: 20,
    tertiarySwellPeriod: 5,
    nextLowTide: "5:38pm",
    nextLowTideHeight: 0.4,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-03T18:00:00+11:00",
    utc: "2024-04-03T07:00:00Z",
    swellDirection: 138,
    windDirection: 230,
    windSpeed_kmh: 29,
    windSpeed_knots: 15,
    waveHeight_m: 2.3,
    waveHeight_ft: 7,
    faceWaveHeight_ft: 10,
    // ... New S swell continues to build
    primarySwellHeight: 2.2, // New S swell (Building)
    primarySwellDirection: 178,
    primarySwellPeriod: 15.5,
    secondarySwellHeight: 0.3, // SE swell (Almost gone)
    secondarySwellDirection: 165,
    secondarySwellPeriod: 6.5,
    tertiarySwellHeight: 0.3, // Background windswell NNE
    tertiarySwellDirection: 25,
    tertiarySwellPeriod: 5.5,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-03T21:00:00+11:00",
    utc: "2024-04-03T10:00:00Z",
    swellDirection: 317,
    windDirection: 290,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.6,
    waveHeight_ft: 8,
    faceWaveHeight_ft: 11,
    // ... Approaching peak of S swell
    primarySwellHeight: 2.8, // New S swell (Near peak)
    primarySwellDirection: 180,
    primarySwellPeriod: 15,
    secondarySwellHeight: 0.4, // Background windswell NNE/E
    secondarySwellDirection: 40,
    secondarySwellPeriod: 6,
    tertiarySwellHeight: 0.2, // Fading SE
    tertiarySwellDirection: 165,
    tertiarySwellPeriod: 6,
    isRising: true,
  },
  // April 4 (Fri) - Peak S swell, then slowly easing. Secondary swells minor.
  {
    localDateTimeISO: "2024-04-04T00:00:00+11:00",
    utc: "2024-04-03T13:00:00Z",
    swellDirection: 215,
    windDirection: 250,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 3.1,
    waveHeight_ft: 10,
    faceWaveHeight_ft: 12,
    // ... Peak S swell
    primarySwellHeight: 3.0, // S swell (Peak)
    primarySwellDirection: 180,
    primarySwellPeriod: 14.5,
    secondarySwellHeight: 0.5, // Background E windswell
    secondarySwellDirection: 70,
    secondarySwellPeriod: 6.5,
    tertiarySwellHeight: 0.2, // Minor NNE
    tertiarySwellDirection: 30,
    tertiarySwellPeriod: 5,

    nextHighTide: "12:30am",
    nextHighTideHeight: 1.6,
    nextLowTide: "7:30am",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-04T03:00:00+11:00",
    utc: "2024-04-03T16:00:00Z",
    swellDirection: 75,
    windDirection: 130,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 3.0,
    waveHeight_ft: 9,
    faceWaveHeight_ft: 12,
    // ... Start easing S swell
    primarySwellHeight: 2.9, // S swell (Easing)
    primarySwellDirection: 180,
    primarySwellPeriod: 14,
    secondarySwellHeight: 0.6, // Background E windswell
    secondarySwellDirection: 75,
    secondarySwellPeriod: 7,
    tertiarySwellHeight: 0.2, // Minor NNE
    tertiarySwellDirection: 35,
    tertiarySwellPeriod: 5,
    nextHighTide: "12:52pm",
    nextHighTideHeight: 1.0,
    nextLowTide: "7:30am",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-04T06:00:00+11:00",
    utc: "2024-04-03T19:00:00Z",
    swellDirection: 303,
    windDirection: 60,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.8,
    waveHeight_ft: 9,
    faceWaveHeight_ft: 11,
    // ... S swell continues to ease
    primarySwellHeight: 2.7, // S swell (Easing)
    primarySwellDirection: 185,
    primarySwellPeriod: 13.5,
    secondarySwellHeight: 0.5, // Background E windswell (Easing slightly)
    secondarySwellDirection: 80,
    secondarySwellPeriod: 6.5,
    tertiarySwellHeight: 0.3, // Minor SE pulse?
    tertiarySwellDirection: 140,
    tertiarySwellPeriod: 6,
    nextHighTide: "12:52pm",
    nextHighTideHeight: 1.0,
    nextLowTide: "7:30am",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-04T09:00:00+11:00",
    utc: "2024-04-03T22:00:00Z",
    swellDirection: 122,
    windDirection: 180,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.5,
    waveHeight_ft: 8,
    faceWaveHeight_ft: 11,
    // ... S swell continues to ease
    primarySwellHeight: 2.4, // S swell (Easing)
    primarySwellDirection: 185,
    primarySwellPeriod: 13,
    secondarySwellHeight: 0.4, // Background E windswell (Easing)
    secondarySwellDirection: 85,
    secondarySwellPeriod: 6,
    tertiarySwellHeight: 0.3, // Minor SE
    tertiarySwellDirection: 145,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "12:52pm",
    nextHighTideHeight: 1.0,
    nextLowTide: "6:40pm",
    nextLowTideHeight: 0.5,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-04T12:00:00+11:00",
    utc: "2024-04-04T01:00:00Z",
    swellDirection: 315,
    windDirection: 240,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.2,
    waveHeight_ft: 7,
    faceWaveHeight_ft: 11,
    // ... S swell continues to ease
    primarySwellHeight: 2.1, // S swell (Easing)
    primarySwellDirection: 190,
    primarySwellPeriod: 12.5,
    secondarySwellHeight: 0.4, // Minor SE
    secondarySwellDirection: 150,
    secondarySwellPeriod: 7,
    tertiarySwellHeight: 0.3, // Background E windswell (Fading)
    tertiarySwellDirection: 90,
    tertiarySwellPeriod: 5.5,
    nextHighTide: "12:52pm",
    nextHighTideHeight: 1.5,
    nextLowTide: "6:40pm",
    nextLowTideHeight: 0.5,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-04T15:00:00+11:00",
    utc: "2024-04-04T04:00:00Z",
    swellDirection: 54,
    windDirection: 20,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.9,
    waveHeight_ft: 6,
    faceWaveHeight_ft: 9,
    // ... S swell continues to ease
    primarySwellHeight: 1.8, // S swell (Easing)
    primarySwellDirection: 190,
    primarySwellPeriod: 12,
    secondarySwellHeight: 0.5, // Minor SE (Holding)
    secondarySwellDirection: 150,
    secondarySwellPeriod: 7.5,
    tertiarySwellHeight: 0.2, // Background E windswell (Fading)
    tertiarySwellDirection: 95,
    tertiarySwellPeriod: 5,
    nextLowTide: "6:40pm",
    nextLowTideHeight: 0.5,
    isRising: false,
    nextTideTime: "6:40pm",
    nextTideHeight: 0.5,
  },
  {
    localDateTimeISO: "2024-04-04T18:00:00+11:00",
    utc: "2024-04-04T07:00:00Z",
    swellDirection: 165,
    windDirection: 220,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.7,
    waveHeight_ft: 5,
    faceWaveHeight_ft: 9,
    // ... S swell continues to ease
    primarySwellHeight: 1.6, // S swell (Easing)
    primarySwellDirection: 195,
    primarySwellPeriod: 11.5,
    secondarySwellHeight: 0.6, // Minor SE (Slight pulse)
    secondarySwellDirection: 155,
    secondarySwellPeriod: 8,
    tertiarySwellHeight: 0.2, // Background E windswell (Fading)
    tertiarySwellDirection: 100,
    tertiarySwellPeriod: 5,
    nextLowTide: "6:40pm",
    nextLowTideHeight: 0.5,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-04T21:00:00+11:00",
    utc: "2024-04-04T10:00:00Z",
    swellDirection: 293,
    windDirection: 310,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.5,
    waveHeight_ft: 5,
    faceWaveHeight_ft: 9,
    // ... S swell continues to ease
    primarySwellHeight: 1.4, // S swell (Easing)
    primarySwellDirection: 195,
    primarySwellPeriod: 11,
    secondarySwellHeight: 0.5, // Minor SE (Easing)
    secondarySwellDirection: 155,
    secondarySwellPeriod: 7.5,
    tertiarySwellHeight: 0.3, // Small ENE starting?
    tertiarySwellDirection: 70,
    tertiarySwellPeriod: 6,

    isRising: true,
  },
  // April 5 (Sat) - S swell continues easing, becoming secondary. Mix of smaller ENE/SE.
  {
    localDateTimeISO: "2024-04-05T00:00:00+11:00",
    utc: "2024-04-04T13:00:00Z",
    swellDirection: 247,
    windDirection: 190,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 1.3,
    waveHeight_ft: 4.3,
    faceWaveHeight_ft: 6,
    // S swell (Still primary but easing)
    primarySwellHeight: 1.2, // S swell (Still primary but easing)
    primarySwellDirection: 200,
    primarySwellPeriod: 10.5,
    secondarySwellHeight: 0.4, // Minor SE (Easing)
    secondarySwellDirection: 160,
    secondarySwellPeriod: 7,
    tertiarySwellHeight: 0.4, // ENE holding
    tertiarySwellDirection: 70,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "1:42am",
    nextHighTideHeight: 1.5,
    nextLowTide: "9:05am",
    nextLowTideHeight: 0.6,
    isRising: true,
    nextTideTime: "1:42am",
    nextTideHeight: 1.5,
  },
  {
    localDateTimeISO: "2024-04-05T03:00:00+11:00",
    utc: "2024-04-04T16:00:00Z",
    swellDirection: 325,
    windDirection: 60,
    windSpeed_kmh: 24,
    windSpeed_knots: 12,
    waveHeight_m: 1.1,
    waveHeight_ft: 3.5,
    faceWaveHeight_ft: 6,
    // S swell (Easing)
    primarySwellHeight: 1.0, // S swell (Easing)
    primarySwellDirection: 200,
    primarySwellPeriod: 10,
    secondarySwellHeight: 0.5, // ENE holding
    secondarySwellDirection: 75,
    secondarySwellPeriod: 6.5,
    tertiarySwellHeight: 0.3, // Minor SE (Easing)
    tertiarySwellDirection: 160,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "2:23pm",
    nextHighTideHeight: 0.9,
    nextLowTide: "9:05am",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-05T06:00:00+11:00",
    utc: "2024-04-04T19:00:00Z",
    swellDirection: 181,
    windDirection: 30,
    windSpeed_kmh: 28,
    windSpeed_knots: 14,
    waveHeight_m: 1.0,
    waveHeight_ft: 3.3,
    faceWaveHeight_ft: 4,
    // S swell (Easing)
    primarySwellHeight: 0.9, // S swell (Easing)
    primarySwellDirection: 205,
    primarySwellPeriod: 9.5,
    secondarySwellHeight: 0.6, // ENE (Peaking/Holding)
    secondarySwellDirection: 75,
    secondarySwellPeriod: 7,
    tertiarySwellHeight: 0.2, // Minor SE (Fading)
    tertiarySwellDirection: 165,
    tertiarySwellPeriod: 6,
    nextHighTide: "2:23pm",
    nextHighTideHeight: 0.9,
    nextLowTide: "9:05am",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-05T09:00:00+11:00",
    utc: "2024-04-04T22:00:00Z",
    swellDirection: 98,
    windDirection: 160,
    windSpeed_kmh: 32,
    windSpeed_knots: 16,
    waveHeight_m: 0.9,
    waveHeight_ft: 3,
    // ENE likely becoming primary
    primarySwellHeight: 0.7, // ENE (Holding/Easing slightly)
    primarySwellDirection: 80,
    primarySwellPeriod: 7,
    secondarySwellHeight: 0.7, // S swell (Easing) - Close call for primary!
    secondarySwellDirection: 205,
    secondarySwellPeriod: 9,
    tertiarySwellHeight: 0.2, // Fading SE
    tertiarySwellDirection: 165,
    tertiarySwellPeriod: 5.5,
    nextHighTide: "2:23pm",
    nextHighTideHeight: 0.9,
    nextLowTide: "9:05am",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-05T12:00:00+11:00",
    utc: "2024-04-05T01:00:00Z",
    swellDirection: 288,
    windDirection: 300,
    windSpeed_kmh: 36,
    windSpeed_knots: 18,
    waveHeight_m: 0.8,
    waveHeight_ft: 2.6,
    // ENE primary
    primarySwellHeight: 0.7, // ENE (Easing)
    primarySwellDirection: 85,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.6, // S swell (Easing)
    secondarySwellDirection: 210,
    secondarySwellPeriod: 8.5,
    tertiarySwellHeight: 0.3, // Minor new SE pulse?
    tertiarySwellDirection: 145,
    tertiarySwellPeriod: 6,
    nextHighTide: "2:23pm",
    nextHighTideHeight: 0.9,
    nextLowTide: "8:00pm",
    nextLowTideHeight: 0.6,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-05T15:00:00+11:00",
    utc: "2024-04-05T04:00:00Z",
    swellDirection: 149,
    windDirection: 210,
    windSpeed_kmh: 28,
    windSpeed_knots: 14,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // ENE primary
    primarySwellHeight: 0.6, // ENE (Easing)
    primarySwellDirection: 90,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.5, // S swell (Fading)
    secondarySwellDirection: 210,
    secondarySwellPeriod: 8,
    tertiarySwellHeight: 0.3, // Minor SE
    tertiarySwellDirection: 150,
    tertiarySwellPeriod: 6.5,
    nextLowTide: "8:00pm",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-05T18:00:00+11:00",
    utc: "2024-04-05T07:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.6,
    waveHeight_ft: 2,
    // ENE primary
    primarySwellHeight: 0.5, // ENE (Fading)
    primarySwellDirection: 90,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.4, // S swell (Fading)
    secondarySwellDirection: 215,
    secondarySwellPeriod: 7.5,
    tertiarySwellHeight: 0.4, // Minor SE (Holding)
    tertiarySwellDirection: 150,
    tertiarySwellPeriod: 7,
    nextLowTide: "8:00pm",
    nextLowTideHeight: 0.6,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-05T21:00:00+11:00",
    utc: "2024-04-05T10:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // SE might be primary
    primarySwellHeight: 0.4, // Minor SE
    primarySwellDirection: 155,
    primarySwellPeriod: 7,
    secondarySwellHeight: 0.4, // ENE (Fading)
    secondarySwellDirection: 95,
    secondarySwellPeriod: 5.5,
    tertiarySwellHeight: 0.3, // S swell (Fading)
    tertiarySwellDirection: 215,
    tertiarySwellPeriod: 7,
    isRising: true,
  },
  // April 6 (Sun) - Generally small, mixed swells
  {
    localDateTimeISO: "2024-04-06T00:00:00+11:00",
    utc: "2024-04-05T13:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // Minor SE (Holding/Slight build?)
    primarySwellHeight: 0.5, // Minor SE (Holding/Slight build?)
    primarySwellDirection: 155,
    primarySwellPeriod: 7.5,
    secondarySwellHeight: 0.3, // ENE (Fading)
    secondarySwellDirection: 95,
    secondarySwellPeriod: 5,
    tertiarySwellHeight: 0.3, // S swell remnant
    tertiarySwellDirection: 220,
    tertiarySwellPeriod: 6.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.2,
    nextLowTide: "7:40pm",
    nextLowTideHeight: 0.3,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-06T03:00:00+11:00",
    utc: "2024-04-05T16:00:00Z",
    swellDirection: 197,
    windDirection: 240,
    windSpeed_kmh: 12,
    windSpeed_knots: 6,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // Minor SE (Easing after high)
    primarySwellHeight: 0.5, // Minor SE (Easing after high)
    primarySwellDirection: 160,
    primarySwellPeriod: 7,
    secondarySwellHeight: 0.2, // ENE (Fading)
    secondarySwellDirection: 100,
    secondarySwellPeriod: 5,
    tertiarySwellHeight: 0.2, // S swell remnant
    tertiarySwellDirection: 220,
    tertiarySwellPeriod: 6,

    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:40pm",
    nextLowTideHeight: 0.2,
    isRising: false,
  },
  {
    localDateTimeISO: "2024-04-06T06:00:00+11:00",
    utc: "2024-04-05T19:00:00Z",
    swellDirection: 177,
    windDirection: 160,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Minor SE (Easing)
    primarySwellHeight: 0.4, // Minor SE (Easing)
    primarySwellDirection: 160,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.3, // Small background E
    secondarySwellDirection: 90,
    secondarySwellPeriod: 5.5,
    tertiarySwellHeight: 0.1, // Fading S remnant
    tertiarySwellDirection: 225,
    tertiarySwellPeriod: 5.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:50am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-06T09:00:00+11:00",
    utc: "2024-04-05T22:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Minor SE (Bottoming out)
    primarySwellHeight: 0.4, // Minor SE (Bottoming out)
    primarySwellDirection: 165,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.3, // Small background E
    secondarySwellDirection: 95,
    secondarySwellPeriod: 6,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:50am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-06T12:00:00+11:00",
    utc: "2024-04-06T01:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Slight pulse in background E?
    primarySwellHeight: 0.4, // Small background E
    primarySwellDirection: 100,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.3, // Minor SE
    secondarySwellDirection: 165,
    secondarySwellPeriod: 6,
    tertiarySwellHeight: 0.1, // Very small S remnant
    tertiarySwellDirection: 220,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:00am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-06T15:00:00+11:00",
    utc: "2024-04-06T04:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // Small background E (Peaking)
    primarySwellHeight: 0.5, // Small background E (Peaking)
    primarySwellDirection: 100,
    primarySwellPeriod: 7,
    secondarySwellHeight: 0.3, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 5.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:10am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-06T18:00:00+11:00",
    utc: "2024-04-06T07:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small background E (Easing)
    primarySwellHeight: 0.5, // Small background E (Easing)
    primarySwellDirection: 105,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:20am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-06T21:00:00+11:00",
    utc: "2024-04-06T10:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small background E (Easing)
    primarySwellHeight: 0.4, // Small background E (Easing)
    primarySwellDirection: 110,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Minor SE fading
    secondarySwellDirection: 175,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:20am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 7 (Mon) - Daylight savings starts at 3am - Very small swells, potentially new small E swell build later
  {
    localDateTimeISO: "2024-04-07T00:00:00+11:00",
    utc: "2024-04-06T13:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small background E
    primarySwellHeight: 0.3, // Small background E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.1, // Other minor energy
    secondarySwellDirection: 160,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:30am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T03:00:00+10:00",
    utc: "2024-04-06T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small background E
    primarySwellHeight: 0.3, // Small background E
    primarySwellDirection: 115,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.1, // Other minor energy
    secondarySwellDirection: 180,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:40am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T06:00:00+10:00",
    utc: "2024-04-06T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small background E building slightly?
    primarySwellHeight: 0.4, // Small background E building slightly?
    primarySwellDirection: 110,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Other minor energy
    secondarySwellDirection: 150,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:50am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T09:00:00+10:00",
    utc: "2024-04-06T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small background E holding
    primarySwellHeight: 0.4, // Small background E holding
    primarySwellDirection: 105,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Other minor energy
    secondarySwellDirection: 170,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:00am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T12:00:00+10:00",
    utc: "2024-04-07T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E swell peaks?
    primarySwellHeight: 0.5, // Small background E peaking
    primarySwellDirection: 100,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.2, // Other minor energy
    secondarySwellDirection: 160,
    secondarySwellPeriod: 5.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:10am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T15:00:00+10:00",
    utc: "2024-04-07T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small background E easing
    primarySwellHeight: 0.4, // Small background E easing
    primarySwellDirection: 105,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Other minor energy
    secondarySwellDirection: 175,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:20am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T18:00:00+10:00",
    utc: "2024-04-07T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.6,
    // Small background E easing
    primarySwellHeight: 0.3, // Small background E easing
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Other minor energy
    secondarySwellDirection: 150,
    secondarySwellPeriod: 5,

    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:30am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-07T21:00:00+10:00",
    utc: "2024-04-07T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small background E steady
    primarySwellHeight: 0.3, // Small background E steady
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Other minor energy
    secondarySwellDirection: 170,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:40am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 8 (Tue) - Continued small, slight increase mid-day?
  {
    localDateTimeISO: "2024-04-08T00:00:00+10:00",
    utc: "2024-04-07T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E
    primarySwellHeight: 0.4, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 150,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:50am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T03:00:00+10:00",
    utc: "2024-04-07T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E holding
    primarySwellHeight: 0.4, // Small E holding
    primarySwellDirection: 110,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 160,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "10:00am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T06:00:00+10:00",
    utc: "2024-04-07T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // Small E peaking
    primarySwellHeight: 0.6, // Small E peaking
    primarySwellDirection: 105,
    primarySwellPeriod: 7,
    secondarySwellHeight: 0.3, // Small SE
    secondarySwellDirection: 150,
    secondarySwellPeriod: 5.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "10:10am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T09:00:00+10:00",
    utc: "2024-04-07T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // Small E holding/easing
    primarySwellHeight: 0.6, // Small E holding/easing
    primarySwellDirection: 100,
    primarySwellPeriod: 6.5,
    secondarySwellHeight: 0.3, // Small SE
    secondarySwellDirection: 155,
    secondarySwellPeriod: 5.5,

    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "10:20am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T12:00:00+10:00",
    utc: "2024-04-08T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E easing
    primarySwellHeight: 0.5, // Small E easing
    primarySwellDirection: 95,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.3, // Small SE
    secondarySwellDirection: 160,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "10:30am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T15:00:00+10:00",
    utc: "2024-04-08T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E steady
    primarySwellHeight: 0.5, // Small E steady
    primarySwellDirection: 100,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Small SE easing
    secondarySwellDirection: 165,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "10:40am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T18:00:00+10:00",
    utc: "2024-04-08T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E easing
    primarySwellHeight: 0.4, // Small E easing
    primarySwellDirection: 105,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Small SE fading
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "10:50am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-08T21:00:00+10:00",
    utc: "2024-04-08T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E steady
    primarySwellHeight: 0.4, // Small E steady
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "11:00am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 9 (Tue) - Continued small E swell, minor background SE
  {
    localDateTimeISO: "2024-04-09T00:00:00+10:00",
    utc: "2024-04-08T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E steady
    primarySwellHeight: 0.4, // Small E steady
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 150,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "11:10am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T03:00:00+10:00",
    utc: "2024-04-08T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E steady
    primarySwellHeight: 0.4, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 155,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "11:20am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T06:00:00+10:00",
    utc: "2024-04-08T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.6,
    // Small E easing
    primarySwellHeight: 0.3, // Small E easing
    primarySwellDirection: 110,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 160,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "11:30am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T09:00:00+10:00",
    utc: "2024-04-08T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.2, // Small SE steady
    secondarySwellDirection: 155,
    secondarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "11:40am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T12:00:00+10:00",
    utc: "2024-04-09T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E pulse?
    primarySwellHeight: 0.4, // Small E pulse?
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 160,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "11:50am",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T15:00:00+10:00",
    utc: "2024-04-09T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E holding
    primarySwellHeight: 0.4, // Small E holding
    primarySwellDirection: 105,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Small SE
    secondarySwellDirection: 165,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "12:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T18:00:00+10:00",
    utc: "2024-04-09T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E easing
    primarySwellHeight: 0.3, // Small E easing
    primarySwellDirection: 110,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Small SE fading
    secondarySwellDirection: 165,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "12:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-09T21:00:00+10:00",
    utc: "2024-04-09T08:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "12:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 10 (Wed) - Continued very small E swell, minor background SE
  {
    localDateTimeISO: "2024-04-10T00:00:00+10:00",
    utc: "2024-04-09T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "12:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T03:00:00+10:00",
    utc: "2024-04-09T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "12:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T06:00:00+10:00",
    utc: "2024-04-09T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "12:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T09:00:00+10:00",
    utc: "2024-04-09T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "1:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T12:00:00+10:00",
    utc: "2024-04-10T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.4,
    waveHeight_ft: 4.6,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "1:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T15:00:00+10:00",
    utc: "2024-04-10T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "1:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T18:00:00+10:00",
    utc: "2024-04-10T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "1:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-10T21:00:00+10:00",
    utc: "2024-04-10T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "1:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 11 (Thu) - Small E swell, minor background SE. From late afternoon on, small southerly swell starts to build.
  {
    localDateTimeISO: "2024-04-11T00:00:00+10:00",
    utc: "2024-04-10T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "1:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T03:00:00+10:00",
    utc: "2024-04-10T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "2:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T06:00:00+10:00",
    utc: "2024-04-10T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4,
    waveHeight_ft: 1.3,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "2:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T09:00:00+10:00",
    utc: "2024-04-10T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "2:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T12:00:00+10:00",
    utc: "2024-04-11T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5,
    waveHeight_ft: 1.6,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "2:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T15:00:00+10:00",
    utc: "2024-04-11T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E steady
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "2:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T18:00:00+10:00",
    utc: "2024-04-11T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6,
    waveHeight_ft: 1.9,
    // Small E steady. From late afternoon on, small southerly swell starts to build.
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.1, // Minor SE
    tertiarySwellDirection: 170,
    tertiarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "2:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-11T21:00:00+10:00",
    utc: "2024-04-11T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    // Small E steady. From late afternoon on, small southerly swell starts to build.
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.2, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "3:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 12 (Fri) - Southerly swell starts to build. and becomes dominant.
  {
    localDateTimeISO: "2024-04-12T00:00:00+10:00",
    utc: "2024-04-11T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7,
    waveHeight_ft: 2.3,
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.8, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "3:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T03:00:00+10:00",
    utc: "2024-04-11T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.9,
    waveHeight_ft: 2.9,
    // Small E steady. Southerly swell starts to build.
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 1.0, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "3:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T06:00:00+10:00",
    utc: "2024-04-11T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.2,
    waveHeight_ft: 3.9,
    // Southerly swell starts to build.
    primarySwellHeight: 1.0, // Southerly become primary
    primarySwellDirection: 180,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.8, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "3:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T09:00:00+10:00",
    utc: "2024-04-11T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.5,
    waveHeight_ft: 4.9,
    // Southerly swell starts to build.
    primarySwellHeight: 1.0, // Southerly become primary
    primarySwellDirection: 180,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.8, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "3:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T12:00:00+10:00",
    utc: "2024-04-12T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.4,
    waveHeight_ft: 4.6,
    // Southerly swell starts to build.
    primarySwellHeight: 1.0, // Southerly become primary
    primarySwellDirection: 180,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "3:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T15:00:00+10:00",
    utc: "2024-04-12T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 1.8,
    waveHeight_ft: 5.9,
    // Southerly swell starts to build.
    primarySwellHeight: 1.6, // Southerly become primary
    primarySwellDirection: 180,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T18:00:00+10:00",
    utc: "2024-04-12T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.0,
    waveHeight_ft: 6.6,
    // Southerly close to reach peak.
    primarySwellHeight: 1.8, // Southerly become primary
    primarySwellDirection: 180,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-12T21:00:00+10:00",
    utc: "2024-04-12T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.3,
    waveHeight_ft: 7.5,
    // Southerly close to reach peak.
    primarySwellHeight: 1.8, // Southerly become primary
    primarySwellDirection: 180,
    primarySwellPeriod: 8,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 170,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.8, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  // April 13 (Sat) - Small E/SE/SSE mix
  {
    localDateTimeISO: "2024-04-13T00:00:00+10:00",
    utc: "2024-04-12T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 2.0,
    waveHeight_ft: 6.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E steady
    primarySwellDirection: 115,
    primarySwellPeriod: 5,
    secondarySwellHeight: 0.1, // Minor SE
    secondarySwellDirection: 150,
    secondarySwellPeriod: 4,
    tertiarySwellHeight: 0.8, // Minor SSE
    tertiarySwellDirection: 180,
    tertiarySwellPeriod: 5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T03:00:00+10:00",
    utc: "2024-04-12T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 2.0,
    waveHeight_ft: 6.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T06:00:00+10:00",
    utc: "2024-04-12T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.7,
    waveHeight_ft: 5.6,
    // Small E pulse
    primarySwellHeight: 0.4, // Small E pulse
    primarySwellDirection: 105,
    primarySwellPeriod: 6,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 140,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "4:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T09:00:00+10:00",
    utc: "2024-04-12T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.5,
    waveHeight_ft: 4.9,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T12:00:00+10:00",
    utc: "2024-04-13T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.4,
    waveHeight_ft: 4.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T15:00:00+10:00",
    utc: "2024-04-13T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 1.4,
    waveHeight_ft: 4.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T18:00:00+10:00",
    utc: "2024-04-13T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.2,
    waveHeight_ft: 3.9,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-13T21:00:00+10:00",
    utc: "2024-04-13T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.1,
    waveHeight_ft: 3.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T00:00:00+10:00",
    utc: "2024-04-13T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.2,
    waveHeight_ft: 3.9,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "5:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T03:00:00+10:00",
    utc: "2024-04-13T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 1.2,
    waveHeight_ft: 3.9,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "6:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T06:00:00+10:00",
    utc: "2024-04-13T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.0,
    waveHeight_ft: 3.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "6:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T09:00:00+10:00",
    utc: "2024-04-13T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.9,
    waveHeight_ft: 3.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "6:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T12:00:00+10:00",
    utc: "2024-04-14T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.8, // Small E/SE/SSE mix
    waveHeight_ft: 2.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    tertiarySwellHeight: 0.8, // Minor SE
    tertiarySwellDirection: 145,
    tertiarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "6:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T15:00:00+10:00",
    utc: "2024-04-14T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.7, // Small E/SE/SSE mix
    waveHeight_ft: 2.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 125,
    secondarySwellPeriod: 4.5,
    tertiarySwellHeight: 1.1, // Minor SE
    tertiarySwellDirection: 145,
    tertiarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "6:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T18:00:00+10:00",
    utc: "2024-04-14T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6, // Small E/SE/SSE mix
    waveHeight_ft: 2.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "6:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-14T21:00:00+10:00",
    utc: "2024-04-14T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5, // Small E/SE/SSE mix
    waveHeight_ft: 1.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.4, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T00:00:00+10:00",
    utc: "2024-04-14T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4, // Small E/SE/SSE mix
    waveHeight_ft: 1.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T03:00:00+10:00",
    utc: "2024-04-14T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.3, // Small E/SE/SSE mix
    waveHeight_ft: 1.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.3, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T06:00:00+10:00",
    utc: "2024-04-14T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.2, // Small E/SE/SSE mix
    waveHeight_ft: 0.7,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T09:00:00+10:00",
    utc: "2024-04-14T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.4, // Small E/SE/SSE mix
    waveHeight_ft: 1.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T12:00:00+10:00",
    utc: "2024-04-15T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.5, // Small E/SE/SSE mix
    waveHeight_ft: 1.6,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "7:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T15:00:00+10:00",
    utc: "2024-04-15T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.4, // Small E/SE/SSE mix
    waveHeight_ft: 1.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T18:00:00+10:00",
    utc: "2024-04-15T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6, // Small E/SE/SSE mix
    waveHeight_ft: 2.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-15T21:00:00+10:00",
    utc: "2024-04-15T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6, // Small E/SE/SSE mix
    waveHeight_ft: 2.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T00:00:00+10:00",
    utc: "2024-04-15T14:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7, // Small E/SE/SSE mix
    waveHeight_ft: 2.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T03:00:00+10:00",
    utc: "2024-04-15T17:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 0.7, // Small E/SE/SSE mix
    waveHeight_ft: 2.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T06:00:00+10:00",
    utc: "2024-04-15T20:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.6, // Small E/SE/SSE mix
    waveHeight_ft: 2.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "8:50pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T09:00:00+10:00",
    utc: "2024-04-15T23:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 0.7, // Small E/SE/SSE mix
    waveHeight_ft: 2.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:00pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T12:00:00+10:00",
    utc: "2024-04-16T02:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.2, // Small E/SE/SSE mix
    waveHeight_ft: 4.0,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:10pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T15:00:00+10:00",
    utc: "2024-04-16T05:00:00Z",
    swellDirection: 227,
    windDirection: 180,
    windSpeed_kmh: 20,
    windSpeed_knots: 10,
    waveHeight_m: 1.0, // Small E/SE/SSE mix
    waveHeight_ft: 3.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    tertiarySwellHeight: 0.7, // Minor SE
    tertiarySwellDirection: 145,
    tertiarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:20pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T18:00:00+10:00",
    utc: "2024-04-16T08:00:00Z",
    swellDirection: 293,
    windDirection: 330,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.0, // Small E/SE/SSE mix
    waveHeight_ft: 3.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:30pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
  {
    localDateTimeISO: "2024-04-16T21:00:00+10:00",
    utc: "2024-04-16T11:00:00Z",
    swellDirection: 335,
    windDirection: 270,
    windSpeed_kmh: 10,
    windSpeed_knots: 5,
    waveHeight_m: 1.0, // Small E/SE/SSE mix
    waveHeight_ft: 3.3,
    // Small E/SE/SSE mix
    primarySwellHeight: 0.3, // Small E
    primarySwellDirection: 110,
    primarySwellPeriod: 5.5,
    secondarySwellHeight: 0.2, // Minor SE
    secondarySwellDirection: 145,
    secondarySwellPeriod: 4.5,
    nextHighTide: "1:30am",
    nextHighTideHeight: 1.3,
    nextLowTide: "9:40pm",
    nextLowTideHeight: 0.2,
    isRising: true,
  },
];

export default chartData;
