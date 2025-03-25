const tideData = [
  // April 1 (Tue)
  {
    date: "2024-04-01",
    time: "4:06am",
    height: 0.3,
  },
  {
    date: "2024-04-01",
    time: "10:06am",
    height: 1.4,
  },
  {
    date: "2024-04-01",
    time: "4:04pm",
    height: 0.3,
  },
  {
    date: "2024-04-01",
    time: "10:36pm",
    height: 1.7,
  },
  // April 2 (Wed)
  {
    date: "2024-04-02",
    time: "5:03am",
    height: 0.4,
  },
  {
    date: "2024-04-02",
    time: "10:53am",
    height: 1.3,
  },
  {
    date: "2024-04-02",
    time: "4:48pm",
    height: 0.4,
  },
  {
    date: "2024-04-02",
    time: "11:30pm",
    height: 1.6,
  },
  // April 3 (Thu)
  {
    date: "2024-04-03",
    time: "6:09am",
    height: 0.5,
  },
  {
    date: "2024-04-03",
    time: "11:46am",
    height: 1.1,
  },
  {
    date: "2024-04-03",
    time: "5:38pm",
    height: 0.4,
  },
  // April 4 (Fri)
  {
    date: "2024-04-04",
    time: "12:30am",
    height: 1.6,
  },
  {
    date: "2024-04-04",
    time: "7:30am",
    height: 0.6,
  },
  {
    date: "2024-04-04",
    time: "12:52pm",
    height: 1.0,
  },
  {
    date: "2024-04-04",
    time: "6:40pm",
    height: 0.5,
  },
  // April 5 (Sat)
  {
    date: "2024-04-05",
    time: "1:42am",
    height: 1.5,
  },
  {
    date: "2024-04-05",
    time: "9:05am",
    height: 0.6,
  },
  {
    date: "2024-04-05",
    time: "2:23pm",
    height: 0.9,
  },
  {
    date: "2024-04-05",
    time: "8:00pm",
    height: 0.6,
  },
  // April 6 (Sun)
  {
    date: "2024-04-06",
    time: "3:06am",
    height: 1.5,
  },
  {
    date: "2024-04-06",
    time: "10:24am",
    height: 0.5,
  },
  {
    date: "2024-04-06",
    time: "4:08pm",
    height: 1.0,
  },
  {
    date: "2024-04-06",
    time: "9:29pm",
    height: 0.6,
  },
  // April 7 (Mon)
  {
    date: "2024-04-07",
    time: "4:23am",
    height: 1.5,
  },
  {
    date: "2024-04-07",
    time: "11:18am",
    height: 0.5,
  },
  {
    date: "2024-04-07",
    time: "5:15pm",
    height: 1.1,
  },
  {
    date: "2024-04-07",
    time: "10:42pm",
    height: 0.5,
  },
  // April 8 (Tue)
  {
    date: "2024-04-08",
    time: "5:20am",
    height: 1.5,
  },
  {
    date: "2024-04-08",
    time: "11:58am",
    height: 0.4,
  },
  {
    date: "2024-04-08",
    time: "6:01pm",
    height: 1.2,
  },
  {
    date: "2024-04-08",
    time: "11:38pm",
    height: 0.5,
  },
  // April 9 (Wed)
  {
    date: "2024-04-09",
    time: "6:05am",
    height: 1.5,
  },
  {
    date: "2024-04-09",
    time: "12:31pm",
    height: 0.3,
  },
  {
    date: "2024-04-09",
    time: "6:38pm",
    height: 1.3,
  },
  // April 10 (Thu)
  {
    date: "2024-04-10",
    time: "12:24am",
    height: 0.4,
  },
  {
    date: "2024-04-10",
    time: "6:42am",
    height: 1.5,
  },
  {
    date: "2024-04-10",
    time: "1:00pm",
    height: 0.3,
  },
  {
    date: "2024-04-10",
    time: "7:11pm",
    height: 1.4,
  },
  // April 11 (Fri)
  {
    date: "2024-04-11",
    time: "1:05am",
    height: 0.4,
  },
  {
    date: "2024-04-11",
    time: "7:16am",
    height: 1.5,
  },
  {
    date: "2024-04-11",
    time: "1:27pm",
    height: 0.3,
  },
  {
    date: "2024-04-11",
    time: "7:44pm",
    height: 1.4,
  },
  // April 12 (Sat)
  {
    date: "2024-04-12",
    time: "1:42am",
    height: 0.4,
  },
  {
    date: "2024-04-12",
    time: "7:48am",
    height: 1.4,
  },
  {
    date: "2024-04-12",
    time: "1:55pm",
    height: 0.2,
  },
  {
    date: "2024-04-12",
    time: "8:16pm",
    height: 1.5,
  },
  // April 13 (Sun)
  {
    date: "2024-04-13",
    time: "2:19am",
    height: 0.4,
  },
  {
    date: "2024-04-13",
    time: "8:20am",
    height: 1.4,
  },
  {
    date: "2024-04-13",
    time: "2:23pm",
    height: 0.2,
  },
  {
    date: "2024-04-13",
    time: "8:49pm",
    height: 1.5,
  },
  // April 14 (Mon)
  {
    date: "2024-04-14",
    time: "2:57am",
    height: 0.4,
  },
  {
    date: "2024-04-14",
    time: "8:52am",
    height: 1.3,
  },
  {
    date: "2024-04-14",
    time: "2:51pm",
    height: 0.3,
  },
  {
    date: "2024-04-14",
    time: "9:22pm",
    height: 1.6,
  },
  // April 15 (Tue)
  {
    date: "2024-04-15",
    time: "3:35am",
    height: 0.4,
  },
  {
    date: "2024-04-15",
    time: "9:25am",
    height: 1.3,
  },
  {
    date: "2024-04-15",
    time: "3:20pm",
    height: 0.3,
  },
  {
    date: "2024-04-15",
    time: "9:57pm",
    height: 1.6,
  },
  // April 16 (Wed)
  {
    date: "2024-04-16",
    time: "4:17am",
    height: 0.5,
  },
  {
    date: "2024-04-16",
    time: "10:00am",
    height: 1.2,
  },
  {
    date: "2024-04-16",
    time: "3:50pm",
    height: 0.4,
  },
  {
    date: "2024-04-16",
    time: "10:34pm",
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
