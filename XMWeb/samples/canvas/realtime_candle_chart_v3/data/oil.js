let oil = ["time,open,high,low,close,volume",
"2020-06-19,20:30,39.73,39.86,39.67,39.80,743",
"2020-06-19,20:45,39.81,39.90,39.66,39.73,739",
"2020-06-19,21:00,39.72,39.90,39.53,39.69,1198",
"2020-06-19,21:15,39.69,39.89,39.49,39.80,1161",
"2020-06-19,21:30,39.79,39.88,39.76,39.88,438",
"2020-06-19,21:45,39.87,39.92,39.75,39.78,360",
"2020-06-19,22:00,39.77,39.83,39.68,39.74,352",
"2020-06-19,22:15,39.73,39.80,39.71,39.72,230",
"2020-06-19,22:30,39.73,39.75,39.58,39.63,288",
"2020-06-19,22:45,39.62,39.64,39.59,39.62,238",
"2020-06-19,23:00,39.62,39.70,39.54,39.58,247",
"2020-06-22,01:00,39.18,39.42,39.13,39.23,767",
"2020-06-22,01:15,39.22,39.88,39.21,39.75,613",
"2020-06-22,01:30,39.76,39.93,39.69,39.71,398",
"2020-06-22,01:45,39.71,39.85,39.65,39.83,234",
"2020-06-22,02:00,39.82,39.97,39.68,39.78,381",
"2020-06-22,02:15,39.77,39.85,39.71,39.76,263",
"2020-06-22,02:30,39.76,39.87,39.73,39.81,261",
"2020-06-22,02:45,39.82,39.94,39.80,39.83,261",
"2020-06-22,03:00,39.84,39.93,39.73,39.92,452",
"2020-06-22,03:15,39.93,40.07,39.90,39.93,370",
"2020-06-22,03:30,39.94,39.97,39.66,39.76,348",
"2020-06-22,03:45,39.77,39.85,39.71,39.79,333",
"2020-06-22,04:00,39.79,39.98,39.78,39.97,395",
"2020-06-22,04:15,39.96,40.09,39.93,40.06,381",
"2020-06-22,04:30,40.07,40.15,40.00,40.09,306",
"2020-06-22,04:45,40.09,40.11,39.93,39.94,263",
"2020-06-22,05:00,39.93,40.08,39.93,40.04,232",
"2020-06-22,05:15,40.04,40.07,39.97,40.05,181",
"2020-06-22,05:30,40.04,40.05,39.86,39.87,186",
"2020-06-22,05:45,39.86,39.93,39.85,39.91,228",
"2020-06-22,06:00,39.90,39.91,39.70,39.73,327",
"2020-06-22,06:15,39.72,39.83,39.65,39.80,299",
"2020-06-22,06:30,39.79,39.90,39.79,39.88,182",
"2020-06-22,06:45,39.87,39.88,39.75,39.78,197",
"2020-06-22,07:00,39.79,39.88,39.77,39.77,155",
"2020-06-22,07:15,39.78,39.79,39.70,39.76,143",
"2020-06-22,07:30,39.77,39.82,39.72,39.75,149",
"2020-06-22,07:45,39.74,39.75,39.62,39.65,179",
"2020-06-22,08:00,39.63,39.69,39.58,39.60,328",
"2020-06-22,08:15,39.60,39.71,39.60,39.69,211",
"2020-06-22,08:30,39.68,39.68,39.57,39.61,162",
"2020-06-22,08:45,39.62,39.65,39.59,39.61,141",
"2020-06-22,09:00,39.59,39.67,39.54,39.66,280",
"2020-06-22,09:15,39.65,39.72,39.60,39.67,298",
"2020-06-22,09:30,39.68,39.71,39.61,39.67,307",
"2020-06-22,09:45,39.68,39.81,39.63,39.80,313",
"2020-06-22,10:00,39.80,39.88,39.77,39.87,652",
"2020-06-22,10:15,39.87,40.05,39.84,40.05,460",
"2020-06-22,10:30,40.06,40.08,39.92,39.95,558",
"2020-06-22,10:45,39.95,40.03,39.88,39.88,456",
"2020-06-22,11:00,39.89,39.98,39.81,39.83,367",
"2020-06-22,11:15,39.82,39.91,39.74,39.78,491",
"2020-06-22,11:30,39.79,39.90,39.71,39.88,494",
"2020-06-22,11:45,39.87,39.90,39.80,39.87,376",
"2020-06-22,12:00,39.88,39.99,39.86,39.92,376",
"2020-06-22,12:15,39.92,39.96,39.89,39.96,326",
"2020-06-22,12:30,39.95,39.97,39.75,39.76,411",
"2020-06-22,12:45,39.76,39.79,39.66,39.69,358",
"2020-06-22,13:00,39.69,39.83,39.69,39.75,359",
"2020-06-22,13:15,39.74,39.79,39.72,39.75,306",
"2020-06-22,13:30,39.74,39.83,39.72,39.78,267",
"2020-06-22,13:45,39.77,39.80,39.66,39.70,319",
"2020-06-22,14:00,39.69,39.70,39.49,39.56,414",
"2020-06-22,14:15,39.55,39.63,39.48,39.60,339",
"2020-06-22,14:30,39.61,39.61,39.52,39.55,226",
"2020-06-22,14:45,39.54,39.66,39.54,39.63,275",
"2020-06-22,15:00,39.63,39.70,39.37,39.53,480",
"2020-06-22,15:15,39.53,39.62,39.49,39.49,245",
"2020-06-22,15:30,39.48,39.58,39.48,39.55,164",
"2020-06-22,15:45,39.56,39.71,39.51,39.66,329",
"2020-06-22,16:00,39.64,39.82,39.61,39.73,560",
"2020-06-22,16:15,39.73,39.90,39.63,39.84,535",
"2020-06-22,16:30,39.83,39.89,39.71,39.83,846",
"2020-06-22,16:45,39.82,39.96,39.79,39.87,714",
"2020-06-22,17:00,39.87,40.18,39.82,40.11,707",
"2020-06-22,17:15,40.10,40.14,39.97,40.04,550",
"2020-06-22,17:30,40.05,40.07,39.90,39.97,492",
"2020-06-22,17:45,39.98,40.09,39.98,40.04,580",
"2020-06-22,18:00,40.04,40.17,39.92,40.17,490",
"2020-06-22,18:15,40.18,40.36,40.13,40.36,683",
"2020-06-22,18:30,40.37,40.37,40.21,40.28,418",
"2020-06-22,18:45,40.29,40.35,40.24,40.33,367",
"2020-06-22,19:00,40.34,40.42,40.26,40.29,392",
"2020-06-22,19:15,40.29,40.34,40.17,40.21,322",
"2020-06-22,19:30,40.20,40.27,40.16,40.27,284",
"2020-06-22,19:45,40.26,40.39,40.25,40.38,253",
"2020-06-22,20:00,40.37,40.42,40.26,40.28,338",
"2020-06-22,20:15,40.29,40.33,40.26,40.32,298",
"2020-06-22,20:30,40.32,40.34,40.16,40.25,229",
"2020-06-22,20:45,40.26,40.36,40.26,40.36,315",
"2020-06-22,21:00,40.34,40.62,40.30,40.61,449",
"2020-06-22,21:15,40.61,40.75,40.51,40.68,787",
"2020-06-22,21:30,40.69,40.71,40.58,40.63,269",
"2020-06-22,21:45,40.64,40.70,40.58,40.65,203",
"2020-06-22,22:00,40.65,40.71,40.62,40.64,167",
"2020-06-22,22:15,40.63,40.68,40.57,40.60,238",
"2020-06-22,22:30,40.61,40.67,40.60,40.66,84",
"2020-06-22,22:45,40.65,40.68,40.65,40.67,153",
"2020-06-22,23:00,40.68,40.75,40.65,40.69,159",
"2020-06-22,23:15,40.68,40.72,40.67,40.71,50",
"2020-06-22,23:30,40.71,40.72,40.58,40.66,142",
"2020-06-22,23:45,40.65,40.67,40.55,40.56,140",
"2020-06-23,01:00,40.64,40.73,40.57,40.70,225",
"2020-06-23,01:15,40.70,40.85,40.66,40.81,159",
"2020-06-23,01:30,40.82,40.83,40.74,40.80,161",
"2020-06-23,01:45,40.81,41.21,40.81,41.11,454",
"2020-06-23,02:00,41.11,41.13,40.92,41.00,237",
"2020-06-23,02:15,41.01,41.21,41.01,41.09,211",
"2020-06-23,02:30,41.08,41.13,41.02,41.05,161",
"2020-06-23,02:45,41.06,41.06,40.92,40.94,277",
"2020-06-23,03:00,40.93,40.93,40.74,40.77,455",
"2020-06-23,03:15,40.78,40.84,40.75,40.78,204",
"2020-06-23,03:30,40.79,40.80,40.68,40.74,271",
"2020-06-23,03:45,40.74,40.83,40.73,40.78,162",
"2020-06-23,04:00,40.78,40.86,40.46,40.49,394",
"2020-06-23,04:15,40.48,40.48,39.93,39.95,1064",
"2020-06-23,04:30,39.94,40.29,39.84,40.00,1055",
"2020-06-23,04:45,39.99,40.28,39.74,40.27,1284",
"2020-06-23,05:00,40.28,40.50,40.22,40.48,1023",
"2020-06-23,05:15,40.48,40.67,40.41,40.59,586",
"2020-06-23,05:30,40.60,40.69,40.48,40.53,596",
"2020-06-23,05:45,40.54,40.68,40.52,40.66,360",
"2020-06-23,06:00,40.66,40.68,40.54,40.63,285",
"2020-06-23,06:15,40.62,40.65,40.55,40.57,242",
"2020-06-23,06:30,40.58,40.59,40.40,40.41,418",
"2020-06-23,06:45,40.42,40.50,40.42,40.47,221",
"2020-06-23,07:00,40.46,40.58,40.44,40.54,161",
"2020-06-23,07:15,40.54,40.57,40.51,40.56,157",
"2020-06-23,07:30,40.57,40.61,40.52,40.53,192",
"2020-06-23,07:45,40.53,40.55,40.45,40.46,203",
"2020-06-23,08:00,40.47,40.62,40.47,40.58,158",
"2020-06-23,08:15,40.57,40.59,40.52,40.53,153",
"2020-06-23,08:30,40.53,40.56,40.33,40.34,220",
"2020-06-23,08:45,40.35,40.37,40.25,40.26,383",
"2020-06-23,09:00,40.27,40.47,40.26,40.40,457",
"2020-06-23,09:15,40.40,40.46,40.29,40.32,347",
"2020-06-23,09:30,40.31,40.54,40.27,40.52,419",
"2020-06-23,09:45,40.52,40.57,40.48,40.51,356",
"2020-06-23,10:00,40.53,40.57,40.43,40.53,695",
"2020-06-23,10:15,40.54,40.79,40.54,40.76,617",
"2020-06-23,10:30,40.77,40.89,40.74,40.88,499",
"2020-06-23,10:45,40.87,41.01,40.85,41.01,369",
"2020-06-23,11:00,41.02,41.04,40.88,40.97,476",
"2020-06-23,11:15,40.96,41.11,40.95,41.09,550",
"2020-06-23,11:30,41.08,41.17,40.90,41.01,532",
"2020-06-23,11:45,41.00,41.01,40.88,40.88,385",
"2020-06-23,12:00,40.87,40.96,40.79,40.87,456",
"2020-06-23,12:15,40.88,41.11,40.87,41.10,296",
"2020-06-23,12:30,41.10,41.29,41.10,41.28,458",
"2020-06-23,12:45,41.27,41.36,41.21,41.32,499",
"2020-06-23,13:00,41.33,41.55,41.27,41.52,483",
"2020-06-23,13:15,41.51,41.52,41.40,41.43,398",
"2020-06-23,13:30,41.44,41.44,41.36,41.41,300",
"2020-06-23,13:45,41.41,41.50,41.37,41.42,334",
"2020-06-23,14:00,41.41,41.57,41.37,41.41,382",
"2020-06-23,14:15,41.41,41.49,41.37,41.43,354",
"2020-06-23,14:30,41.44,41.57,41.43,41.51,270",
"2020-06-23,14:45,41.50,41.53,41.39,41.41,216",
"2020-06-23,15:00,41.42,41.61,41.38,41.55,389",
"2020-06-23,15:15,41.55,41.59,41.33,41.37,339",
"2020-06-23,15:30,41.36,41.38,41.18,41.24,400",
"2020-06-23,15:45,41.25,41.25,41.03,41.13,423",
"2020-06-23,16:00,41.14,41.24,40.91,40.91,672",
"2020-06-23,16:15,40.92,41.12,40.84,41.12,552",
"2020-06-23,16:30,41.13,41.13,40.98,41.05,778",
"2020-06-23,16:45,41.06,41.06,40.60,40.66,930",
"2020-06-23,17:00,40.65,41.02,40.63,40.93,905",
"2020-06-23,17:15,40.92,41.07,40.92,41.00,537",
"2020-06-23,17:30,41.01,41.11,40.90,40.90,708",
"2020-06-23,17:45,40.90,41.04,40.74,41.04,791",
"2020-06-23,18:00,41.03,41.19,40.96,41.16,642",
"2020-06-23,18:15,41.16,41.23,41.09,41.17,619",
"2020-06-23,18:30,41.17,41.27,41.07,41.18,566",
"2020-06-23,18:45,41.19,41.20,40.77,40.92,552",
"2020-06-23,19:00,40.92,40.99,40.69,40.78,538",
"2020-06-23,19:15,40.77,40.89,40.72,40.89,434",
"2020-06-23,19:30,40.88,41.02,40.88,40.98,427",
"2020-06-23,19:45,40.99,41.02,40.58,40.72,458",
"2020-06-23,20:00,40.73,40.84,40.72,40.84,251",
"2020-06-23,20:15,40.83,40.88,40.36,40.46,594",
"2020-06-23,20:30,40.47,40.52,40.22,40.46,613",
"2020-06-23,20:45,40.47,40.57,40.19,40.21,780",
"2020-06-23,21:00,40.19,40.34,40.01,40.30,743",
"2020-06-23,21:15,40.29,40.41,40.15,40.37,808",
"2020-06-23,21:30,40.36,40.46,40.33,40.39,355",
"2020-06-23,21:45,40.40,40.43,40.29,40.31,396",
"2020-06-23,22:00,40.32,40.33,40.12,40.13,357",
"2020-06-23,22:15,40.12,40.25,40.08,40.14,288",
"2020-06-23,22:30,40.13,40.20,40.13,40.20,244",
"2020-06-23,22:45,40.19,40.25,40.15,40.25,322",
"2020-06-23,23:00,40.23,40.28,40.17,40.22,174",
"2020-06-23,23:15,40.21,40.27,40.13,40.22,131",
"2020-06-23,23:30,40.21,40.27,40.05,40.26,255",
"2020-06-23,23:45,40.26,40.26,39.95,39.97,317",
"2020-06-24,01:00,39.99,40.22,39.98,40.20,291",
"2020-06-24,01:15,40.21,40.23,40.15,40.21,127",
"2020-06-24,01:30,40.22,40.27,40.15,40.19,187",
"2020-06-24,01:45,40.18,40.18,39.85,39.98,208",
"2020-06-24,02:00,39.97,40.03,39.91,39.95,202",
"2020-06-24,02:15,39.95,40.05,39.94,40.05,122",
"2020-06-24,02:30,40.04,40.11,40.01,40.07,152",
"2020-06-24,02:45,40.04,40.09,40.00,40.08,83",
"2020-06-24,03:00,40.09,40.26,40.05,40.21,425",
"2020-06-24,03:15,40.20,40.36,40.17,40.31,258",
"2020-06-24,03:30,40.32,40.41,40.27,40.31,191",
"2020-06-24,03:45,40.30,40.39,40.29,40.33,154",
"2020-06-24,04:00,40.33,40.35,40.22,40.30,222",
"2020-06-24,04:15,40.31,40.38,40.28,40.29,143",
"2020-06-24,04:30,40.28,40.32,40.23,40.23,257",
"2020-06-24,04:45,40.22,40.23,40.09,40.16,302",
"2020-06-24,05:00,40.15,40.20,40.03,40.09,277",
"2020-06-24,05:15,40.09,40.13,39.99,40.07,182",
"2020-06-24,05:30,40.06,40.14,40.03,40.11,202",
"2020-06-24,05:45,40.10,40.11,40.01,40.02,147",
"2020-06-24,06:00,40.01,40.06,39.96,40.05,197",
"2020-06-24,06:15,40.05,40.13,40.04,40.04,136",
"2020-06-24,06:30,40.03,40.07,39.95,40.06,206",
"2020-06-24,06:45,40.06,40.16,40.04,40.15,119",
"2020-06-24,07:00,40.15,40.16,40.10,40.15,118",
"2020-06-24,07:15,40.16,40.20,40.12,40.18,85",
"2020-06-24,07:30,40.17,40.26,40.17,40.19,130",
"2020-06-24,07:45,40.20,40.23,40.17,40.19,102",
"2020-06-24,08:00,40.18,40.18,40.07,40.12,136",
"2020-06-24,08:15,40.11,40.17,40.11,40.14,111",
"2020-06-24,08:30,40.13,40.24,40.13,40.21,176",
"2020-06-24,08:45,40.20,40.22,40.14,40.14,140",
"2020-06-24,09:00,40.13,40.26,40.08,40.22,211",
"2020-06-24,09:15,40.22,40.39,40.22,40.38,274",
"2020-06-24,09:30,40.39,40.40,40.32,40.35,189",
"2020-06-24,09:45,40.36,40.40,40.33,40.38,200",
"2020-06-24,10:00,40.38,40.51,40.26,40.49,596",
"2020-06-24,10:15,40.48,40.51,40.39,40.40,357",
"2020-06-24,10:30,40.41,40.44,39.99,40.02,616",
"2020-06-24,10:45,40.01,40.08,39.87,40.05,630",
"2020-06-24,11:00,40.05,40.13,39.70,39.71,693",
"2020-06-24,11:15,39.70,39.93,39.56,39.82,971",
"2020-06-24,11:30,39.83,39.88,39.67,39.69,625",
"2020-06-24,11:45,39.70,39.85,39.68,39.71,453",
"2020-06-24,12:00,39.70,39.86,39.52,39.59,617",
"2020-06-24,12:15,39.58,39.68,39.42,39.55,712",
"2020-06-24,12:30,39.56,39.78,39.55,39.72,450",
"2020-06-24,12:45,39.71,39.91,39.71,39.76,394",
"2020-06-24,13:00,39.76,39.88,39.73,39.75,349",
"2020-06-24,13:15,39.76,39.83,39.65,39.66,448",
"2020-06-24,13:30,39.65,39.72,39.54,39.55,379",
"2020-06-24,13:45,39.55,39.65,39.55,39.56,278",
"2020-06-24,14:00,39.57,39.63,39.50,39.53,373",
"2020-06-24,14:15,39.52,39.61,39.39,39.43,351",
"2020-06-24,14:30,39.44,39.51,39.35,39.51,304",
"2020-06-24,14:45,39.50,39.55,39.43,39.49,228",
"2020-06-24,15:00,39.50,39.54,39.42,39.46,161"];


