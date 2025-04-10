const tideData = [
  // April 1 (Tue)
  {
    date: "2024-04-01",
    time: "4:06am",
    dateTime: "2024-04-01 04:06:00",
    timeStamp: 1712035560000,
    height: 0.3,
  },
  {
    date: "2024-04-01",
    time: "10:06am",
    dateTime: "2024-04-01 10:06:00",
    timeStamp: 1712039160000,
    height: 1.4,
  },
  {
    date: "2024-04-01",
    time: "4:04pm",
    dateTime: "2024-04-01 16:04:00",
    timeStamp: 1712056440000,
    height: 0.3,
  },
  {
    date: "2024-04-01",
    time: "10:36pm",
    dateTime: "2024-04-01 22:36:00",
    timeStamp: 1712060160000,
    height: 1.7,
  },
  // April 2 (Wed)
  {
    date: "2024-04-02",
    time: "5:03am",
    dateTime: "2024-04-02 05:03:00",
    timeStamp: 1712063580000,
    height: 0.4,
  },
  {
    date: "2024-04-02",
    time: "10:53am",
    dateTime: "2024-04-02 10:53:00",
    timeStamp: 1712067180000,
    height: 1.3,
  },
  {
    date: "2024-04-02",
    time: "4:48pm",
    dateTime: "2024-04-02 16:48:00",
    timeStamp: 1712070480000,
    height: 0.4,
  },
  {
    date: "2024-04-02",
    time: "11:30pm",
    dateTime: "2024-04-02 23:30:00",
    timeStamp: 1712074200000,
    height: 1.6,
  },
  // April 3 (Thu)
  {
    date: "2024-04-03",
    time: "6:09am",
    dateTime: "2024-04-03 06:09:00",
    timeStamp: 1712077740000,
    height: 0.5,
  },
  {
    date: "2024-04-03",
    time: "11:46am",
    dateTime: "2024-04-03 11:46:00",
    timeStamp: 1712081160000,
    height: 1.1,
  },
  {
    date: "2024-04-03",
    time: "5:38pm",
    dateTime: "2024-04-03 17:38:00",
    timeStamp: 1712084760000,
    height: 0.4,
  },
  // April 4 (Fri)
  {
    date: "2024-04-04",
    time: "12:30am",
    dateTime: "2024-04-04 00:30:00",
    timeStamp: 1712088000000,
    height: 1.6,
  },
  {
    date: "2024-04-04",
    time: "7:30am",
    dateTime: "2024-04-04 07:30:00",
    timeStamp: 1712091000000,
    height: 0.6,
  },
  {
    date: "2024-04-04",
    time: "12:52pm",
    dateTime: "2024-04-04 12:52:00",
    timeStamp: 1712094720000,
    height: 1.0,
  },
  {
    date: "2024-04-04",
    time: "6:40pm",
    dateTime: "2024-04-04 18:40:00",
    timeStamp: 1712098800000,
    height: 0.5,
  },
  // April 5 (Sat)
  {
    date: "2024-04-05",
    time: "1:42am",
    dateTime: "2024-04-05 01:42:00",
    timeStamp: 1712102520000,
    height: 1.5,
  },
  {
    date: "2024-04-05",
    time: "9:05am",
    dateTime: "2024-04-05 09:05:00",
    timeStamp: 1712106120000,
    height: 0.6,
  },
  {
    date: "2024-04-05",
    time: "2:23pm",
    dateTime: "2024-04-05 14:23:00",
    timeStamp: 1712109780000,
    height: 0.9,
  },
  {
    date: "2024-04-05",
    time: "8:00pm",
    dateTime: "2024-04-05 20:00:00",
    timeStamp: 1712113200000,
    height: 0.6,
  },
  // April 6 (Sun)
  {
    date: "2024-04-06",
    time: "3:06am",
    dateTime: "2024-04-06 03:06:00",
    timeStamp: 1712116800000,
    height: 1.5,
  },
  {
    date: "2024-04-06",
    time: "10:24am",
    dateTime: "2024-04-06 10:24:00",
    timeStamp: 1712120400000,
    height: 0.5,
  },
  {
    date: "2024-04-06",
    time: "4:08pm",
    dateTime: "2024-04-06 16:08:00",
    timeStamp: 1712124000000,
    height: 1.0,
  },
  {
    date: "2024-04-06",
    time: "9:29pm",
    dateTime: "2024-04-06 21:29:00",
    timeStamp: 1712127540000,
    height: 0.6,
  },
  // April 7 (Mon)
  {
    date: "2024-04-07",
    time: "4:23am",
    dateTime: "2024-04-07 04:23:00",
    timeStamp: 1712127600000,
    height: 1.5,
  },
  {
    date: "2024-04-07",
    time: "11:18am",
    dateTime: "2024-04-07 11:18:00",
    timeStamp: 1712131080000,
    height: 0.5,
  },
  {
    date: "2024-04-07",
    time: "5:15pm",
    dateTime: "2024-04-07 17:15:00",
    timeStamp: 1712134680000,
    height: 1.1,
  },
  {
    date: "2024-04-07",
    time: "10:42pm",
    dateTime: "2024-04-07 22:42:00",
    timeStamp: 1712138280000,
    height: 0.5,
  },
  // April 8 (Tue)
  {
    date: "2024-04-08",
    time: "5:20am",
    dateTime: "2024-04-08 05:20:00",
    timeStamp: 1712141880000,
    height: 1.5,
  },
  {
    date: "2024-04-08",
    time: "11:58am",
    dateTime: "2024-04-08 11:58:00",
    timeStamp: 1712145480000,
    height: 0.4,
  },
  {
    date: "2024-04-08",
    time: "6:01pm",
    dateTime: "2024-04-08 18:01:00",
    timeStamp: 1712149080000,
    height: 1.2,
  },
  {
    date: "2024-04-08",
    time: "11:38pm",
    dateTime: "2024-04-08 23:38:00",
    timeStamp: 1712152680000,
    height: 0.5,
  },
  // April 9 (Wed)
  {
    date: "2024-04-09",
    time: "6:05am",
    dateTime: "2024-04-09 06:05:00",
    timeStamp: 1712152650000,
    height: 1.5,
  },
  {
    date: "2024-04-09",
    time: "12:31pm",
    dateTime: "2024-04-09 12:31:00",
    timeStamp: 1712156220000,
    height: 0.3,
  },
  {
    date: "2024-04-09",
    time: "6:38pm",
    dateTime: "2024-04-09 18:38:00",
    timeStamp: 1712159820000,
    height: 1.3,
  },
  // April 10 (Thu)
  {
    date: "2024-04-10",
    time: "12:24am",
    dateTime: "2024-04-10 00:24:00",
    timeStamp: 1712163360000,
    height: 0.4,
  },
  {
    date: "2024-04-10",
    time: "6:42am",
    dateTime: "2024-04-10 06:42:00",
    timeStamp: 1712166960000,
    height: 1.5,
  },
  {
    date: "2024-04-10",
    time: "1:00pm",
    dateTime: "2024-04-10 13:00:00",
    timeStamp: 1712170560000,
    height: 0.3,
  },
  {
    date: "2024-04-10",
    time: "7:11pm",
    dateTime: "2024-04-10 19:11:00",
    timeStamp: 1712174160000,
    height: 1.4,
  },
  // April 11 (Fri)
  {
    date: "2024-04-11",
    time: "1:05am",
    dateTime: "2024-04-11 01:05:00",
    timeStamp: 1712177760000,
    height: 0.4,
  },
  {
    date: "2024-04-11",
    time: "7:16am",
    dateTime: "2024-04-11 07:16:00",
    timeStamp: 1712181360000,
    height: 1.5,
  },
  {
    date: "2024-04-11",
    time: "1:27pm",
    dateTime: "2024-04-11 13:27:00",
    timeStamp: 1712184960000,
    height: 0.3,
  },
  {
    date: "2024-04-11",
    time: "7:44pm",
    dateTime: "2024-04-11 19:44:00",
    timeStamp: 1712188560000,
    height: 1.4,
  },
  // April 12 (Sat)
  {
    date: "2024-04-12",
    time: "1:42am",
    dateTime: "2024-04-12 01:42:00",
    timeStamp: 1712192160000,
    height: 0.4,
  },
  {
    date: "2024-04-12",
    time: "7:48am",
    dateTime: "2024-04-12 07:48:00",
    timeStamp: 1712195760000,
    height: 1.4,
  },
  {
    date: "2024-04-12",
    time: "1:55pm",
    dateTime: "2024-04-12 13:55:00",
    timeStamp: 1712199360000,
    height: 0.2,
  },
  {
    date: "2024-04-12",
    time: "8:16pm",
    dateTime: "2024-04-12 20:16:00",
    timeStamp: 1712202960000,
    height: 1.5,
  },
  // April 13 (Sun)
  {
    date: "2024-04-13",
    time: "2:19am",
    dateTime: "2024-04-13 02:19:00",
    timeStamp: 1712206560000,
    height: 0.4,
  },
  {
    date: "2024-04-13",
    time: "8:20am",
    dateTime: "2024-04-13 08:20:00",
    timeStamp: 1712210160000,
    height: 1.4,
  },
  {
    date: "2024-04-13",
    time: "2:23pm",
    dateTime: "2024-04-13 14:23:00",
    timeStamp: 1712213760000,
    height: 0.2,
  },
  {
    date: "2024-04-13",
    time: "8:49pm",
    dateTime: "2024-04-13 20:49:00",
    timeStamp: 1712217360000,
    height: 1.5,
  },
  // April 14 (Mon)
  {
    date: "2024-04-14",
    time: "2:57am",
    dateTime: "2024-04-14 02:57:00",
    timeStamp: 1712220960000,
    height: 0.4,
  },
  {
    date: "2024-04-14",
    time: "8:52am",
    dateTime: "2024-04-14 08:52:00",
    timeStamp: 1712224560000,
    height: 1.3,
  },
  {
    date: "2024-04-14",
    time: "2:51pm",
    dateTime: "2024-04-14 14:51:00",
    timeStamp: 1712228160000,
    height: 0.3,
  },
  {
    date: "2024-04-14",
    time: "9:22pm",
    dateTime: "2024-04-14 21:22:00",
    timeStamp: 1712231760000,
    height: 1.6,
  },
  // April 15 (Tue)
  {
    date: "2024-04-15",
    time: "3:35am",
    dateTime: "2024-04-15 03:35:00",
    timeStamp: 1712235360000,
    height: 0.4,
  },
  {
    date: "2024-04-15",
    time: "9:25am",
    dateTime: "2024-04-15 09:25:00",
    timeStamp: 1712238960000,
    height: 1.3,
  },
  {
    date: "2024-04-15",
    time: "3:20pm",
    dateTime: "2024-04-15 15:20:00",
    timeStamp: 1712242560000,
    height: 0.3,
  },
  {
    date: "2024-04-15",
    time: "9:57pm",
    dateTime: "2024-04-15 21:57:00",
    timeStamp: 1712246160000,
    height: 1.6,
  },
  // April 16 (Wed)
  {
    date: "2024-04-16",
    time: "4:17am",
    dateTime: "2024-04-16 04:17:00",
    timeStamp: 1712249760000,
    height: 0.5,
  },
  {
    date: "2024-04-16",
    time: "10:00am",
    dateTime: "2024-04-16 10:00:00",
    timeStamp: 1712253360000,
    height: 1.2,
  },
  {
    date: "2024-04-16",
    time: "3:50pm",
    dateTime: "2024-04-16 15:50:00",
    timeStamp: 1712256960000,
    height: 0.4,
  },
  {
    date: "2024-04-16",
    time: "10:34pm",
    dateTime: "2024-04-16 22:34:00",
    timeStamp: 1712260560000,
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
