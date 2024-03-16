"use client";

import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const rootTheme = createTheme({
  palette: {
    primary: {
      main: blue[500],
      contrastText: "#fff", //button text white instead of black
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
