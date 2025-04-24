const tideData = [
  // April 1 (Tue)
  {
    localDateTimeISO: "2024-04-01T04:06:00+11:00",
    utc: "2024-03-31T17:06:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-01T10:06:00+11:00",
    utc: "2024-03-31T23:06:00Z",
    height: 1.4,
  },
  {
    localDateTimeISO: "2024-04-01T16:04:00+11:00",
    utc: "2024-04-01T05:04:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-01T22:36:00+11:00",
    utc: "2024-04-01T11:36:00Z",
    height: 1.7,
  },
  // April 2 (Wed)
  {
    localDateTimeISO: "2024-04-02T05:03:00+11:00",
    utc: "2024-04-01T18:03:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-02T10:53:00+11:00",
    utc: "2024-04-01T23:53:00Z",
    height: 1.3,
  },
  {
    localDateTimeISO: "2024-04-02T16:48:00+11:00",
    utc: "2024-04-02T05:48:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-02T23:30:00+11:00",
    utc: "2024-04-02T12:30:00Z",
    height: 1.6,
  },
  // April 3 (Thu)
  {
    localDateTimeISO: "2024-04-03T06:09:00+11:00",
    utc: "2024-04-02T19:09:00Z",
    height: 0.5,
  },
  {
    localDateTimeISO: "2024-04-03T11:46:00+11:00",
    utc: "2024-04-03T00:46:00Z",
    height: 1.1,
  },
  {
    localDateTimeISO: "2024-04-03T17:38:00+11:00",
    utc: "2024-04-03T06:38:00Z",
    height: 0.4,
  },
  // April 4 (Fri)
  {
    localDateTimeISO: "2024-04-04T00:30:00+11:00",
    utc: "2024-04-03T13:30:00Z",
    height: 1.6,
  },
  {
    localDateTimeISO: "2024-04-04T07:30:00+11:00",
    utc: "2024-04-03T20:30:00Z",
    height: 0.6,
  },
  {
    localDateTimeISO: "2024-04-04T12:52:00+11:00",
    utc: "2024-04-04T01:52:00Z",
    height: 1.0,
  },
  {
    localDateTimeISO: "2024-04-04T18:40:00+11:00",
    utc: "2024-04-04T07:40:00Z",
    height: 0.5,
  },
  // April 5 (Sat)
  {
    localDateTimeISO: "2024-04-05T01:42:00+11:00",
    utc: "2024-04-04T14:42:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-05T09:05:00+11:00",
    utc: "2024-04-04T22:05:00Z",
    height: 0.6,
  },
  {
    localDateTimeISO: "2024-04-05T14:23:00+11:00",
    utc: "2024-04-05T03:23:00Z",
    height: 0.9,
  },
  {
    localDateTimeISO: "2024-04-05T20:00:00+11:00",
    utc: "2024-04-05T09:00:00Z",
    height: 0.6,
  },
  // April 6 (Sun)
  {
    localDateTimeISO: "2024-04-06T03:06:00+11:00",
    utc: "2024-04-05T16:06:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-06T10:24:00+11:00",
    utc: "2024-04-05T23:24:00Z",
    height: 0.5,
  },
  {
    localDateTimeISO: "2024-04-06T16:08:00+11:00",
    utc: "2024-04-06T01:08:00Z",
    height: 1.0,
  },
  {
    localDateTimeISO: "2024-04-06T21:29:00+11:00",
    utc: "2024-04-06T10:29:00Z",
    height: 0.6,
  },
  // April 7 (Mon) - Daylight savings starts at 3am
  {
    localDateTimeISO: "2024-04-07T04:23:00+10:00",
    utc: "2024-04-06T18:23:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-07T11:18:00+10:00",
    utc: "2024-04-07T01:18:00Z",
    height: 0.5,
  },
  {
    localDateTimeISO: "2024-04-07T17:15:00+10:00",
    utc: "2024-04-07T07:15:00Z",
    height: 1.1,
  },
  {
    localDateTimeISO: "2024-04-07T22:42:00+10:00",
    utc: "2024-04-07T12:42:00Z",
    height: 0.5,
  },
  // April 8 (Tue)
  {
    localDateTimeISO: "2024-04-08T05:20:00+10:00",
    utc: "2024-04-07T19:20:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-08T11:58:00+10:00",
    utc: "2024-04-08T01:58:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-08T18:01:00+10:00",
    utc: "2024-04-08T08:01:00Z",
    height: 1.2,
  },
  {
    localDateTimeISO: "2024-04-08T23:38:00+10:00",
    utc: "2024-04-08T13:38:00Z",
    height: 0.5,
  },
  // April 9 (Wed)
  {
    localDateTimeISO: "2024-04-09T06:05:00+10:00",
    utc: "2024-04-08T20:05:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-09T12:31:00+10:00",
    utc: "2024-04-09T02:31:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-09T18:38:00+10:00",
    utc: "2024-04-09T08:38:00Z",
    height: 1.3,
  },
  // April 10 (Thu)
  {
    localDateTimeISO: "2024-04-10T00:24:00+10:00",
    utc: "2024-04-09T14:24:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-10T06:42:00+10:00",
    utc: "2024-04-09T20:42:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-10T13:00:00+10:00",
    utc: "2024-04-10T03:00:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-10T19:11:00+10:00",
    utc: "2024-04-10T09:11:00Z",
    height: 1.4,
  },
  // April 11 (Fri)
  {
    localDateTimeISO: "2024-04-11T01:05:00+10:00",
    utc: "2024-04-10T15:05:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-11T07:16:00+10:00",
    utc: "2024-04-10T21:16:00Z",
    height: 1.5,
  },
  {
    localDateTimeISO: "2024-04-11T13:27:00+10:00",
    utc: "2024-04-11T03:27:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-11T19:44:00+10:00",
    utc: "2024-04-11T09:44:00Z",
    height: 1.4,
  },
  // April 12 (Sat)
  {
    localDateTimeISO: "2024-04-12T01:42:00+10:00",
    utc: "2024-04-11T15:42:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-12T07:48:00+10:00",
    utc: "2024-04-11T21:48:00Z",
    height: 1.4,
  },
  {
    localDateTimeISO: "2024-04-12T13:55:00+10:00",
    utc: "2024-04-12T03:55:00Z",
    height: 0.2,
  },
  {
    localDateTimeISO: "2024-04-12T20:16:00+10:00",
    utc: "2024-04-12T10:16:00Z",
    height: 1.5,
  },
  // April 13 (Sun)
  {
    localDateTimeISO: "2024-04-13T02:19:00+10:00",
    utc: "2024-04-12T16:19:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-13T08:20:00+10:00",
    utc: "2024-04-12T22:20:00Z",
    height: 1.4,
  },
  {
    localDateTimeISO: "2024-04-13T14:23:00+10:00",
    utc: "2024-04-13T04:23:00Z",
    height: 0.2,
  },
  {
    localDateTimeISO: "2024-04-13T20:49:00+10:00",
    utc: "2024-04-13T10:49:00Z",
    height: 1.5,
  },
  // April 14 (Mon)
  {
    localDateTimeISO: "2024-04-14T02:57:00+10:00",
    utc: "2024-04-13T16:57:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-14T08:52:00+10:00",
    utc: "2024-04-13T22:52:00Z",
    height: 1.3,
  },
  {
    localDateTimeISO: "2024-04-14T14:51:00+10:00",
    utc: "2024-04-14T04:51:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-14T21:22:00+10:00",
    utc: "2024-04-14T11:22:00Z",
    height: 1.6,
  },
  // April 15 (Tue)
  {
    localDateTimeISO: "2024-04-15T03:35:00+10:00",
    utc: "2024-04-14T17:35:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-15T09:25:00+10:00",
    utc: "2024-04-14T23:25:00Z",
    height: 1.3,
  },
  {
    localDateTimeISO: "2024-04-15T15:20:00+10:00",
    utc: "2024-04-15T05:20:00Z",
    height: 0.3,
  },
  {
    localDateTimeISO: "2024-04-15T21:57:00+10:00",
    utc: "2024-04-15T11:57:00Z",
    height: 1.6,
  },
  // April 16 (Wed)
  {
    localDateTimeISO: "2024-04-16T04:17:00+10:00",
    utc: "2024-04-15T18:17:00Z",
    height: 0.5,
  },
  {
    localDateTimeISO: "2024-04-16T10:00:00+10:00",
    utc: "2024-04-15T22:00:00Z",
    height: 1.2,
  },
  {
    localDateTimeISO: "2024-04-16T15:50:00+10:00",
    utc: "2024-04-16T05:50:00Z",
    height: 0.4,
  },
  {
    localDateTimeISO: "2024-04-16T22:34:00+10:00",
    utc: "2024-04-16T12:34:00Z",
    height: 1.5,
  },
];

export default tideData;

// 1Tue
// 4:06 am
// 0.3 m
// 10:06 am
// 1.4 m
// 4:04 pm
// 0.3 m
// 10:36 pm
// 1.7 m

// 2Wed
// 5:03 am
// 0.4 m
// 10:53 am
// 1.3 m
// 4:48 pm
// 0.4 m
// 11:30 pm
// 1.6 m

// 3Thu
// 6:09 am
// 0.5 m
// 11:46 am
// 1.1 m
// 5:38 pm
// 0.4 m

// 4Fri
// 12:30 am
// 1.6 m
// 7:30 am
// 0.6 m
// 12:52 pm
// 1.0 m
// 6:40 pm
// 0.5 m

// 5Sat
// 1:42 am
// 1.5 m
// 9:05 am
// 0.6 m
// 2:23 pm
// 0.9 m
// 8:00 pm
// 0.6 m

// 6Sun
// 3:06 am
// 1.5 m
// 10:24 am
// 0.5 m
// 4:08 pm
// 1.0 m
// 9:29 pm
// 0.6 m

// 7Mon
// 4:23 am
// 1.5 m
// 11:18 am
// 0.5 m
// 5:15 pm
// 1.1 m
// 10:42 pm
// 0.5 m

// 8Tue
// 5:20 am
// 1.5 m
// 11:58 am
// 0.4 m
// 6:01 pm
// 1.2 m
// 11:38 pm
// 0.5 m

// 9Wed
// 6:05 am
// 1.5 m
// 12:31 pm
// 0.3 m
// 6:38 pm
// 1.3 m

// 10Thu
// 12:24 am
// 0.4 m
// 6:42 am
// 1.5 m
// 1:00 pm
// 0.3 m
// 7:11 pm
// 1.4 m

// 11Fri
// 1:05 am
// 0.4 m
// 7:16 am
// 1.5 m
// 1:27 pm
// 0.3 m
// 7:44 pm
// 1.4 m

// 12Sat
// 1:42 am
// 0.4 m
// 7:48 am
// 1.4 m
// 1:55 pm
// 0.2 m
// 8:16 pm
// 1.5 m

// 13Sun
// 2:19 am
// 0.4 m
// 8:20 am
// 1.4 m
// 2:23 pm
// 0.2 m
// 8:49 pm
// 1.5 m

// 14Mon
// 2:57 am
// 0.4 m
// 8:52 am
// 1.3 m
// 2:51 pm
// 0.3 m
// 9:22 pm
// 1.6 m

// 15Tue
// 3:35 am
// 0.4 m
// 9:25 am
// 1.3 m
// 3:20 pm
// 0.3 m
// 9:57 pm
// 1.6 m

// 16Wed
// 4:17 am
// 0.5 m
// 10:00 am
// 1.2 m
// 3:50 pm
// 0.4 m
// 10:34 pm
// 1.5 m
