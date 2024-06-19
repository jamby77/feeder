"use client";

import { useEffect } from "react";
import { db, setup } from "@/lib/db";

const HomePage = () => {
  useEffect(() => {
    if (!db) {
      console.log("db not found");
      return;
    }
    setup();
  }, []);
  return <main>Home Page</main>;
};

export default HomePage;
