"use client";

import withAuth from "@/utils/withAuth";

function Home() {
  return <div>Welcome to the Admin Panel</div>;
}

export default withAuth(Home);
